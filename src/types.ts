export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  university: string;
  department: string;
  goal: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  start_date: string;
  end_date: string;
  deadline: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed';
  start_time: string;
  end_time: string;
  due_date: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  title: string;
  type: 'Study' | 'Project' | 'Exercise' | 'Reading' | 'Personal' | 'Other';
  date: string;
  start_time: string;
  end_time: string;
  duration: number; // in minutes
  notes: string;
  status: string;
  created_at: string;
}

export interface WeeklyGoal {
  id: string;
  user_id: string;
  title: string;
  week_start: string;
  week_end: string;
  target: number;
  progress: number;
  status: 'In Progress' | 'Completed';
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  project_id: string | null;
  duration: number; // minutes
  session_type: 'Focus' | 'Short Break' | 'Long Break';
  completed_at: string;
  notes: string | null;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  description: string;
  created_at: string;
}
