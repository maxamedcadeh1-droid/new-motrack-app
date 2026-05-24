import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Flame,
  Play,
  Send,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDb } from '../lib/supabase';
import {
  GlassCard,
  GlowCard,
  MomentumOrb,
  StatCard,
  LoadingState,
  EmptyState,
  GradientButton
} from '../components/Reusable';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState({ done: 0, target: 4 });
  const [focusMinSum, setFocusMinSum] = useState(0);
  const [momentum, setMomentum] = useState({ score: 75, streak: 5 });
  const [habitConsistency, setHabitConsistency] = useState(100);

  // Interactive AI Assistant states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleCallAiSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          context: {
            profile: {
              full_name: profile?.full_name,
              university: profile?.university,
              department: profile?.department,
              goal: profile?.goal
            },
            active_projects: projects.slice(0, 3).map(p => ({ title: p.title, progress: p.progress })),
            pending_subtasks: subtasks.filter(s => !s.is_completed).map(s => s.title)
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setAiResponse(data.text);
      } else {
        throw new Error(data.error || "Model feedback unresolved.");
      }
    } catch (err: any) {
      console.error(err);
      setAiResponse(`### Study Plan
- Schedule three focused 25-minute sprints for research and prototyping today.
- Complete ${subtasks.filter(s => !s.is_completed).length} pending tasks to move your active projects forward.
- Keep the next session small, specific, and easy to start.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const { data: prof } = await mockDb.getProfile();
      const { data: projs } = await mockDb.getProjects();
      const { data: subs } = await mockDb.getSubtasks();
      const { data: logs } = await mockDb.getActivityLogs();
      const { data: focus } = await mockDb.getFocusSessions();
      const { data: goals } = await mockDb.getWeeklyGoals();

      setProfile(prof);
      setProjects(projs || []);
      setSubtasks(subs || []);
      setRecentLogs(logs ? logs.slice(0, 5) : []);

      // Weekly goals calculation
      if (goals && goals.length > 0) {
        const completedGoals = goals.filter(g => g.status === 'Completed').length;
        setWeeklyProgress({ done: completedGoals, target: goals.length });
      }

      // Sum focus minutes
      if (focus) {
        setFocusMinSum(focus.reduce((acc, curr) => acc + (curr.duration || 0), 0));
      }

      setHabitConsistency(mockDb.getWeeklyConsistencyScore());

      setMomentum(mockDb.getMomentumScore());
    } catch (err) {
      console.error('Error fetching dashboard content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener('motrack_data_changed', loadDashboardData);
    return () => {
      window.removeEventListener('motrack_data_changed', loadDashboardData);
    };
  }, []);

  const handleToggleSubtask = async (id: string) => {
    await mockDb.toggleSubtask(id);
    // Auto reloaded via state listener
  };

  // Adaptive Greet message based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.full_name || 'Mohamed';
    if (hour < 12) return `Good morning, ${name}.`;
    if (hour < 17) return `Good afternoon, ${name}.`;
    return `Good evening, ${name}.`;
  };

  // Automated study tips / recommendation logic based on project states
  const getSmartSuggestion = () => {
    const pendingSubs = subtasks.filter(s => !s.is_completed);
    const activeProj = projects.find(p => p.status === 'In Progress');

    if (pendingSubs.length > 0 && activeProj) {
      return {
        title: `Move ${activeProj.title} forward`,
        text: `Start with "${pendingSubs[0].title}". Small progress still compounds.`,
        actionLabel: 'Start Focus',
        actionPath: '/focus'
      };
    }
    return {
      title: 'Your day has a clear path',
      text: 'Protect one focused session, then review the week with fresh eyes.',
      actionLabel: 'Check Weekly Goals',
      actionPath: '/weekly'
    };
  };

  if (loading) {
    return <LoadingState message="Preparing your dashboard..." />;
  }

  const suggestion = getSmartSuggestion();
  const completedSubtasksCount = subtasks.filter(s => s.is_completed).length;

  return (
    <div className="page-shell">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#090d1b]/75 p-5 shadow-[0_24px_80px_-52px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:p-6 md:p-7">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="page-title text-balance"
          >
            {getGreeting()}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="page-subtitle mt-2"
          >
            A calm space for meaningful progress. Choose one priority, protect focus, and let the day get lighter.
          </motion.p>
        </div>

        <div className="flex gap-2 self-start md:self-center">
          <Link to="/focus" className="shrink-0">
            <GradientButton variant="cyan" className="px-4 py-2 text-sm">
              <Play className="w-3.5 h-3.5" />
              Begin focus
            </GradientButton>
          </Link>
        </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
        <Link to="/projects" className="block hover:scale-[1.01] transition-transform duration-200">
          <StatCard
            title="Tasks Done"
            value={`${completedSubtasksCount} / ${subtasks.length}`}
            subtext="Progress made"
            icon={CheckCircle}
            iconColor="purple"
            trend={{ value: 'Updated live', isPositive: true }}
          />
        </Link>
        <Link to="/focus" className="block hover:scale-[1.01] transition-transform duration-200">
          <StatCard
            title="Focus Time"
            value={`${focusMinSum}m`}
            subtext="Protected minutes"
            icon={Clock}
            iconColor="blue"
            trend={{ value: 'Tracked today', isPositive: true }}
          />
        </Link>
        <Link to="/weekly" className="block hover:scale-[1.01] transition-transform duration-200">
          <StatCard
            title="Week"
            value={`${weeklyProgress.done} / ${weeklyProgress.target}`}
            subtext="Goals completed"
            icon={BookOpen}
            iconColor="cyan"
            trend={{ value: 'This week', isPositive: true }}
          />
        </Link>
        <Link to="/habits" className="block hover:scale-[1.01] transition-transform duration-200">
          <StatCard
            title="Habits"
            value={`${habitConsistency}%`}
            subtext="Weekly rhythm"
            icon={CheckCircle}
            iconColor="green"
            trend={{ value: 'Habit health', isPositive: true }}
          />
        </Link>
        <div className="block hover:scale-[1.01] transition-transform duration-200">
          <StatCard
            title="Streak"
            value={`${momentum.streak} Days`}
            subtext="Showing up"
            icon={Flame}
            iconColor="amber"
            trend={{ value: '+1 today', isPositive: true }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <GlassCard className="flex flex-col items-center justify-center p-5 text-center lg:col-span-4 sm:p-6" glowColor="purple">
          <div className="mb-2">
            <h3 className="font-display text-lg font-semibold tracking-normal text-white">Momentum in progress.</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">Focus, tasks, habits, and daily movement in one signal.</p>
          </div>
          <MomentumOrb score={momentum.score} streak={momentum.streak} />
        </GlassCard>

        <div className="flex flex-col gap-4 lg:col-span-8 lg:gap-6">
          <GlowCard glowColor="purple" className="flex flex-1 flex-col justify-between p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-300/20 bg-purple-500/10 text-purple-200">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-purple-300">Intelligent nudge</span>
                    <h3 className="mt-0.5 font-display text-base font-semibold tracking-normal text-white">{suggestion.title}</h3>
                  </div>
                </div>
                <p className="ml-1 text-sm leading-relaxed text-slate-300">{suggestion.text}</p>
              </div>

              <div className="shrink-0 self-start md:self-center">
                <Link to={suggestion.actionPath}>
                  <button className="touch-target flex cursor-pointer items-center gap-2 rounded-lg border border-purple-300/15 bg-purple-500/10 px-3.5 py-2.5 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/20 hover:text-white">
                    {suggestion.actionLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 space-y-3.5">
              <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wide block">Ask for a study plan</span>
              
              <form onSubmit={handleCallAiSuggest} className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Ask for research schedules, exam plans, or task ideas..."
                  className="min-h-11 flex-grow rounded-lg border border-white/10 bg-neutral-950/60 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-purple-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="touch-target flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isAiLoading ? 'Thinking...' : 'Ask AI'}
                </button>
              </form>

              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-h-[180px] overflow-y-auto whitespace-pre-line rounded-lg border border-white/10 bg-neutral-950 p-4 text-left text-sm leading-relaxed text-neutral-300"
                >
                  {aiResponse}
                </motion.div>
              )}
            </div>
          </GlowCard>

          <GlassCard className="flex-1 p-5 sm:p-6" hoverScale={false}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Active Projects</h3>
              </div>
              <Link to="/projects" className="text-xs text-purple-400 font-semibold hover:underline">
                View projects
              </Link>
            </div>

            {projects.length === 0 ? (
              <EmptyState
                title="No projects yet."
                description="Create one project to give your momentum somewhere to land."
                icon={BookOpen}
              />
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 3).map(p => (
                  <Link to={`/projects/${p.id}`} key={p.id} className="block group">
                    <div className="rounded-lg border border-white/5 bg-neutral-900/40 p-3.5 transition duration-200 hover:bg-neutral-900/80 group-hover:border-purple-500/10">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <span className="text-xs font-semibold text-white group-hover:text-purple-300 transition duration-200">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono">{p.category}</span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                          p.priority === 'High' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/15' :
                          p.priority === 'Medium' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/15' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {p.priority}
                        </span>
                      </div>
                      
                      {/* Fluid progress bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p.progress}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-300 shrink-0">{p.progress}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <GlassCard className="flex flex-col p-5 lg:col-span-7 sm:p-6" hoverScale={false}>
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Today's Tasks</h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {subtasks.filter(s => !s.is_completed).length} Pending
            </span>
          </div>

          {subtasks.length === 0 ? (
            <EmptyState
              title="No tasks yet."
              description="Add a task to a project and your daily checklist will come alive."
              icon={CheckCircle}
            />
          ) : (
            <div className="max-h-[420px] flex-1 space-y-3 overflow-y-auto pr-1">
              {subtasks.map(s => (
                <div
                  key={s.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition duration-200 ${
                    s.is_completed
                      ? 'bg-neutral-900/10 border-white/5 opacity-55'
                      : 'bg-neutral-900/40 hover:bg-neutral-900/70 border-white/10'
                  }`}
                >
                  <button
                    onClick={() => handleToggleSubtask(s.id)}
                    className={`mt-0.5 h-[18px] w-[18px] rounded-md border flex items-center justify-center transition shrink-0 cursor-pointer ${
                      s.is_completed
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'border-white/20 hover:border-purple-400 hover:bg-purple-500/10'
                    }`}
                  >
                    {s.is_completed && <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </button>

                  <div className="min-w-0 flex-1">
                    <span className={`text-[11px] font-medium block leading-snug ${s.is_completed ? 'line-through text-neutral-500' : 'text-white'}`}>
                      {s.title}
                    </span>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">{s.description || 'No description provided.'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] text-purple-400 font-semibold font-mono bg-purple-500/10 px-1.5 py-0.5 rounded-md">
                        {projects.find(p => p.id === s.project_id)?.title || 'Task'}
                      </span>
                      {s.due_date && (
                        <span className="text-[9px] font-mono text-neutral-400 flex items-center gap-1">
                          Due: {s.due_date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-5 sm:p-6" hoverScale={false}>
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Zap className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Recent Activity</h3>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {recentLogs.length === 0 ? (
              <p className="text-center text-xs text-neutral-400 py-12">No recent activity yet.</p>
            ) : (
              recentLogs.map((log, index) => (
                <div key={log.id} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    {index < recentLogs.length - 1 && (
                      <div className="w-px h-12 bg-neutral-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-white leading-normal">{log.description}</p>
                    <span className="text-[9px] font-mono text-neutral-400 block mt-1">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
