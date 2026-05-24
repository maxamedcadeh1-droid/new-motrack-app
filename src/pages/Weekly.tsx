import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CalendarRange,
  CheckCircle2,
  Award,
  Trash2,
  Zap
} from 'lucide-react';
import { mockDb } from '../lib/supabase';
import { GlassCard, GlowCard, EmptyState, LoadingState, GradientButton, PageHeader } from '../components/Reusable';

export const Weekly: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(3);

  const loadData = async () => {
    try {
      const { data } = await mockDb.getWeeklyGoals();
      setGoals(data || []);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('motrack_data_changed', loadData);
    return () => {
      window.removeEventListener('motrack_data_changed', loadData);
    };
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await mockDb.upsertWeeklyGoal({
      title,
      target: Number(target),
      progress: 0,
      status: 'In Progress'
    });

    setTitle('');
    setTarget(3);
    setIsAdding(false);
  };

  const handleIncrement = async (id: string) => {
    await mockDb.incrementWeeklyGoal(id, 1);
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Delete this weekly goal?')) {
      await mockDb.deleteWeeklyGoal(id);
    }
  };

  if (loading) {
    return <LoadingState message="Preparing your weekly rhythm..." />;
  }

  const completedCount = goals.filter(g => g.status === 'Completed').length;
  const progressRatio = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="page-shell-narrow">
      <PageHeader
        icon={CalendarRange}
        title="Weekly Planner"
        description="Set a clear weekly intention, then make progress visible one small win at a time."
        action={
          <GradientButton
            onClick={() => setIsAdding(!isAdding)}
            variant={isAdding ? 'ghost' : 'purple'}
            className="w-full px-4 py-2 text-sm sm:w-auto"
          >
            {isAdding ? 'Close' : 'New Goal'}
          </GradientButton>
        }
      />

      {/* Grid Dashboard recap metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <GlassCard className="flex flex-col justify-between p-6" hoverScale={false}>
          <div>
            <span className="text-[10px] text-neutral-400 font-sans uppercase">Completion Rate</span>
            <span className="text-3xl font-mono tracking-tight font-extrabold text-white mt-1.5 block">{progressRatio}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden mt-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressRatio}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            />
          </div>
        </GlassCard>

        <GlowCard glowColor="purple" className="p-6 flex flex-col justify-between" hoverScale={false}>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-sans uppercase block mb-0.5">Completed Goals</span>
              <span className="text-2xl font-mono font-bold text-white leading-none">{completedCount} of {goals.length} Targets</span>
            </div>
          </div>
          <span className="text-[10px] text-neutral-500 font-sans mt-3">Keep going to build a stronger weekly rhythm.</span>
        </GlowCard>

        <GlassCard className="p-6 flex flex-col justify-between" hoverScale={false}>
          <div>
            <span className="text-[10px] text-neutral-400 font-sans uppercase">Week Window</span>
            <span className="text-md font-sans text-white font-semibold mt-2 block">This week</span>
            <span className="text-[10px] text-neutral-500 font-mono mt-1.5 block">
              {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - Next Sunday
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Goal deployment box */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <GlassCard className="p-6 border-purple-500/10" hoverScale={false}>
            <div className="mb-4">
              <h3 className="text-md font-semibold text-white">Create a weekly goal</h3>
              <p className="text-[11px] text-neutral-400">Choose one outcome you can return to all week.</p>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 font-sans text-xs">
              <div>
                <label className="form-label">Goal *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Review three chapters or finish six focused sprints"
                  className="field-control"
                />
              </div>

              <div>
                <label className="form-label">Target count *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={500}
                  value={target}
                  onChange={e => setTarget(Number(e.target.value))}
                  className="field-control"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="touch-target rounded-lg px-4 py-2 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
                >
                  Discard
                </button>
                <GradientButton type="submit">Create Goal</GradientButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {/* Goals Display List */}
      <div className="space-y-4">
        <h2 className="section-kicker px-1">Weekly Goals</h2>

        {goals.length === 0 ? (
          <EmptyState
            title="Your week is open."
            description="Create a goal that gives the next seven days a clear direction."
            icon={CalendarRange}
            actionLabel="Create Goal"
            onAction={() => setIsAdding(true)}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {goals.map(g => {
              const capProgress = Math.min(g.target, g.progress);
              const percent = Math.round((capProgress / g.target) * 100);
              const isDone = g.status === 'Completed';

              return (
                <GlassCard key={g.id} className="p-5 flex flex-col justify-between" glowColor={isDone ? 'blue' : 'purple'}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className={`mt-0.5 p-1 rounded-md shrink-0 ${isDone ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Zap className="w-4 h-4 animate-pulse" />}
                        </div>
                        <h3 className={`text-[12px] font-semibold leading-snug ${isDone ? 'line-through text-neutral-500' : 'text-white'}`}>
                          {g.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleDeleteGoal(g.id)}
                        className="p-1 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Progress details */}
                    <div className="pt-4 space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                      <span>Momentum</span>
                        <span className="text-white font-bold">{g.progress} / {g.target} ({percent}%)</span>
                      </div>

                      <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full bg-gradient-to-r ${isDone ? 'from-emerald-400 to-teal-500' : 'from-purple-500 to-cyan-400'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => handleIncrement(g.id)}
                      disabled={isDone}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold transition flex items-center gap-1 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500/10 text-emerald-400 cursor-default'
                          : 'bg-neutral-900 border border-white/5 hover:border-purple-400 text-purple-300 hover:text-white'
                      }`}
                    >
                      {isDone ? 'Completed' : '+1 Progress'}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
