import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to .env.local.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Local workspace data store for productivity objects. Authentication is handled by Supabase Auth.
const STORAGE_PREFIX = 'motrack_';
export const MOTRACK_DATA_CHANGED_EVENT = 'motrack_data_changed';

export type WorkspaceMutationStatus = 'loading' | 'success' | 'error';

export type WorkspaceMutationDetail = {
  entity: string;
  action: string;
  status: WorkspaceMutationStatus;
  message?: string;
  at: string;
};

const workspaceBroadcast =
  typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('motrack_workspace_updates')
    : null;

export function emitWorkspaceChange(detail?: Partial<WorkspaceMutationDetail>) {
  if (typeof window === 'undefined') return;

  const payload: WorkspaceMutationDetail = {
    entity: detail?.entity || 'workspace',
    action: detail?.action || 'refresh',
    status: detail?.status || 'success',
    message: detail?.message || 'Workspace updated.',
    at: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent<WorkspaceMutationDetail>(MOTRACK_DATA_CHANGED_EVENT, { detail: payload }));

  try {
    workspaceBroadcast?.postMessage(payload);
  } catch {
    // Ignore cross-tab notification failures.
  }
}

export function subscribeToLocalWorkspaceChanges(listener: (detail: WorkspaceMutationDetail) => void) {
  if (typeof window === 'undefined') return () => {};

  const handleWindowEvent = (event: Event) => {
    listener((event as CustomEvent<WorkspaceMutationDetail>).detail || {
      entity: 'workspace',
      action: 'refresh',
      status: 'success',
      message: 'Workspace updated.',
      at: new Date().toISOString(),
    });
  };

  const handleBroadcast = (event: MessageEvent<WorkspaceMutationDetail>) => {
    listener(event.data);
  };

  window.addEventListener(MOTRACK_DATA_CHANGED_EVENT, handleWindowEvent);
  workspaceBroadcast?.addEventListener('message', handleBroadcast);

  return () => {
    window.removeEventListener(MOTRACK_DATA_CHANGED_EVENT, handleWindowEvent);
    workspaceBroadcast?.removeEventListener('message', handleBroadcast);
  };
}

try {
  localStorage.removeItem(STORAGE_PREFIX + 'user_session');
} catch {
  // Ignore storage cleanup failures in restricted browser contexts.
}

function getStorage<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(STORAGE_PREFIX + key);
  if (!data) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

// Pre-populated default mockup data
const defaultProfile = {
  id: 'mohamed-student-uuid-1122',
  full_name: 'Mohamed',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  university: 'Massachusetts Institute of Technology (MIT)',
  department: 'Electrical Engineering & Computer Science (EECS)',
  goal: 'Build software that maximizes human leverage & personal momentum.',
  created_at: new Date().toISOString()
};

const defaultProjects = [
  {
    id: 'proj-1',
    user_id: 'mohamed-student-uuid-1122',
    title: 'MoTrack Student OS',
    description: 'A premium, neon glass student productivity operating system built to streamline goals, tasks, notes, and deep focus loops.',
    category: 'Development',
    priority: 'High',
    status: 'In Progress',
    progress: 50,
    start_date: '2026-05-15',
    end_date: '2026-06-15',
    deadline: '2026-06-10',
    notes: 'Primary stack: React, Vite, Tailwind CSS v4, Motion, Supabase. Needs glass design, glowing borders, smooth slide-ins.',
    created_at: '2026-05-15T08:00:00Z',
    updated_at: '2026-05-22T08:00:00Z'
  },
  {
    id: 'proj-2',
    user_id: 'mohamed-student-uuid-1122',
    title: 'EECS 301 Machine Learning Research',
    description: 'Developing low-parameter transformer heuristics for sequence labeling on noisy text datasets.',
    category: 'Academics',
    priority: 'High',
    status: 'In Progress',
    progress: 25,
    start_date: '2026-05-10',
    end_date: '2026-06-20',
    deadline: '2026-06-18',
    notes: 'Reference papers: Attention Is All You Need, Chinchilla Scale Laws.',
    created_at: '2026-05-10T10:00:00Z',
    updated_at: '2026-05-20T12:00:00Z'
  },
  {
    id: 'proj-3',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Personal Finance & Ledger',
    description: 'A lightweight double-entry book tracker utilizing local JSON lines for micro-auditing.',
    category: 'Finance',
    priority: 'Low',
    status: 'Not Started',
    progress: 0,
    start_date: '2026-06-01',
    end_date: '2026-06-30',
    deadline: '2026-06-28',
    notes: 'Planned integration: spreadsheet export functionality.',
    created_at: '2026-05-21T09:00:00Z',
    updated_at: '2026-05-21T09:00:00Z'
  }
];

