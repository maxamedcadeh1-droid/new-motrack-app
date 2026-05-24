import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckSquare,
  Sparkles,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { mockDb } from '../lib/supabase';
import { GlassCard, GlowCard, LoadingState, PageHeader } from '../components/Reusable';

export const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [momentum, setMomentum] = useState({ score: 75, streak: 5 });
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [focusSessions, setFocusSessions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const { data: subs } = await mockDb.getSubtasks();
      const { data: focus } = await mockDb.getFocusSessions();
      const { data: acts } = await mockDb.getDailyActivities();

      setSubtasks(subs || []);
      setFocusSessions(focus || []);
      setActivities(acts || []);

      setMomentum(mockDb.getMomentumScore());
    } catch (err) {
      console.error(err);
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

  if (loading) {
    return <LoadingState message="Preparing your insights..." />;
  }

  // Pre-formatted high-fidelity chart datasets
  // 1. Weekly timeline stats (Focus minutes per day)
  const focusDailyData = [
    { name: 'Mon', minutes: 50 },
    { name: 'Tue', minutes: 75 },
    { name: 'Wed', minutes: 45 },
    { name: 'Thu', minutes: 90 },
    { name: 'Fri', minutes: focusSessions.reduce((acc, curr) => acc + (curr.duration || 0), 0) || 50 },
    { name: 'Sat', minutes: 60 },
    { name: 'Sun', minutes: 0 },
  ];

  // 2. Activity category distribution count
  const studyCount = activities.filter(a => a.type === 'Study').length || 4;
  const projectCount = activities.filter(a => a.type === 'Project').length || 3;
  const exerciseCount = activities.filter(a => a.type === 'Exercise').length || 2;
  const readingCount = activities.filter(a => a.type === 'Reading').length || 1;

  const activityDistribution = [
    { category: 'Study', count: studyCount },
    { category: 'Projects', count: projectCount },
    { category: 'Exercise', count: exerciseCount },
    { category: 'Reading', count: readingCount },
  ];

  const totalFocusMin = focusSessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalCompletedSubs = subtasks.filter(s => s.is_completed).length;

  return (
    <div className="page-shell font-sans text-xs">
      <PageHeader
        icon={BarChart3}
        title="Analytics"
        description="See the signals behind your focus, routines, and project momentum."
      />

      {/* Bento Stats row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <GlassCard className="p-5 flex items-center gap-4" hoverScale={false}>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-medium">Momentum</span>
            <span className="text-2xl font-mono font-bold text-white block mt-1">{momentum.score}%</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4" hoverScale={false}>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-medium">Focus</span>
            <span className="text-2xl font-mono font-bold text-white block mt-1">{totalFocusMin} Min</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4" hoverScale={false}>
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-medium">Tasks done</span>
            <span className="text-2xl font-mono font-bold text-white block mt-1">{totalCompletedSubs} units</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4" hoverScale={false}>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-medium">Streak</span>
            <span className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 block mt-1">
              {momentum.streak} Days
            </span>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Area Chart: Focus Minutes tracked over current weekdays */}
        <GlassCard className="flex h-[300px] flex-col p-4 sm:h-[350px] sm:p-6 lg:col-span-8" hoverScale={false}>
          <div className="mb-4">
            <h3 className="section-kicker">Focus by day</h3>
          </div>
          
          <div className="flex-grow w-full h-full min-h-0 text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#ffffff1a',
                    borderRadius: '12px',
                    color: '#f4f4f5'
                  }}
                />
                <Area type="monotone" dataKey="minutes" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorMinutes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Bar Chart: Daily Routine categorization types */}
        <GlassCard className="flex h-[300px] flex-col p-4 sm:h-[350px] sm:p-6 lg:col-span-4" hoverScale={false}>
          <div className="mb-4">
            <h3 className="section-kicker">Activity mix</h3>
          </div>

          <div className="flex-grow w-full h-full min-h-0 text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                <XAxis dataKey="category" stroke="#888888" fontSize={9} />
                <YAxis stroke="#888888" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#ffffff1a',
                    borderRadius: '12px',
                    color: '#f4f4f5'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Smart Analysis glowing banner card */}
      <GlowCard glowColor="purple" className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/15 rounded-xl text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left font-sans text-xs">
            <span className="text-[9px] uppercase tracking-widest font-mono text-purple-400 block mb-1">Insight</span>
            <h3 className="text-sm font-bold text-white">Your strongest signal is consistency.</h3>
            <p className="text-neutral-300 mt-2 leading-relaxed">
              Based on your {momentum.streak}-day streak and logged focus minutes, schedule your hardest academic work during your most reliable morning block.
            </p>
          </div>
        </div>
      </GlowCard>
    </div>
  );
};
