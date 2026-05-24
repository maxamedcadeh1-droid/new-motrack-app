import { useCallback, useEffect, useRef, useState } from 'react';
import {
  mockDb,
  subscribeToLocalWorkspaceChanges,
  WorkspaceMutationDetail,
} from '../lib/supabase';
import {
  makeRealtimeMutationDetail,
  RealtimeConnectionState,
  subscribeToSupabaseWorkspaceRealtime,
} from '../lib/realtime';

export type WorkspaceSnapshot = {
  profile: any;
  projects: any[];
  activeProjects: any[];
  subtasks: any[];
  dailyActivities: any[];
  weeklyGoals: any[];
  notes: any[];
  focusSessions: any[];
  recentLogs: any[];
  habits: any[];
  completedSubtasksCount: number;
  pendingSubtasksCount: number;
  focusMinSum: number;
  weeklyProgress: {
    done: number;
    target: number;
  };
  habitConsistency: number;
  momentum: {
    score: number;
    streak: number;
  };
};

async function readWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
  const [
    profileResult,
    projectsResult,
    subtasksResult,
    logsResult,
    focusResult,
    goalsResult,
    activitiesResult,
    notesResult,
    habitsResult,
  ] = await Promise.all([
    mockDb.getProfile(),
    mockDb.getProjects(),
    mockDb.getSubtasks(),
    mockDb.getActivityLogs(),
    mockDb.getFocusSessions(),
    mockDb.getWeeklyGoals(),
    mockDb.getDailyActivities(),
    mockDb.getNotes(),
    mockDb.getHabits(),
  ]);

  const projects = projectsResult.data || [];
  const subtasks = subtasksResult.data || [];
  const weeklyGoals = goalsResult.data || [];
  const focusSessions = focusResult.data || [];
  const dailyActivities = activitiesResult.data || [];
  const habits = habitsResult.data || [];
  const completedSubtasksCount = subtasks.filter(s => s.is_completed).length;
  const pendingSubtasksCount = subtasks.length - completedSubtasksCount;
  const focusMinSum = focusSessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const completedGoals = weeklyGoals.filter(g => g.status === 'Completed').length;

  return {
    profile: profileResult.data,
    projects,
    activeProjects: projects.filter(p => p.status !== 'Completed'),
    subtasks,
    dailyActivities,
    weeklyGoals,
    notes: notesResult.data || [],
    focusSessions,
    recentLogs: logsResult.data ? logsResult.data.slice(0, 5) : [],
    habits,
    completedSubtasksCount,
    pendingSubtasksCount,
    focusMinSum,
    weeklyProgress: {
      done: completedGoals,
      target: weeklyGoals.length,
    },
    habitConsistency: mockDb.getWeeklyConsistencyScore(),
    momentum: mockDb.getMomentumScore(),
  };
}

export function useWorkspaceSnapshot() {
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [lastMutation, setLastMutation] = useState<WorkspaceMutationDetail | null>(null);
  const [realtimeState, setRealtimeState] = useState<RealtimeConnectionState>({
    status: 'idle',
    message: 'Realtime idle.',
  });

  const requestRef = useRef(0);
  const loadedRef = useRef(false);

  const refresh = useCallback(async (detail?: Partial<WorkspaceMutationDetail>) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    if (loadedRef.current) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    if (detail) {
      setLastMutation(makeRealtimeMutationDetail(detail));
    }

    try {
      const nextSnapshot = await readWorkspaceSnapshot();
      if (requestRef.current !== requestId) return;

      setSnapshot(nextSnapshot);
      setLastUpdatedAt(new Date().toISOString());
      setError(null);
      loadedRef.current = true;
    } catch (err: any) {
      if (requestRef.current !== requestId) return;

      const message = err?.message || 'Could not refresh workspace data.';
      setError(message);
      setLastMutation(makeRealtimeMutationDetail({
        entity: detail?.entity || 'workspace',
        action: detail?.action || 'refresh',
        status: 'error',
        message,
      }));
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    refresh({
      entity: 'workspace',
      action: 'initial-load',
      status: 'loading',
      message: 'Loading live workspace data.',
    });

    const unsubscribeLocal = subscribeToLocalWorkspaceChanges(detail => {
      refresh(detail);
    });

    const unsubscribeRemote = subscribeToSupabaseWorkspaceRealtime(setRealtimeState);

    return () => {
      unsubscribeLocal();
      unsubscribeRemote();
    };
  }, [refresh]);

  return {
    snapshot,
    loading,
    isRefreshing,
    error,
    lastUpdatedAt,
    lastMutation,
    realtimeState,
    refresh,
  };
}