const defaultSubtasks = [
  {
    id: 'sub-1',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-1',
    title: 'Establish PostgreSQL Database Schema & RLS',
    description: 'Design supabase/schema.sql and execute standard grants, trigger triggers, and configure security parameters.',
    priority: 'High',
    status: 'Completed',
    start_time: '2026-05-15T09:00:00Z',
    end_time: '2026-05-15T12:00:00Z',
    due_date: '2026-05-18',
    is_completed: true,
    created_at: '2026-05-15T09:00:00Z',
    updated_at: '2026-05-15T12:00:00Z'
  },
  {
    id: 'sub-2',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-1',
    title: 'Design Dark Glass UI with Violet & Blue Accents',
    description: 'Polish borders, glow shades, custom grid templates, and glass backdrop filters.',
    priority: 'High',
    status: 'Completed',
    start_time: '2026-05-16T10:00:00Z',
    end_time: '2026-05-16T16:00:00Z',
    due_date: '2026-05-20',
    is_completed: true,
    created_at: '2026-05-16T10:00:00Z',
    updated_at: '2026-05-16T16:00:00Z'
  },
  {
    id: 'sub-3',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-1',
    title: 'Integrate Live Pomodoro timer & Ambient sounds',
    description: 'Timer should trigger local notifications or state feedback. Save focus loop statistics upon session wrap.',
    priority: 'Medium',
    status: 'Not Started',
    start_time: '',
    end_time: '',
    due_date: '2026-05-25',
    is_completed: false,
    created_at: '2026-05-17T11:00:00Z',
    updated_at: '2026-05-17T11:00:00Z'
  },
  {
    id: 'sub-4',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-1',
    title: 'Connect Recharts Analytics dashboard components',
    description: 'Format daily timelines, compile streak graphs, and map current Momentum levels beautifully.',
    priority: 'Medium',
    status: 'Not Started',
    start_time: '',
    end_time: '',
    due_date: '2026-05-28',
    is_completed: false,
    created_at: '2026-05-18T08:00:00Z',
    updated_at: '2026-05-18T08:00:00Z'
  },
  {
    id: 'sub-5',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-2',
    title: 'Curate Machine Learning Sequence Datasets',
    description: 'Download raw benchmarks and clean parsing structures using custom regex filter scripts.',
    priority: 'High',
    status: 'Completed',
    start_time: '2026-05-10T11:00:00Z',
    end_time: '2026-05-10T15:00:00Z',
    due_date: '2026-05-12',
    is_completed: true,
    created_at: '2026-05-10T11:00:00Z',
    updated_at: '2026-05-10T15:00:00Z'
  },
  {
    id: 'sub-6',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-2',
    title: 'Implement Multi-Head Heuristic Class Draft',
    description: 'Prototype weights initialization and linear maps tracking.',
    priority: 'High',
    status: 'Not Started',
    start_time: '',
    end_time: '',
    due_date: '2026-05-30',
    is_completed: false,
    created_at: '2026-05-12T09:00:00Z',
    updated_at: '2026-05-12T09:00:00Z'
  },
  {
    id: 'sub-7',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-2',
    title: 'Train Baseline model with 10M Token sequence',
    description: 'Track loss values, perplexity statistics, and convergence triggers.',
    priority: 'Medium',
    status: 'Not Started',
    start_time: '',
    end_time: '',
    due_date: '2026-06-05',
    is_completed: false,
    created_at: '2026-05-14T14:00:00Z',
    updated_at: '2026-05-14T14:00:00Z'
  }
];

const defaultDailyActivities = [
  {
    id: 'act-1',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Core AI Architecture Design & Schema Session',
    type: 'Study',
    date: '2026-05-22',
    start_time: '2026-05-22T08:00:00Z',
    end_time: '2026-05-22T10:00:00Z',
    duration: 120,
    notes: 'Configured local states, setup TS modules, reviewed routing patterns.',
    status: 'Completed',
    created_at: '2026-05-22T08:00:00Z'
  },
  {
    id: 'act-2',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Gym Session - Focus on Deadlifts & Core Work',
    type: 'Exercise',
    date: '2026-05-22',
    start_time: '2026-05-22T17:00:00Z',
    end_time: '2026-05-22T18:00:00Z',
    duration: 60,
    notes: 'Broke PR with deadlifts, did 4 sets of planks. Highly energetic.',
    status: 'Completed',
    created_at: '2026-05-22T17:00:00Z'
  },
  {
    id: 'act-3',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Reading Atomic Habits Chapter 5',
    type: 'Reading',
    date: '2026-05-21',
    start_time: '2026-05-21T21:00:00Z',
    end_time: '2026-05-21T21:45:00Z',
    duration: 45,
    notes: 'Focused on environment design and cues setup. Added new notes to file.',
    status: 'Completed',
    created_at: '2026-05-21T21:00:00Z'
  },
  {
    id: 'act-4',
    user_id: 'mohamed-student-uuid-1122',
    title: 'CS301 Algorithm Lab Homework',
    type: 'Academics',
    date: '2026-05-21',
    start_time: '2026-05-21T14:00:00Z',
    end_time: '2026-05-21T16:30:00Z',
    duration: 150,
    notes: 'Solved dynamic programming recurrence matrices. Code validated.',
    status: 'Completed',
    created_at: '2026-05-21T14:00:00Z'
  }
];

