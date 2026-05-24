import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Plus,
  Flame,
  Trash2,
  Check,
  Target,
  Award,
  X,
  Droplet,
  Compass,
  Smile,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { mockDb } from '../lib/supabase';
import { GlassCard, GlowCard, EmptyState, LoadingState, StatusBadge, PageHeader } from '../components/Reusable';

// Helper to determine icon based on category
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'hydration':
    case 'health':
      return Droplet;
    case 'meditation':
    case 'mindset':
      return Compass;
    case 'academics':
    case 'study':
      return BookOpen;
    case 'fitness':
    case 'exercise':
      return Target;
    default:
      return Smile;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'hydration':
    case 'health':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'meditation':
    case 'mindset':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    case 'academics':
    case 'study':
      return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    case 'fitness':
    case 'exercise':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    default:
      return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
  }
};

export const Habits: React.FC = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [consistency, setConsistency] = useState(100);
  
  // Create Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mindset');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly'>('Daily');

  // Load baseline habits configuration
  const loadHabits = async () => {
    try {
      setLoading(true);
      const { data } = await mockDb.getHabits();
      setHabits(data || []);
      setConsistency(mockDb.getWeeklyConsistencyScore());
    } catch (err) {
      console.error('Failed to parse habits ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
    // Live update when changes occur elsewhere
    window.addEventListener('motrack_data_changed', loadHabits);
    return () => {
      window.removeEventListener('motrack_data_changed', loadHabits);
    };
  }, []);

  // Compute last 7 days (today is index 0 or reversed)
  const getLast7Days = () => {
    const arr = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = weekdays[d.getDay()];
      const dayNum = d.getDate();
      arr.push({ dateStr, label, dayNum, isToday: i === 0 });
    }
    return arr;
  };

  const daysList = getLast7Days();

  // Streak algorithm mapping
  const calculateStreak = (completedDates: string[]): number => {
    if (!completedDates || completedDates.length === 0) return 0;
    
    const uniqueDates = Array.from(new Set(completedDates)).sort().reverse();
    const todayStr = new Date().toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let streakCount = 0;
    let checkDate = new Date();
    
    const hasToday = uniqueDates.includes(todayStr);
    const hasYesterday = uniqueDates.includes(yesterdayStr);
    
    if (hasToday) {
      checkDate = new Date();
    } else if (hasYesterday) {
      checkDate = yesterday;
    } else {
      return 0;
    }
    
    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates.includes(checkStr)) {
        streakCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streakCount;
  };

  const handleToggleDate = async (habitId: string, dateStr: string) => {
    try {
      await mockDb.toggleHabit(habitId, dateStr);
      // local event emission triggers reload immediately
    } catch (err) {
      console.error('Failed to log habit status mutation:', err);
    }
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await mockDb.upsertHabit({
        title,
        category,
        frequency,
        completed_dates: []
      });
      setTitle('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to create habit:', err);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (!window.confirm('Are you sure you want to retire this habit from tracking?')) return;
    try {
      await mockDb.deleteHabit(id);
    } catch (err) {
      console.error('Failed to delete habit:', err);
    }
  };

  const longestStreakProduct = habits.reduce((max, h) => {
    const currentStr = calculateStreak(h.completed_dates || []);
    return currentStr > max.streak ? { title: h.title, streak: currentStr } : max;
  }, { title: 'None yet', streak: 0 });

  return (
    <div className="page-shell">
      
      <PageHeader
        icon={CheckCircle2}
        title="Habit Tracker"
        description="Build small routines that compound into a stronger week."
        className="border-b border-white/5 pb-5"
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="touch-target flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:from-purple-500 hover:to-indigo-500 sm:w-auto"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddForm ? 'Cancel' : 'New Habit'}
          </button>
        }
      />

      {/* FORM EXPANDER */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="max-w-xl border-purple-500/20 bg-neutral-900/60 p-6">
              <span className="section-kicker mb-2 block text-purple-400">Create habit</span>
              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="form-label">Habit</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Read 10 minutes or review one concept"
                    className="field-control bg-neutral-950/60"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="field-control cursor-pointer bg-neutral-950/60"
                    >
                      <option value="Mindset">Mindset / Meditation</option>
                      <option value="Health">Health / Hydration</option>
                      <option value="Academics">Academics / Studies</option>
                      <option value="Exercise">Fitness / Gym</option>
                      <option value="Personal">Personal Routine</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                      className="field-control cursor-pointer bg-neutral-950/60"
                    >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    className="touch-target flex-grow rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-purple-500 hover:to-indigo-500 cursor-pointer"
                  >
                    Create Habit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="touch-target rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-300 transition hover:bg-neutral-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEAD ANALYTICS ROW */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        
        {/* Weekly Consistency Ring Card */}
        <GlowCard glowColor="purple" className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">Weekly Performance</span>
            <h3 className="text-md font-bold text-white">Consistency Ratio</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your average completion rate across active habits in the past 7 days.
            </p>
          </div>
          
          <div className="relative w-24 h-24 flex items-center justify-center border border-white/5 rounded-full shrink-0 mx-auto md:mx-0">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" className="stroke-neutral-800" strokeWidth="4" fill="transparent" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-purple-500"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray="264"
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * consistency) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-xl font-mono font-bold text-white">{consistency}%</span>
              <span className="text-[7px] uppercase block tracking-widest text-neutral-400 font-bold mt-0.5">SCORE</span>
            </div>
          </div>
        </GlowCard>

        {/* Global telemetry widget 2: Longest Active Streak */}
        <GlassCard className="flex flex-col justify-between" glowColor="blue">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">Streak Leaderboard</span>
              <h3 className="text-md font-bold text-white">Top Active Streak</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                Currently holding the highest consecutive-day count:
              </p>
              <div className="mt-2 text-sm font-semibold text-neutral-200 block truncate max-w-[200px]">
                {longestStreakProduct.title}
              </div>
            </div>
            
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/25 shrink-0 shadow-inner">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono font-bold text-blue-300">
            <span>STREAK MAGNITUDE:</span>
            <span>{longestStreakProduct.streak} Days</span>
          </div>
        </GlassCard>

        {/* Habit count widget */}
        <GlassCard className="flex flex-col justify-between" glowColor="green">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Tracking</span>
              <h3 className="text-md font-bold text-white">Active Habits</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                The total number of recurring routines currently tracked.
              </p>
            </div>
            
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>TRACKED HABITS:</span>
            <span className="font-bold text-emerald-400">{habits.length}</span>
          </div>
        </GlassCard>
      </div>

      {loading ? (
        <LoadingState message="Preparing your routines..." />
      ) : habits.length === 0 ? (
        <EmptyState
          title="No habits yet."
          description="Start with one small routine you can repeat without friction."
          icon={Target}
          actionLabel="Create Habit"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        /* MAIN MATRIX TABLE */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="grid gap-3 md:hidden">
            {habits.map((habit) => {
              const CategoryIcon = getCategoryIcon(habit.category);
              const styleTuple = getCategoryColor(habit.category);
              const curStreak = calculateStreak(habit.completed_dates || []);

              return (
                <GlassCard key={habit.id} className="p-4" hoverScale={false}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className={`rounded-lg border p-2 ${styleTuple} shrink-0`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold leading-snug text-white">{habit.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <StatusBadge tone="purple">{habit.category}</StatusBadge>
                          <StatusBadge tone="neutral">{habit.frequency}</StatusBadge>
                          <StatusBadge tone="amber">
                            <Flame className="mr-1 h-3 w-3" />
                            {curStreak}d
                          </StatusBadge>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="touch-target shrink-0 rounded-lg border border-white/10 bg-white/[0.035] p-2 text-neutral-500 transition hover:border-rose-400/20 hover:text-rose-300"
                      title="Retire routine"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-7 gap-1.5">
                    {daysList.map((day) => {
                      const isDone = habit.completed_dates && habit.completed_dates.includes(day.dateStr);
                      return (
                        <button
                          key={day.dateStr}
                          onClick={() => handleToggleDate(habit.id, day.dateStr)}
                          className={`flex min-h-[56px] flex-col items-center justify-center rounded-lg border text-center transition active:scale-95 ${
                            isDone
                              ? 'border-purple-400/40 bg-purple-600 text-white shadow-[0_10px_24px_-18px_rgba(168,85,247,0.9)]'
                              : day.isToday
                                ? 'border-purple-400/25 bg-purple-500/10 text-purple-100'
                                : 'border-white/10 bg-slate-950/45 text-slate-500'
                          }`}
                          aria-label={`${isDone ? 'Uncheck' : 'Check'} ${habit.title} for ${day.label} ${day.dayNum}`}
                        >
                          <span className="text-[9px] font-semibold">{day.label}</span>
                          <span className="metric-number mt-0.5 text-xs font-bold">{day.dayNum}</span>
                          <Check className={`mt-0.5 h-3.5 w-3.5 transition ${isDone ? 'scale-100' : 'scale-0'}`} />
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto rounded-lg border border-white/10 bg-neutral-950/30 backdrop-blur-md md:block">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5 bg-neutral-900/40 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  <th className="py-4 px-6 font-medium">Habit Details</th>
                  <th className="py-4 px-4 font-medium text-center">Current Streak</th>
                  
                  {/* Last 7 rolling dates */}
                  {daysList.map((day) => (
                    <th key={day.dateStr} className={`py-4 px-3 text-center font-medium ${day.isToday ? 'text-purple-400' : ''}`}>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[9px] leading-tight text-neutral-500 font-semibold">{day.label}</span>
                        <span className={`text-[12px] font-mono leading-tight mt-0.5 ${day.isToday ? 'text-purple-300 font-bold' : 'text-neutral-300'}`}>
                          {day.dayNum}
                        </span>
                      </div>
                    </th>
                  ))}
                  
                  <th className="py-4 px-5 text-center font-medium w-16">Retire</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-white/5 text-[12px]">
                {habits.map((habit) => {
                  const CategoryIcon = getCategoryIcon(habit.category);
                  const styleTuple = getCategoryColor(habit.category);
                  const curStreak = calculateStreak(habit.completed_dates || []);

                  return (
                    <tr key={habit.id} className="transition hover:bg-white/[0.02] group">
                      {/* Title & Metadata */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${styleTuple} shrink-0`}>
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white block leading-tight">{habit.title}</span>
                            <span className="text-[10px] font-mono text-neutral-500 block mt-1">
                              {habit.category} / {habit.frequency}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Current Streak value */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/15 text-orange-400 text-[11px] font-mono font-bold shadow-sm">
                          <Flame className="w-3.5 h-3.5" />
                          {curStreak} Days
                        </div>
                      </td>

                      {/* Rolling 7 Day Checkbox grid */}
                      {daysList.map((day) => {
                        const isDone = habit.completed_dates && habit.completed_dates.includes(day.dateStr);
                        return (
                          <td key={day.dateStr} className="py-4 px-3 text-center">
                            <button
                              onClick={() => handleToggleDate(habit.id, day.dateStr)}
                              className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition border cursor-pointer ${
                                isDone
                                  ? 'bg-purple-600 border-purple-500 text-white shadow-sm shadow-purple-500/15'
                                  : 'bg-neutral-900/60 border-white/10 hover:border-purple-500/40 text-transparent hover:text-neutral-500 hover:bg-neutral-800/40'
                              }`}
                            >
                              <Check className="w-4 h-4 shrink-0 transition stroke-[3px]" />
                            </button>
                          </td>
                        );
                      })}

                      {/* Delete option */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="opacity-20 group-hover:opacity-100 p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                          title="Retire routine"
                        >
                          <Trash2 className="w-4 h-4 shrink-0" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 px-2 mt-2">
            <AlertCircle className="w-3.5 h-3.5 text-purple-400/80" />
            <span>Habit streaks update automatically and feed into the Momentum score.</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
