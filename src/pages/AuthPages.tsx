import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  User,
  AtSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FolderKanban,
  CalendarCheck,
  Timer,
  BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GradientButton, GlassCard } from '../components/Reusable';

const AuthBrand: React.FC = () => (
  <aside className="hidden min-h-[calc(100dvh-48px)] max-w-md flex-col justify-between rounded-lg border border-white/10 bg-[#080c19]/78 p-8 shadow-[0_24px_80px_-52px_rgba(0,0,0,0.95)] backdrop-blur-xl lg:flex">
    <div>
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-purple-400/20 bg-gradient-to-br from-purple-600/30 to-blue-500/20">
          <span className="bg-gradient-to-br from-purple-300 to-blue-300 bg-clip-text text-4xl font-black text-transparent">M</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-none tracking-tight text-white">MoTrack</h1>
          <p className="mt-2 text-sm font-medium text-purple-200">Move with intention.</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { icon: FolderKanban, label: 'Projects & Tasks' },
          { icon: CalendarCheck, label: 'Daily Activities' },
          { icon: Timer, label: 'Focus Timer' },
          { icon: BarChart3, label: 'Analytics & Insights' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-slate-200">
              <Icon className="h-5 w-5 text-purple-300" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>

    <div className="rounded-lg border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
        <ShieldCheck className="h-4 w-4 text-emerald-300" />
        Student productivity OS
      </div>
      <p className="text-xs leading-relaxed text-slate-400">
        Plan the work, protect your focus, and keep momentum visible.
      </p>
    </div>
  </aside>
);

const AuthShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="app-background min-h-[100dvh] overflow-x-hidden bg-[#030611] px-4 pb-6 text-slate-100 antialiased sm:px-6" style={{ paddingTop: 'max(1rem, var(--safe-top))' }}>
    <div className="mx-auto flex min-h-[calc(100dvh-32px)] w-full max-w-6xl items-start justify-center gap-8 pt-6 sm:min-h-[calc(100dvh-48px)] lg:items-center lg:pt-0">
      <AuthBrand />
      {children}
    </div>
  </div>
);

const AuthLogo: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <div className="mb-7 text-center">
    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-lg border border-purple-400/20 bg-gradient-to-br from-purple-600/30 to-blue-500/20 shadow-[0_18px_40px_-24px_rgba(139,92,246,0.95)]">
      <span className="text-3xl font-black text-purple-100">M</span>
    </div>
    <h1 className="font-display text-2xl font-bold tracking-normal text-white">MoTrack</h1>
    <p className="mt-1 text-xs font-medium text-purple-300">{subtitle}</p>
  </div>
);

const FieldIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{children}</span>
);

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        navigate('/dashboard');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) {
        setError(authErr.message);
        return;
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <AuthLogo subtitle="Welcome back" />

        <GlassCard className="p-7" hoverScale={false}>
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold tracking-normal text-white">Welcome back.</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">Step back into your focus system.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-200"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">Email address</label>
              <div className="relative">
                <FieldIcon><Mail className="h-4 w-4" /></FieldIcon>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.035] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-[11px] font-semibold text-slate-400">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-semibold text-purple-300 transition hover:text-purple-200">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FieldIcon><Lock className="h-4 w-4" /></FieldIcon>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.035] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <GradientButton type="submit" className="relative mt-2 w-full py-3" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="absolute right-4 h-4 w-4 opacity-75" />
            </GradientButton>
          </form>

          <div className="mt-5 border-t border-white/10 pt-4 text-center">
            <p className="text-[11px] leading-relaxed text-slate-500">
              Your account is secured by Supabase Auth.
            </p>
          </div>
        </GlassCard>

        <p className="mt-6 text-center text-sm text-slate-400">
          First time here?{' '}
          <Link to="/signup" className="font-semibold text-purple-300 transition hover:text-purple-200">
            Create an account
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
};

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        navigate('/dashboard');
      } else {
        setSuccess('Account created. Check your email to confirm your account, then sign in.');
      }
    } catch (err: any) {
      setError(err.message || 'Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <AuthLogo subtitle="Create your account" />

        <GlassCard className="p-7" hoverScale={false}>
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold tracking-normal text-white">Create something meaningful.</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">Start with a quiet workspace for projects, habits, notes, and focus.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs leading-relaxed text-emerald-200">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">Full name</label>
              <div className="relative">
                <FieldIcon><User className="h-4 w-4" /></FieldIcon>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.035] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">Email address</label>
              <div className="relative">
                <FieldIcon><AtSign className="h-4 w-4" /></FieldIcon>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.035] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">Password</label>
              <div className="relative">
                <FieldIcon><Lock className="h-4 w-4" /></FieldIcon>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.035] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <GradientButton type="submit" className="w-full py-3" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </GradientButton>
          </form>
        </GlassCard>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-purple-300 transition hover:text-purple-200">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
};

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (!error) {
      setSubmitted(true);
    }

    setLoading(false);
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <AuthLogo subtitle="Recover access" />

        <GlassCard className="p-7" hoverScale={false}>
          {!submitted ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Reset password</h2>
                <p className="mt-1 text-sm text-slate-400">Enter your email and we will send recovery instructions.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-400">Email address</label>
                  <div className="relative">
                    <FieldIcon><Mail className="h-4 w-4" /></FieldIcon>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.035] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <GradientButton type="submit" className="w-full py-3" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </GradientButton>
              </form>
            </>
          ) : (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 inline-flex rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3 text-emerald-300">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">Check your inbox</h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Recovery instructions were sent to <span className="font-semibold text-purple-200">{email}</span>.
              </p>
              <Link to="/login">
                <GradientButton className="w-full py-3">Back to Login</GradientButton>
              </Link>
            </div>
          )}
        </GlassCard>

        {!submitted && (
          <p className="mt-6 text-center text-sm text-slate-400">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-purple-300 transition hover:text-purple-200">
              Sign in
            </Link>
          </p>
        )}
      </motion.div>
    </AuthShell>
  );
};