const defaultWeeklyGoals = [
  {
    id: 'goal-1',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Complete 300 minutes of productive Focus Timer logs',
    week_start: '2026-05-18',
    week_end: '2026-05-24',
    target: 300,
    progress: 215,
    status: 'In Progress',
    created_at: '2026-05-18T00:00:00Z'
  },
  {
    id: 'goal-2',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Refactor MoTrack core state layout module',
    week_start: '2026-05-18',
    week_end: '2026-05-24',
    target: 1,
    progress: 1,
    status: 'Completed',
    created_at: '2026-05-18T00:00:00Z'
  },
  {
    id: 'goal-3',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Read 2 research articles on AI embeddings',
    week_start: '2026-05-18',
    week_end: '2026-05-24',
    target: 2,
    progress: 0,
    status: 'In Progress',
    created_at: '2026-05-19T08:00:00Z'
  }
];

const defaultNotes = [
  {
    id: 'note-1',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-1',
    title: 'Supabase RLS Policy Masterlist',
    content: `## Row-Level Security Policies for MoTrack

We must enable RLS on every table to keep Mohamed's credentials completely segmented and secure:

\`\`\`sql
-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Profiles: Allow users to view/edit their own profile
CREATE POLICY "Users can fully manage own profiles" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Projects: Only access own projects
CREATE POLICY "Users can fully manage own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);
\`\`\`

Ensure the \`user_id\` column is defaulted to \`auth.uid()\` on inserts inside Supabase dashboard templates to simplify frontend requests!`,
    category: 'Technical',
    tags: ['Supabase', 'SQL', 'Security'],
    is_pinned: true,
    created_at: '2026-05-20T09:00:00Z',
    updated_at: '2026-05-20T11:00:00Z'
  },
  {
    id: 'note-2',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-1',
    title: 'MoTrack Glassmorphic Palette Ideas',
    content: `## Design Specs & Variables

Here are the premium cinematic styling parameters we selected for our glass effects:

- **Primary Background**: Midnight velvet (\`bg-[#030307]\` with matching radial overlays).
- **Glass Panel**: Dense blurry borders with subtle glow effects (\`bg-neutral-900/40 backdrop-blur-xl border border-white/8\`).
- **Gradients**: Violet to Electric Blue transition vectors on headings and glowing widgets:
  - Electric Violet: \`from-fuchsia-500 via-purple-600 to-indigo-500\`
  - Neon Cyan: \`from-cyan-400 to-blue-600\`
  - High fidelity blur bubbles matching the active Momentum coefficient.`,
    category: 'Design',
    tags: ['Tailwind', 'CSS', 'Figma'],
    is_pinned: false,
    created_at: '2026-05-21T10:00:00Z',
    updated_at: '2026-05-21T10:00:00Z'
  }
];

const defaultFocusSessions = [
  {
    id: 'foc-1',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-1',
    duration: 50,
    session_type: 'Focus',
    completed_at: '2026-05-21T15:00:00Z',
    notes: 'Worked on glass cards and mobile margins. Very quiet and satisfying.'
  },
  {
    id: 'foc-2',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-1',
    duration: 25,
    session_type: 'Focus',
    completed_at: '2026-05-21T16:30:00Z',
    notes: 'Configured router parameters and finished dynamic outlet styling.'
  },
  {
    id: 'foc-3',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-2',
    duration: 90,
    session_type: 'Focus',
    completed_at: '2026-05-22T09:30:00Z',
    notes: 'Reviewed Sequence labeling transformer research paper. Took comprehensive notes in section A.'
  },
  {
    id: 'foc-4',
    user_id: 'mohamed-student-uuid-1122',
    project_id: 'proj-1',
    duration: 50,
    session_type: 'Focus',
    completed_at: '2026-05-22T14:15:00Z',
    notes: 'Designed custom Momentum score formula to scale with focus loops and completed subtasks.'
  }
];

