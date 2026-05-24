import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  FolderKanban,
  Clock,
  CalendarRange,
  StickyNote,
  Brain,
  BarChart3,
  User,
  LogOut,
  Plus,
  Search,
  CheckCircle,
  Smartphone,
  Bell,
  Sparkles
} from 'lucide-react';
import { mockDb, supabase } from '../lib/supabase';
import { QuickAddModal } from './QuickAddModal';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [momentum, setMomentum] = useState({ score: 75, streak: 5 });

  const loadData = async () => {
    const { data } = await supabase.auth.getSession();
    const nextSession = data.session;

    if (!nextSession) {
      setSession(null);
      navigate('/login');
      return;
    }

    setSession(nextSession);
    mockDb.getProfile().then(({ data }) => setProfile(data));
    setMomentum(mockDb.getMomentumScore());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('motrack_data_changed', loadData);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) {
        setSession(null);
        navigate('/login');
        return;
      }

      setSession(nextSession);
      loadData();
    });

    return () => {
      window.removeEventListener('motrack_data_changed', loadData);
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', desktopLabel: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', desktopLabel: 'Projects & Tasks', path: '/projects', icon: FolderKanban },
    { label: 'Today', desktopLabel: 'Daily Activities', path: '/daily', icon: Clock },
    { label: 'Habits', desktopLabel: 'Habit Tracker', path: '/habits', icon: CheckCircle },
    { label: 'Week', desktopLabel: 'Weekly Planner', path: '/weekly', icon: CalendarRange },
    { label: 'Notes', desktopLabel: 'Notes & Goals', path: '/notes', icon: StickyNote },
    { label: 'Focus', desktopLabel: 'Focus Timer', path: '/focus', icon: Brain },
    { label: 'Insights', desktopLabel: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Profile', desktopLabel: 'Profile', path: '/profile', icon: User },
    { label: 'Preview', desktopLabel: 'Mobile Preview', path: '/mockup', icon: Smartphone },
  ];

  const mobileNavItems = [navItems[0], navItems[1], navItems[2], navItems[6], navItems[8]];
  const mobileRailItems = [navItems[3], navItems[4], navItems[5], navItems[7]];

  const isNavActive = (path: string) => {
    if (path === '/profile' && location.pathname.startsWith('/settings')) return true;
    return location.pathname.startsWith(path);
  };

  if (!session) return null;

  return (
    <div className="app-background relative min-h-[100dvh] overflow-x-hidden bg-[#030611] text-slate-100 antialiased selection:bg-purple-500/30 selection:text-purple-100">
      <div className="flex min-h-[100dvh] flex-col md:flex-row">
        <aside className="hidden h-[100dvh] w-72 shrink-0 border-r border-white/10 bg-[#050915]/86 p-5 backdrop-blur-xl md:sticky md:top-0 md:flex md:flex-col">
          <Link to="/dashboard" className="mb-6 flex items-center gap-3 px-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-purple-300/20 bg-gradient-to-br from-purple-600/30 to-blue-500/20 shadow-[0_18px_45px_-24px_rgba(139,92,246,0.95)]">
              <span className="bg-gradient-to-br from-purple-200 to-blue-200 bg-clip-text font-display text-2xl font-bold text-transparent">M</span>
            </div>
            <div>
              <span className="block font-display text-2xl font-bold leading-none tracking-normal text-white">MoTrack</span>
              <span className="mt-1 block text-xs font-medium text-purple-200">Move with intention.</span>
            </div>
          </Link>

          <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-purple-200" />
              Your focus system
            </div>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="touch-target flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_32px_-22px_rgba(139,92,246,0.95)] transition hover:from-purple-500 hover:to-blue-500"
            >
              <Plus className="h-4 w-4" />
              Create
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {navItems.map(item => {
              const isActive = isNavActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex min-h-11 items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:bg-white/[0.045] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 -z-10 rounded-lg border border-purple-300/30 bg-gradient-to-r from-purple-600/30 to-blue-600/10"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon className={`h-4 w-4 shrink-0 transition ${isActive ? 'text-purple-100' : 'text-slate-500 group-hover:text-purple-200'}`} />
                  <span className="truncate">{item.desktopLabel}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 border-t border-white/10 pt-4">
            {profile && (
              <Link to="/profile" className="mb-3 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-2.5 transition hover:bg-white/[0.065]">
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={profile.full_name}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 shrink-0 rounded-lg border border-white/15 bg-slate-900 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold leading-none text-white">{profile.full_name}</span>
                  <span className="mt-1 block truncate text-[11px] font-medium text-slate-400">Momentum {momentum.score}%</span>
                </div>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="touch-target flex w-full cursor-pointer items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#040817]/84 px-4 shadow-[0_18px_42px_-36px_rgba(0,0,0,0.95)] backdrop-blur-xl md:px-6" style={{ paddingTop: 'max(0.75rem, var(--safe-top))' }}>
            <div className="flex min-h-14 items-center justify-between gap-3 pb-3 md:pb-4">
              <Link to="/dashboard" className="flex min-w-0 items-center gap-3 md:hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-300/20 bg-gradient-to-br from-purple-600/30 to-blue-500/20">
                  <span className="font-display text-lg font-bold text-purple-100">M</span>
                </div>
                <div className="min-w-0">
                  <span className="block truncate font-display text-lg font-bold tracking-normal text-white">MoTrack</span>
                  <span className="block truncate text-[11px] text-slate-400">{momentum.score}% momentum</span>
                </div>
              </Link>

              <div className="hidden w-full max-w-md items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 md:flex">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search projects, tasks, and notes"
                  disabled
                  className="w-full border-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-slate-300 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                  {momentum.streak} day streak
                </div>
                <button
                  className="touch-target rounded-lg border border-white/10 bg-white/[0.035] p-2 text-slate-400 transition hover:bg-white/[0.075] hover:text-white"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className="touch-target hidden cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-blue-500 md:flex"
                >
                  <Plus className="h-4 w-4" />
                  Create
                </button>
                {profile && (
                  <Link to="/profile" className="rounded-lg border border-white/10 bg-white/[0.035] p-1 transition hover:bg-white/[0.075]">
                    <img
                      src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={profile.full_name}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-md object-cover"
                    />
                  </Link>
                )}
              </div>
            </div>
            <nav className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto pb-3 md:hidden" aria-label="More navigation">
              {mobileRailItems.map(item => {
                const isActive = isNavActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex min-h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-[11px] font-semibold transition ${
                      isActive
                        ? 'border-purple-300/25 bg-purple-500/15 text-purple-100'
                        : 'border-white/10 bg-white/[0.035] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="app-content-safe min-w-0 flex-1 overflow-x-hidden px-4 pt-5 md:px-6 md:pt-6">
            <Outlet />
          </main>
        </div>
      </div>

      <button
        onClick={() => setIsQuickAddOpen(true)}
        className="fixed right-4 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-[0_22px_42px_-18px_rgba(139,92,246,0.95)] transition active:scale-95 md:hidden"
        style={{ bottom: 'calc(5.6rem + var(--safe-bottom))' }}
        aria-label="Create"
      >
        <Plus className="h-6 w-6" />
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 md:hidden" aria-label="Primary navigation">
        <div className="bottom-nav-safe premium-border mx-auto grid max-w-md grid-cols-5 gap-1 rounded-lg border border-white/10 bg-[#050915]/92 p-1.5 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.98)] backdrop-blur-xl">
          {mobileNavItems.map(item => {
            const isActive = isNavActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-lg px-1 text-[10px] font-medium transition active:scale-[0.96] ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="mobileNavActive"
                    className="absolute inset-0 rounded-lg border border-purple-300/25 bg-gradient-to-b from-purple-500/20 to-blue-500/10"
                    transition={{ type: 'spring', stiffness: 440, damping: 36 }}
                  />
                )}
                <Icon className={`relative h-4 w-4 ${isActive ? 'text-purple-100' : 'text-slate-500'}`} />
                <span className="relative max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAdded={() => {}}
      />
    </div>
  );
};
