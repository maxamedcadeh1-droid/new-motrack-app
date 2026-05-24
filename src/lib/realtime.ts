import {
  applyWorkspaceRealtimePayload,
  emitWorkspaceChange,
  supabase,
  WorkspaceMutationDetail,
} from './supabase';

export const WORKSPACE_REALTIME_TABLES = [
  'profiles',
  'projects',
  'subtasks',
  'daily_activities',
  'weekly_goals',
  'notes',
  'focus_sessions',
  'activity_logs',
  'habits',
];

export type RealtimeConnectionState = {
  status: 'idle' | 'connecting' | 'subscribed' | 'error' | 'closed';
  message: string;
};

type WorkspaceRealtimeChannel = ReturnType<typeof supabase.channel>;

let realtimeChannel: WorkspaceRealtimeChannel | null = null;
let subscriberCount = 0;
const statusListeners = new Set<(state: RealtimeConnectionState) => void>();
let currentRealtimeState: RealtimeConnectionState = {
  status: 'idle',
  message: 'Realtime idle.',
};

function toReadableEntity(table: string) {
  return table.replace(/_/g, ' ');
}

function notifyRealtimeState(state: RealtimeConnectionState) {
  currentRealtimeState = state;
  statusListeners.forEach(listener => listener(state));
}

function createRealtimeChannel() {
  notifyRealtimeState({ status: 'connecting', message: 'Connecting realtime workspace updates.' });

  const channel = supabase.channel(`motrack-workspace-realtime-${Date.now()}`);

  WORKSPACE_REALTIME_TABLES.forEach(table => {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      payload => {
        applyWorkspaceRealtimePayload(
          payload.table || table,
          payload.eventType,
          payload.new,
          payload.old,
        );

        emitWorkspaceChange({
          entity: payload.table || table,
          action: payload.eventType?.toLowerCase() || 'remote-change',
          status: 'success',
          message: `${toReadableEntity(payload.table || table)} updated from Supabase.`,
        });
      },
    );
  });

  channel.subscribe((status, error) => {
    if (status === 'SUBSCRIBED') {
      notifyRealtimeState({ status: 'subscribed', message: 'Realtime workspace updates active.' });
      return;
    }

    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      notifyRealtimeState({
        status: 'error',
        message: error?.message || 'Realtime connection could not be established.',
      });
      return;
    }

    if (status === 'CLOSED') {
      notifyRealtimeState({ status: 'closed', message: 'Realtime workspace updates closed.' });
    }
  });

  return channel;
}

export function subscribeToSupabaseWorkspaceRealtime(
  onStatus?: (state: RealtimeConnectionState) => void,
) {
  subscriberCount += 1;

  if (onStatus) {
    statusListeners.add(onStatus);
    onStatus(currentRealtimeState);
  }

  if (!realtimeChannel) {
    realtimeChannel = createRealtimeChannel();
  }

  return () => {
    subscriberCount = Math.max(0, subscriberCount - 1);

    if (onStatus) {
      statusListeners.delete(onStatus);
    }

    if (subscriberCount === 0 && realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
      notifyRealtimeState({ status: 'closed', message: 'Realtime workspace updates closed.' });
    }
  };
}

export function makeRealtimeMutationDetail(detail?: Partial<WorkspaceMutationDetail>): WorkspaceMutationDetail {
  return {
    entity: detail?.entity || 'workspace',
    action: detail?.action || 'refresh',
    status: detail?.status || 'success',
    message: detail?.message || 'Workspace updated.',
    at: detail?.at || new Date().toISOString(),
  };
}