const defaultActivityLogs = [
  {
    id: 'log-1',
    user_id: 'mohamed-student-uuid-1122',
    action: 'CREATE_PROJECT',
    entity_type: 'projects',
    entity_id: 'proj-1',
    description: 'Created new Project: "MoTrack Student OS"',
    created_at: '2026-05-15T08:00:00Z'
  },
  {
    id: 'log-2',
    user_id: 'mohamed-student-uuid-1122',
    action: 'COMPLETE_SUBTASK',
    entity_type: 'subtasks',
    entity_id: 'sub-1',
    description: 'Completed "Database Schema Design & RLS"',
    created_at: '2026-05-15T12:00:00Z'
  },
  {
    id: 'log-3',
    user_id: 'mohamed-student-uuid-1122',
    action: 'COMPLETE_SUBTASK',
    entity_type: 'subtasks',
    entity_id: 'sub-2',
    description: 'Completed "Design Dark Glass UI with Violet & Blue Accents"',
    created_at: '2026-05-16T16:00:00Z'
  },
  {
    id: 'log-4',
    user_id: 'mohamed-student-uuid-1122',
    action: 'CREATE_NOTE',
    entity_type: 'notes',
    entity_id: 'note-1',
    description: 'Created a detailed markdown reference detailing "Supabase RLS Policy Masterlist"',
    created_at: '2026-05-20T09:00:00Z'
  }
];

