import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  BookOpen,
  Activity,
  Award,
  Trash2,
  Dumbbell
} from 'lucide-react';
import { mockDb } from '../lib/supabase';
import { GlassCard, EmptyState, LoadingState, GradientButton } from '../components/Reusable';

export const Daily: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab ] = useState<string>('All');

  // Input States
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Study' | 'Project' | 'Exercise' | 'Reading' | 'Personal' | 'Other'>('Study');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    try {
      const { data } = await mockDb.getDailyActivities();
      // Sort activities: completed today first or descending chronological
      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
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

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await mockDb.upsertDailyActivity({
      title,
      type,
      date,
      duration: Number(duration),
      notes,
      status: 'Completed'
    });

    setTitle('');
    setNotes('');
    setIsAdding(false);
  };

  const handleDeleteActivity = async (id: string) => {
    if (confirm('Delete this timeline activity entry?')) {
      await mockDb.deleteDailyActivity(id);
    }
  };

  if (loading) {
    return <LoadingState message="Preparing today's timeline..." />;
  }

  const filteredActivities = activeTab === 'All'
    ? activities
    : activities.filter(a => a.type === activeTab);

  const typeConfig: Record<string, { bg: string; text: string; border: string; icon: any }> = {
    Study: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: BookOpen },
    Project: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: Activity },
    Exercise: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: Dumbbell },
    Reading: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', icon: Award },
    Personal: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: Clock },
    Other: { bg: 'bg-neutral-800', text: 'text-neutral-300', border: 'border-white/5', icon: Clock },
  };

  // Summary Metrics
  const totalDuration = activities.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const studyHours = Math.round((activities.filter(a => a.type === 'Study' || a.type === 'Project').reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60) * 10) / 10;

  return (
    <div className="page-shell-narrow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-400" />
            Daily Activities
          </h1>
          <p className="page-subtitle mt-2">
            Capture the shape of your day across study, movement, reading, and recovery.
          </p>
        </div>

        <GradientButton
          onClick={() => setIsAdding(!isAdding)}
          variant={isAdding ? 'ghost' : 'purple'}
          className="w-full px-4 py-2 text-sm sm:w-auto"
        >
          {isAdding ? 'Close' : 'Log Activity'}
        </GradientButton>
      </div>

      {/* Top micro summary banner */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <GlassCard className="p-4" hoverScale={false}>
            <span className="text-[10px] text-neutral-400 block font-sans uppercase">Time logged</span>
          <span className="text-2xl font-mono font-bold text-white mt-1 block">{totalDuration} min</span>
        </GlassCard>
        <GlassCard className="p-4" hoverScale={false}>
            <span className="text-[10px] text-neutral-400 block font-sans uppercase">Deep work</span>
          <span className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mt-1 block">{studyHours} Hrs</span>
        </GlassCard>
        <GlassCard className="p-4" hoverScale={false}>
            <span className="text-[10px] text-neutral-400 block font-sans uppercase">Moments</span>
          <span className="text-2xl font-mono font-bold text-white mt-1 block">{activities.length} slots</span>
        </GlassCard>
        <GlassCard className="p-4" hoverScale={false}>
            <span className="text-[10px] text-neutral-400 block font-sans uppercase">Daily signal</span>
          <span className="text-2xl font-mono font-bold text-emerald-400 mt-1 block">Optimal</span>
        </GlassCard>
      </div>

      {/* Adding Box Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <GlassCard className="p-6 border-purple-500/10" hoverScale={false}>
            <div className="mb-4">
              <h3 className="text-md font-semibold text-white">Log an activity</h3>
              <p className="text-[11px] text-neutral-400">Record completed work while the context is still fresh.</p>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="form-label">Activity *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="EECS lecture review"
                    className="field-control"
                  />
                </div>
                <div>
                  <label className="form-label">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="field-control cursor-pointer"
                  >
                    <option value="Study">Study</option>
                    <option value="Project">Project</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Reading">Reading</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="field-control block"
                  />
                </div>
                <div>
                  <label className="form-label">Duration (minutes) *</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={480}
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="field-control"
                  />
                </div>
              </div>

              <div>
                  <label className="form-label">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                    placeholder="Reviewed formulas and finished the draft."
                  className="field-control"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="touch-target rounded-lg px-4 py-2 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <GradientButton type="submit">Log Activity</GradientButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {/* FILTER BUTTONS ROW */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1 font-sans text-xs">
        {['All', 'Study', 'Project', 'Exercise', 'Reading', 'Personal'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`touch-target shrink-0 cursor-pointer rounded-lg px-4 py-2 transition ${
              activeTab === cat
                ? 'bg-purple-600 font-bold text-white shadow-md shadow-purple-600/25'
                : 'text-neutral-400 bg-neutral-900 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* THE GEOMETRICAL TIMELINE TREE */}
      <div className="relative pl-6 md:pl-8 border-l border-white/10 space-y-6 pt-2">
        {filteredActivities.length === 0 ? (
          <div className="pl-2">
            <EmptyState
              title="No activity yet."
            description="No logs match this filter. Record one meaningful moment to begin the timeline."
              icon={Activity}
            />
          </div>
        ) : (
          filteredActivities.map((act, index) => {
            const cfg = typeConfig[act.type] || typeConfig.Other;
            const ActIcon = cfg.icon;

            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group font-sans text-xs"
              >
                {/* Timeline Node Point indicator */}
                <div className={`absolute -left-[31px] md:-left-[39px] mt-1 p-1.5 rounded-full border bg-[#030307] transition duration-300 z-10 ${cfg.text} ${cfg.border} group-hover:bg-neutral-950 group-hover:scale-110 shadow-[0_0_10px_rgba(3,3,7,0.8)]`}>
                  <ActIcon className="w-4 h-4" />
                </div>

                {/* Main Activity Content bubble */}
                <GlassCard className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4" hoverScale={true}>
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
                        {act.type}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 font-medium">{act.date}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-purple-300 transition duration-300">
                      {act.title}
                    </h3>

                    {act.notes && (
                      <p className="text-[11px] text-neutral-400 leading-normal max-w-2xl">{act.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <span className="text-md font-mono font-bold text-white block">
                        {act.duration} Min
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase font-sans tracking-wide mt-0.5 block">Logged</span>
                    </div>

                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      className="p-2 bg-neutral-900/40 border border-white/5 hover:border-rose-500/10 rounded-xl hover:text-rose-400 text-neutral-500 transition cursor-pointer"
                      title="Delete activity record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
