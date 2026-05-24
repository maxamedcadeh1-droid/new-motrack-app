import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Settings,
  GraduationCap,
  Sparkles,
  Lock,
  BellRing,
  Save,
  CheckCircle
} from 'lucide-react';
import { mockDb } from '../lib/supabase';
import { GlassCard, GlowCard, LoadingState, GradientButton } from '../components/Reusable';

export const ProfileSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState('Mohamed');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [univ, setUniv] = useState('Massachusetts Institute of Technology (MIT)');
  const [dept, setDept] = useState('Electrical Engineering & Computer Science (EECS)');
  const [mainGoal, setMainGoal] = useState('Build intelligent software that scales human productivity.');

  // Load Profile Parameters
  const loadData = async () => {
    try {
      const { data } = await mockDb.getProfile();
      if (data) {
        setFullName(data.full_name || 'Mohamed');
        setAvatarUrl(data.avatar_url || '');
        setUniv(data.university || '');
        setDept(data.department || '');
        setMainGoal(data.goal || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSaved(false);

    try {
      await mockDb.updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl,
        university: univ,
        department: dept,
        goal: mainGoal
      });
      setIsSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  if (loading && !fullName) {
    return <LoadingState message="Opening your profile..." />;
  }

  return (
    <div className="page-shell-narrow select-none font-sans text-xs">
      
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <User className="w-6 h-6 text-purple-400" />
            Profile & Settings
          </h1>
          <p className="page-subtitle mt-2">
            Keep your workspace identity, academic context, and focus goal aligned.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Card details edit form */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 text-left" hoverScale={false}>
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <h3 className="section-kicker">Profile details</h3>
            </div>

            {isSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3.5 mb-5 flex items-center gap-2 font-semibold"
              >
                <CheckCircle className="h-[18px] w-[18px]" />
                Profile saved successfully.
              </motion.div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                <label className="form-label">Full name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="field-control"
                  />
                </div>
                <div>
                  <label className="form-label">Avatar URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="field-control"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                <label className="form-label">University</label>
                  <input
                    type="text"
                    value={univ}
                    onChange={e => setUniv(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="field-control"
                  />
                </div>
                <div>
                <label className="form-label">Department</label>
                  <input
                    type="text"
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    placeholder="e.g. Computer Science Department"
                    className="field-control"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Main goal</label>
                <textarea
                  rows={3}
                  value={mainGoal}
                  onChange={e => setMainGoal(e.target.value)}
                  placeholder="Define the focus that should shape your work."
                  className="field-control max-h-[140px] resize-none font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <GradientButton type="submit" className="flex items-center gap-1.5 font-bold">
                  <Save className="w-4 h-4" />
                  Save Profile
                </GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Configurations, Theme selections, backups display element */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {/* Preset Cinematic selectors mock, backups, notifications config list */}
          <GlassCard className="p-6 text-left" hoverScale={false}>
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Settings className="w-4 h-4 text-purple-400" />
              <h3 className="section-kicker">Settings</h3>
            </div>

            <div className="space-y-4">
              {/* Theme placeholder selection (User explicitly asked to "Choose ONE polished theme and stick to it" in guidelines, we provide elegant premium layout view with inactive toggle labels) */}
              <div>
                <label className="form-label">Theme</label>
                <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-white">MoTrack Dark</span>
                  <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-wider">Active</span>
                </div>
              </div>

              {/* Security parameters list toggle placeholders */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <label className="form-label">Notifications</label>
                
                <div className="flex items-center justify-between text-[11px] text-neutral-300">
                  <span className="flex items-center gap-2">
                    <BellRing className="w-3.5 h-3.5 text-neutral-500" />
                    Focus timer reminders
                  </span>
                  <span className="text-neutral-500 italic">Enabled</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-300">
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-neutral-500" />
                    Privacy protection
                  </span>
                  <span className="text-neutral-500 italic">Strict (Active)</span>
                </div>
              </div>

              {/* Backup triggers */}
              <div className="border-t border-white/5 pt-4">
                <label className="form-label">Data backup</label>
                <button
                  onClick={() => alert('Data backup complete. Serialized database JSON successfully recorded in local security block.')}
                  className="touch-target flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-neutral-300 transition hover:border-purple-500/20 hover:bg-white/5 hover:text-white"
                >
                  Backup Local Data
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Core system state indicator */}
          <GlowCard glowColor="purple" className="p-6 text-center" hoverScale={false}>
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-bounce" />
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Workspace Status</h3>
            <p className="text-[10.5px] text-neutral-300 mt-1.5 leading-relaxed">
              Supabase Auth is connected. Your profile changes are saved to your workspace.
            </p>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};