const defaultHabits = [
  {
    id: 'habit-1',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Hydration Challenge',
    category: 'Health',
    frequency: 'Daily',
    completed_dates: [
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'habit-2',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Mindful Meditation',
    category: 'Mindset',
    frequency: 'Daily',
    completed_dates: [
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ],
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'habit-3',
    user_id: 'mohamed-student-uuid-1122',
    title: 'Read 10 Pages CS Literature',
    category: 'Academics',
    frequency: 'Daily',
    completed_dates: [
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ],
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Ensure pre-populations are robust
getStorage('profile', defaultProfile);
getStorage('projects', defaultProjects);
getStorage('subtasks', defaultSubtasks);
getStorage('daily_activities', defaultDailyActivities);
getStorage('weekly_goals', defaultWeeklyGoals);
getStorage('notes', defaultNotes);
getStorage('focus_sessions', defaultFocusSessions);
getStorage('activity_logs', defaultActivityLogs);
getStorage('habits', defaultHabits);

// Reusable custom log trigger
export function addMockActivityLog(action: string, entity_type: string, entity_id: string, description: string) {
  const logs = getStorage<any[]>('activity_logs', defaultActivityLogs);
  const newLog = {
    id: 'log-' + Math.random().toString(36).substr(2, 9),
    user_id: 'mohamed-student-uuid-1122',
    action,
    entity_type,
    entity_id,
    description,
    created_at: new Date().toISOString()
  };
  logs.unshift(newLog);
  setStorage('activity_logs', logs);
}

const realtimeTableDefaults: Record<string, any[]> = {
  projects: defaultProjects,
  subtasks: defaultSubtasks,
  daily_activities: defaultDailyActivities,
  weekly_goals: defaultWeeklyGoals,
  notes: defaultNotes,
  focus_sessions: defaultFocusSessions,
  activity_logs: defaultActivityLogs,
  habits: defaultHabits,
};

export function applyWorkspaceRealtimePayload(
  table: string,
  eventType: string,
  nextRecord: any,
  previousRecord: any,
) {
  if (!table) return;

  if (table === 'profiles') {
    if (eventType !== 'DELETE' && nextRecord) {
      const currentProfile = getStorage('profile', defaultProfile);
      setStorage('profile', { ...currentProfile, ...nextRecord });
    }
    return;
  }

  const defaultValue = realtimeTableDefaults[table];
  if (!defaultValue) return;

  const existingRecords = getStorage<any[]>(table, defaultValue);
  const recordId = nextRecord?.id || previousRecord?.id;
  if (!recordId) return;

  if (eventType === 'DELETE') {
    setStorage(table, existingRecords.filter(record => record.id !== recordId));
    return;
  }

  const nextRecords = [...existingRecords];
  const existingIndex = nextRecords.findIndex(record => record.id === recordId);

  if (existingIndex >= 0) {
    nextRecords[existingIndex] = { ...nextRecords[existingIndex], ...nextRecord };
  } else {
    nextRecords.unshift(nextRecord);
  }

  setStorage(table, nextRecords);
}

// Productivity data operations. Auth/session state stays fully connected to Supabase.
export const mockDb = {
  getProfile: async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (user) {
      const profileFromAuth = {
        ...defaultProfile,
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
        avatar_url: user.user_metadata?.avatar_url || defaultProfile.avatar_url,
      };

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        return { data, error: null };
      }

      if (!error) {
        const { data: insertedProfile } = await supabase
          .from('profiles')
          .upsert(profileFromAuth, { onConflict: 'id' })
          .select()
          .single();

        return { data: insertedProfile || profileFromAuth, error: null };
      }

      return { data: profileFromAuth, error };
    }

    return { data: getStorage('profile', defaultProfile), error: null };
  },
  updateProfile: async (updates: any) => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (user) {
      await supabase.auth.updateUser({
        data: {
          full_name: updates.full_name,
          avatar_url: updates.avatar_url,
        },
      });

      const payload = {
        id: user.id,
        full_name: updates.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
        avatar_url: updates.avatar_url || defaultProfile.avatar_url,
        university: updates.university || '',
        department: updates.department || '',
        goal: updates.goal || '',
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      emitWorkspaceChange();
      if (!error && data) {
        return { data, error: null };
      }
    }

    const prof = { ...getStorage('profile', defaultProfile), ...updates };
    setStorage('profile', prof);
    emitWorkspaceChange();
    return { data: prof, error: null };
  },
  getProjects: async () => {
    return { data: getStorage<any[]>('projects', defaultProjects), error: null };
  },
  getProject: async (id: string) => {
    const proj = getStorage<any[]>('projects', defaultProjects).find(p => p.id === id);
    return { data: proj || null, error: proj ? null : 'Project not found' };
  },
  upsertProject: async (proj: any) => {
    const projs = getStorage<any[]>('projects', defaultProjects);
    let updated;
    const existingIdx = projs.findIndex(p => p.id === proj.id);
    if (existingIdx > -1) {
      updated = { ...projs[existingIdx], ...proj, updated_at: new Date().toISOString() };
      projs[existingIdx] = updated;
      addMockActivityLog('UPDATE_PROJECT', 'projects', proj.id, `Refactored details on Project: "${proj.title || updated.title}"`);
    } else {
      updated = {
        ...proj,
        id: proj.id || 'proj-' + Math.random().toString(36).substr(2, 9),
        user_id: 'mohamed-student-uuid-1122',
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      projs.push(updated);
      addMockActivityLog('CREATE_PROJECT', 'projects', updated.id, `Created project: "${updated.title}"`);
    }
    setStorage('projects', projs);
    emitWorkspaceChange();
    return { data: updated, error: null };
  },
  deleteProject: async (id: string) => {
    let projs = getStorage<any[]>('projects', defaultProjects);
    const target = projs.find(p => p.id === id);
    projs = projs.filter(p => p.id !== id);
    setStorage('projects', projs);
    
    // Also delete cascade subtasks
    let subs = getStorage<any[]>('subtasks', defaultSubtasks);
    subs = subs.filter(s => s.project_id !== id);
    setStorage('subtasks', subs);

    addMockActivityLog('DELETE_PROJECT', 'projects', id, `Deleted project: "${target?.title || id}"`);
    emitWorkspaceChange();
    return { error: null };
  },

  getSubtasks: async (projectId?: string) => {
    const subs = getStorage<any[]>('subtasks', defaultSubtasks);
    if (projectId) {
      return { data: subs.filter(s => s.project_id === projectId), error: null };
    }
    return { data: subs, error: null };
  },
  upsertSubtask: async (sub: any) => {
    const subs = getStorage<any[]>('subtasks', defaultSubtasks);
    let updated;
    const existingIdx = subs.findIndex(s => s.id === sub.id);
    if (existingIdx > -1) {
      updated = { ...subs[existingIdx], ...sub, updated_at: new Date().toISOString() };
      subs[existingIdx] = updated;
    } else {
      updated = {
        ...sub,
        id: sub.id || 'sub-' + Math.random().toString(36).substr(2, 9),
        user_id: 'mohamed-student-uuid-1122',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      subs.push(updated);
      addMockActivityLog('CREATE_SUBTASK', 'subtasks', updated.id, `Created key focus milestone: "${updated.title}"`);
    }
    setStorage('subtasks', subs);
    
    // Auto recompute project progress
    if (updated.project_id) {
      await mockDb.recalculateProjectProgress(updated.project_id);
    }
    
    emitWorkspaceChange();
    return { data: updated, error: null };
  },
  deleteSubtask: async (id: string) => {
    let subs = getStorage<any[]>('subtasks', defaultSubtasks);
    const sub = subs.find(s => s.id === id);
    subs = subs.filter(s => s.id !== id);
    setStorage('subtasks', subs);
    if (sub && sub.project_id) {
      await mockDb.recalculateProjectProgress(sub.project_id);
      addMockActivityLog('DELETE_SUBTASK', 'subtasks', id, `Removed micro-milestone: "${sub.title}"`);
    }
    emitWorkspaceChange();
    return { error: null };
  },
  toggleSubtask: async (id: string) => {
    const subs = getStorage<any[]>( 'subtasks', defaultSubtasks);
    const idx = subs.findIndex(s => s.id === id);
    if (idx > -1) {
      const sub = subs[idx];
      sub.is_completed = !sub.is_completed;
      sub.status = sub.is_completed ? 'Completed' : 'In Progress';
      sub.updated_at = new Date().toISOString();
      if (sub.is_completed) {
        sub.end_time = new Date().toISOString();
        addMockActivityLog('COMPLETE_SUBTASK', 'subtasks', sub.id, `Completed task: "${sub.title}"`);
      } else {
        sub.end_time = '';
        addMockActivityLog('INCOMPLETE_SUBTASK', 'subtasks', sub.id, `Marked subtask as active: "${sub.title}"`);
      }
      subs[idx] = sub;
      setStorage('subtasks', subs);
      
      if (sub.project_id) {
        await mockDb.recalculateProjectProgress(sub.project_id);
      }
      emitWorkspaceChange();
    }
    return { error: null };
  },
  recalculateProjectProgress: async (projectId: string) => {
    const subs = getStorage<any[]>('subtasks', defaultSubtasks).filter(s => s.project_id === projectId);
    const projs = getStorage<any[]>('projects', defaultProjects);
    const projIdx = projs.findIndex(p => p.id === projectId);
    if (projIdx > -1) {
      if (subs.length === 0) {
        // Leave progress alone or set to 0
      } else {
        const completed = subs.filter(s => s.is_completed).length;
        const progressPercent = Math.round((completed / subs.length) * 100);
        projs[projIdx].progress = progressPercent;
        projs[projIdx].status = progressPercent === 100 ? 'Completed' : (progressPercent > 0 ? 'In Progress' : 'Not Started');
        setStorage('projects', projs);
      }
    }
  },

  getDailyActivities: async () => {
    return { data: getStorage<any[]>('daily_activities', defaultDailyActivities), error: null };
  },
  upsertDailyActivity: async (act: any) => {
    const acts = getStorage<any[]>('daily_activities', defaultDailyActivities);
    let updated;
    const existingIdx = acts.findIndex(a => a.id === act.id);
    if (existingIdx > -1) {
      updated = { ...acts[existingIdx], ...act };
      acts[existingIdx] = updated;
    } else {
      updated = {
        ...act,
        id: act.id || 'act-' + Math.random().toString(36).substr(2, 9),
        user_id: 'mohamed-student-uuid-1122',
        created_at: new Date().toISOString()
      };
      acts.push(updated);
      addMockActivityLog('CREATE_ACTIVITY', 'daily_activities', updated.id, `Logged daily routine activity: "${updated.title}" (${updated.type})`);
    }
    setStorage('daily_activities', acts);
    emitWorkspaceChange();
    return { data: updated, error: null };
  },
  deleteDailyActivity: async (id: string) => {
    let acts = getStorage<any[]>('daily_activities', defaultDailyActivities);
    const target = acts.find(a => a.id === id);
    acts = acts.filter(a => a.id !== id);
    setStorage('daily_activities', acts);
    if (target) {
      addMockActivityLog('DELETE_ACTIVITY', 'daily_activities', id, `Erased timeline slot: "${target.title}"`);
    }
    emitWorkspaceChange();
    return { error: null };
  },

  getWeeklyGoals: async () => {
    return { data: getStorage<any[]>('weekly_goals', defaultWeeklyGoals), error: null };
  },
  upsertWeeklyGoal: async (goal: any) => {
    const goals = getStorage<any[]>('weekly_goals', defaultWeeklyGoals);
    let updated;
    const existingIdx = goals.findIndex(g => g.id === goal.id);
    if (existingIdx > -1) {
      updated = { ...goals[existingIdx], ...goal };
      goals[existingIdx] = updated;
    } else {
      // Find current week dates for Mohamed
      const today = new Date();
      const first = today.getDate() - today.getDay() + 1; // Monday
      const last = first + 6; // Sunday
      const monday = new Date(today.setDate(first)).toISOString().split('T')[0];
      const sunday = new Date(today.setDate(last)).toISOString().split('T')[0];

      updated = {
        ...goal,
        id: goal.id || 'goal-' + Math.random().toString(36).substr(2, 9),
        user_id: 'mohamed-student-uuid-1122',
        week_start: goal.week_start || monday,
        week_end: goal.week_end || sunday,
        progress: goal.progress || 0,
        status: goal.status || 'In Progress',
        created_at: new Date().toISOString()
      };
      goals.push(updated);
      addMockActivityLog('CREATE_WEEKLY_GOAL', 'weekly_goals', updated.id, `Set weekly baseline standard: "${updated.title}"`);
    }
    setStorage('weekly_goals', goals);
    emitWorkspaceChange();
    return { data: updated, error: null };
  },
  deleteWeeklyGoal: async (id: string) => {
    let goals = getStorage<any[]>('weekly_goals', defaultWeeklyGoals);
    const target = goals.find(g => g.id === id);
    goals = goals.filter(g => g.id !== id);
    setStorage('weekly_goals', goals);
    if (target) {
      addMockActivityLog('DELETE_WEEKLY_GOAL', 'weekly_goals', id, `Removed weekly intent goal: "${target.title}"`);
    }
    emitWorkspaceChange();
    return { error: null };
  },
  incrementWeeklyGoal: async (id: string, amt: number = 1) => {
    const goals = getStorage<any[]>('weekly_goals', defaultWeeklyGoals);
    const idx = goals.findIndex(g => g.id === id);
    if (idx > -1) {
      const g = goals[idx];
      g.progress = Math.min(g.target, g.progress + amt);
      if (g.progress >= g.target) {
        g.status = 'Completed';
        addMockActivityLog('COMPLETE_WEEKLY_GOAL', 'weekly_goals', g.id, `Completed weekly goal: "${g.title}"`);
      } else {
        addMockActivityLog('PROGRESS_WEEKLY_GOAL', 'weekly_goals', g.id, `Advanced weekly goal progress: "${g.title}" (${g.progress}/${g.target})`);
      }
      goals[idx] = g;
      setStorage('weekly_goals', goals);
      emitWorkspaceChange();
    }
    return { error: null };
  },

  getNotes: async () => {
    return { data: getStorage<any[]>('notes', defaultNotes), error: null };
  },
  upsertNote: async (note: any) => {
    const notesList = getStorage<any[]>('notes', defaultNotes);
    let updated;
    const existingIdx = notesList.findIndex(n => n.id === note.id);
    if (existingIdx > -1) {
      updated = { ...notesList[existingIdx], ...note, updated_at: new Date().toISOString() };
      notesList[existingIdx] = updated;
    } else {
      updated = {
        ...note,
        id: note.id || 'note-' + Math.random().toString(36).substr(2, 9),
        user_id: 'mohamed-student-uuid-1122',
        is_pinned: note.is_pinned || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      notesList.push(updated);
      addMockActivityLog('CREATE_NOTE', 'notes', updated.id, `Composed note entry: "${updated.title}"`);
    }
    setStorage('notes', notesList);
    emitWorkspaceChange();
    return { data: updated, error: null };
  },
  deleteNote: async (id: string) => {
    let notesList = getStorage<any[]>('notes', defaultNotes);
    const target = notesList.find(n => n.id === id);
    notesList = notesList.filter(n => n.id !== id);
    setStorage('notes', notesList);
    if (target) {
      addMockActivityLog('DELETE_NOTE', 'notes', id, `Discarded note card: "${target.title}"`);
    }
    emitWorkspaceChange();
    return { error: null };
  },
  togglePinNote: async (id: string) => {
    const notesList = getStorage<any[]>('notes', defaultNotes);
    const idx = notesList.findIndex(n => n.id === id);
    if (idx > -1) {
      notesList[idx].is_pinned = !notesList[idx].is_pinned;
      setStorage('notes', notesList);
      emitWorkspaceChange();
    }
    return { error: null };
  },

  getFocusSessions: async () => {
    return { data: getStorage<any[]>('focus_sessions', defaultFocusSessions), error: null };
  },
  addFocusSession: async (session: any) => {
    const sessions = getStorage<any[]>('focus_sessions', defaultFocusSessions);
    const newSession = {
      ...session,
      id: 'foc-' + Math.random().toString(36).substr(2, 9),
      user_id: 'mohamed-student-uuid-1122',
      completed_at: new Date().toISOString()
    };
    sessions.push(newSession);
    setStorage('focus_sessions', sessions);
    
    // Automatically add to Daily activities as well! Let's register it so it shows in the timeline
    await mockDb.upsertDailyActivity({
      title: `Deep Focus Block [${newSession.duration} min]`,
      type: 'Study',
      date: new Date().toISOString().split('T')[0],
      start_time: new Date(new Date().getTime() - newSession.duration * 60000).toISOString(),
      end_time: new Date().toISOString(),
      duration: newSession.duration,
      notes: newSession.notes || 'Focused session logged via Pomodoro micro-timer.',
      status: 'Completed'
    });

    // Increment weekly goals if any Pomodoro focus goal exists! Let's lookup focus goals
    const weeklys = getStorage<any[]>('weekly_goals', defaultWeeklyGoals);
    const focusGoalIdx = weeklys.findIndex(g => g.title.toLowerCase().includes('focus') || g.title.toLowerCase().includes('pomodoro'));
    if (focusGoalIdx > -1) {
      weeklys[focusGoalIdx].progress = Math.min(weeklys[focusGoalIdx].target, weeklys[focusGoalIdx].progress + newSession.duration);
      if (weeklys[focusGoalIdx].progress >= weeklys[focusGoalIdx].target) {
        weeklys[focusGoalIdx].status = 'Completed';
      }
      setStorage('weekly_goals', weeklys);
    }

    addMockActivityLog('COMPLETE_FOCUS', 'focus_sessions', newSession.id, `Completed focus session for ${newSession.duration} minutes`);
    emitWorkspaceChange();
    return { data: newSession, error: null };
  },

  getActivityLogs: async () => {
    return { data: getStorage<any[]>('activity_logs', defaultActivityLogs), error: null };
  },

  getHabits: async () => {
    return { data: getStorage<any[]>('habits', defaultHabits), error: null };
  },

  upsertHabit: async (habit: any) => {
    const habits = getStorage<any[]>('habits', defaultHabits);
    let updated;
    const existingIdx = habits.findIndex(h => h.id === habit.id);
    if (existingIdx > -1) {
      updated = { ...habits[existingIdx], ...habit };
      habits[existingIdx] = updated;
    } else {
      updated = {
        id: 'habit-' + Math.random().toString(36).substr(2, 9),
        user_id: 'mohamed-student-uuid-1122',
        title: habit.title,
        category: habit.category || 'Personal',
        frequency: habit.frequency || 'Daily',
        completed_dates: habit.completed_dates || [],
        created_at: new Date().toISOString()
      };
      habits.push(updated);
      addMockActivityLog('CREATE_HABIT', 'habits', updated.id, `Started a new daily habit loop: "${updated.title}"`);
    }
    setStorage('habits', habits);
    emitWorkspaceChange();
    return { data: updated, error: null };
  },

  deleteHabit: async (id: string) => {
    let habits = getStorage<any[]>('habits', defaultHabits);
    const target = habits.find(h => h.id === id);
    habits = habits.filter(h => h.id !== id);
    setStorage('habits', habits);
    if (target) {
      addMockActivityLog('DELETE_HABIT', 'habits', id, `Terminated habit routine: "${target.title}"`);
    }
    emitWorkspaceChange();
    return { error: null };
  },

  toggleHabit: async (id: string, dateStr: string) => {
    const habits = getStorage<any[]>('habits', defaultHabits);
    const idx = habits.findIndex(h => h.id === id);
    if (idx > -1) {
      const h = habits[idx];
      const dateIdx = h.completed_dates.indexOf(dateStr);
      if (dateIdx > -1) {
        h.completed_dates.splice(dateIdx, 1);
        addMockActivityLog('UNCHECK_HABIT', 'habits', h.id, `Unchecked Habit "${h.title}" for ${dateStr}`);
      } else {
        h.completed_dates.push(dateStr);
        addMockActivityLog('CHECK_HABIT', 'habits', h.id, `Completed habit "${h.title}" for ${dateStr}`);
      }
      habits[idx] = h;
      setStorage('habits', habits);
      emitWorkspaceChange();
    }
    return { error: null };
  },

  getWeeklyConsistencyScore: () => {
    const habits = getStorage<any[]>('habits', defaultHabits);
    if (habits.length === 0) return 100; // Perfect standard if no habits yet
    
    // Calculate last 7 days date strings
    const last7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }
    
    let totalLogsInLast7Days = 0;
    habits.forEach(h => {
      h.completed_dates.forEach((d: string) => {
        if (last7Days.includes(d)) {
          totalLogsInLast7Days++;
        }
      });
    });
    
    const possibleTotal = habits.length * 7;
    return Math.round((totalLogsInLast7Days / possibleTotal) * 100);
  },

  // Calculate high-fidelity Momentum Score based on completed variables:
  // Formula: (completed subtasks * 10) + (total focus minutes * 0.5) + (daily activities completed today * 15) - capped at 100
  getMomentumScore: () => {
    const subs = getStorage<any[]>('subtasks', defaultSubtasks);
    const sessions = getStorage<any[]>('focus_sessions', defaultFocusSessions);
    const acts = getStorage<any[]>('daily_activities', defaultDailyActivities);
    const habits = getStorage<any[]>('habits', defaultHabits);
    
    const completedSubsCount = subs.filter(s => s.is_completed).length;
    const focusMinSum = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    
    // Today's activities
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysCompletedActs = acts.filter(a => a.date === todayStr && a.status === 'Completed').length;

    // Today's completed habits
    const todaysCompletedHabitsCount = habits.filter(h => h.completed_dates && h.completed_dates.includes(todayStr)).length;

    const baseScore = (completedSubsCount * 8) + (focusMinSum * 0.25) + (todaysCompletedActs * 10) + (todaysCompletedHabitsCount * 12);
    const finalScore = Math.min(100, Math.max(15, Math.round(baseScore))); // ranges 15 to 100
    
    let streak = 5; // default pre-populated starting streak
    // Calculate streak from unique daily activities logging dates
    const uniqueDates = new Set([...acts.map(a => a.date), ...habits.flatMap(h => h.completed_dates || [])]);
    if (uniqueDates.size > 0) {
      streak = Math.max(streak, uniqueDates.size);
    }

    return { score: finalScore, streak };
  }
};
