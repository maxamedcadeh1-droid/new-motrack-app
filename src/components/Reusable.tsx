import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, LucideIcon, RefreshCw, AlertCircle } from 'lucide-react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverScale?: boolean;
}

const glowByColor: Record<string, string> = {
  purple: 'hover:border-purple-300/30 hover:shadow-[0_22px_72px_-46px_rgba(139,92,246,0.95)]',
  blue: 'hover:border-blue-300/30 hover:shadow-[0_22px_72px_-46px_rgba(59,130,246,0.9)]',
  cyan: 'hover:border-cyan-300/30 hover:shadow-[0_22px_72px_-46px_rgba(34,211,238,0.75)]',
  green: 'hover:border-emerald-300/30 hover:shadow-[0_22px_72px_-46px_rgba(34,197,94,0.68)]',
  amber: 'hover:border-amber-300/30 hover:shadow-[0_22px_72px_-46px_rgba(251,191,36,0.65)]',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowColor,
  hoverScale = true,
  ...props
}) => {
  const glowStyle = glowColor ? glowByColor[glowColor] || glowByColor.purple : 'hover:border-white/15';

  return (
    <motion.div
      whileHover={hoverScale ? { y: -2 } : undefined}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`glass-panel rounded-lg p-4 transition-all duration-300 sm:p-5 ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface GlowCardProps extends GlassCardProps {
  glowDelay?: number;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'purple',
  ...props
}) => {
  const gradientBorder =
    glowColor === 'purple'
      ? 'from-purple-400/30 via-blue-400/15 to-transparent'
      : glowColor === 'green'
        ? 'from-emerald-400/30 via-cyan-400/15 to-transparent'
        : 'from-blue-400/30 via-cyan-400/15 to-transparent';

  return (
    <div className="group relative rounded-lg">
      <div className={`absolute -inset-px rounded-lg bg-gradient-to-r ${gradientBorder} opacity-70 blur-sm transition duration-500 group-hover:opacity-100`} />
      <GlassCard className={`relative z-10 ${className}`} hoverScale={false} {...props}>
        {children}
      </GlassCard>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string | number;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconColor = 'purple',
  trend
}) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    purple: { bg: 'bg-purple-500/10 border-purple-300/20', text: 'text-purple-200' },
    blue: { bg: 'bg-blue-500/10 border-blue-300/20', text: 'text-blue-200' },
    cyan: { bg: 'bg-cyan-500/10 border-cyan-300/20', text: 'text-cyan-200' },
    green: { bg: 'bg-emerald-500/10 border-emerald-300/20', text: 'text-emerald-200' },
    amber: { bg: 'bg-amber-500/10 border-amber-300/20', text: 'text-amber-200' },
  };

  const selectedColor = colorMap[iconColor] || colorMap.purple;

  return (
    <GlassCard className="flex min-h-[116px] flex-col justify-between p-4" glowColor={iconColor}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="mb-1 block truncate text-[11px] font-semibold uppercase tracking-wide text-slate-400">{title}</span>
          <span className="block font-display text-2xl font-bold leading-none tracking-normal text-white sm:text-3xl">{value}</span>
        </div>
        <div className={`touch-target flex shrink-0 items-center justify-center rounded-lg border ${selectedColor.bg} ${selectedColor.text}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(subtext || trend) && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-3 text-[11px] text-slate-500">
          <span className="min-w-0 truncate">{subtext}</span>
          {trend && (
            <span className={`${trend.isPositive ? 'text-emerald-300' : 'text-slate-500'} shrink-0 font-semibold`}>
              {trend.value}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
};

interface MomentumOrbProps {
  score: number;
  streak: number;
}

export const MomentumOrb: React.FC<MomentumOrbProps> = ({ score, streak }) => {
  const glowIntensity = score / 100;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-5">
      <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-[#070a15]/90 shadow-[inset_0_0_38px_rgba(255,255,255,0.045)] sm:h-44 sm:w-44">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" className="stroke-slate-800" strokeWidth="3" fill="transparent" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-purple-300"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="276"
            initial={{ strokeDashoffset: 276 }}
            animate={{ strokeDashoffset: 276 - (276 * score) / 100 }}
            transition={{ duration: 1.25, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        <div className="z-10 flex flex-col items-center text-center">
          <Sparkles className="mb-1 h-4 w-4 text-purple-200" />
          <span className="font-display text-4xl font-bold tracking-normal text-white">{score}%</span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Momentum</span>
        </div>

        <div
          className="absolute inset-0 rounded-full border border-purple-400/30 opacity-75 transition-all duration-1000"
          style={{
            boxShadow: `0 0 ${18 + glowIntensity * 34}px rgba(139, 92, 246, ${0.12 + glowIntensity * 0.3})`
          }}
        />
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs text-slate-400">Streak </span>
        <span className="bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-sm font-bold text-transparent">
          {streak} days
        </span>
      </div>
    </div>
  );
};

export const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Preparing your workspace...' }) => (
  <div className="mx-auto flex min-h-[52dvh] w-full max-w-4xl flex-col justify-center gap-4 p-4">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[0, 1, 2, 3].map(i => (
        <SkeletonBlock key={i} className="h-24" />
      ))}
    </div>
    <div className="glass-panel flex items-center gap-3 rounded-lg p-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="text-purple-200"
      >
        <RefreshCw className="h-5 w-5" />
      </motion.div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <GlassCard className="mx-auto my-8 flex max-w-md flex-col items-center justify-center border-red-500/20 p-8 text-center">
    <AlertCircle className="mb-3 h-12 w-12 text-rose-400" />
    <h3 className="mb-1 text-base font-semibold text-white">Something needs attention</h3>
    <p className="mb-4 text-sm leading-relaxed text-slate-400">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="touch-target rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Try again
      </button>
    )}
  </GlassCard>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, icon: Icon, actionLabel, onAction }) => (
  <div className="my-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-[#070b16]/66 p-7 text-center sm:p-10">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400">
      <Icon className="h-7 w-7 opacity-85" />
    </div>
    <h3 className="mb-1 font-display text-lg font-semibold tracking-normal text-white">{title}</h3>
    <p className="mb-5 max-w-sm text-sm leading-relaxed text-slate-400">{description}</p>
    {actionLabel && onAction && (
      <GradientButton onClick={onAction} className="px-4 py-2 text-sm">
        {actionLabel}
      </GradientButton>
    )}
  </div>
);

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'purple' | 'cyan' | 'ghost';
  className?: string;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'purple',
  className = '',
  ...props
}) => {
  const variantClass =
    variant === 'purple'
      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_16px_36px_-20px_rgba(139,92,246,0.95)] hover:from-purple-500 hover:to-blue-500'
      : variant === 'cyan'
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_16px_36px_-20px_rgba(6,182,212,0.95)] hover:from-cyan-400 hover:to-blue-500'
        : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]';

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`touch-target inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
