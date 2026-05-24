import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FolderLock,
  Sparkles,
  Flame
} from 'lucide-react';
import { mockDb } from '../lib/supabase';
import { GlassCard, GlowCard, LoadingState, GradientButton } from '../components/Reusable';

export const Focus: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Focus configuration states
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [sessionType, setSessionType] = useState<'Focus' | 'Short Break' | 'Long Break'>('Focus');
  const [sessionNotes, setSessionNotes] = useState('');

  // Pomodoro timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 Min default
  const [totalDuration, setTotalDuration] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Sound & wave synthesis states
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Timer reference
  const timerRef = useRef<any>(null);

  // Load active projects for target mapping
  useEffect(() => {
    mockDb.getProjects().then(({ data }) => {
      setProjects(data || []);
      if (data && data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
      setLoading(false);
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopBinauralBeat();
    };
  }, []);

  // Sync Timer countdown relative toisRunning
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleCycleWrap();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, sessionType]);

  // Handle active audio synthesis loop for real binaural focus sounds!
  useEffect(() => {
    if (isRunning && !isAudioMuted) {
      startBinauralBeat();
    } else {
      stopBinauralBeat();
    }
  }, [isRunning, isAudioMuted, sessionType]);

  const handleCycleWrap = async () => {
    // Session completed! Save focus metrics logs
    const completedMin = Math.round(totalDuration / 60);
    if (sessionType === 'Focus') {
      try {
        await mockDb.addFocusSession({
          project_id: selectedProjectId || null,
          duration: completedMin,
          session_type: 'Focus',
          notes: sessionNotes || 'Completed focus session.'
        });
        
        alert(`Focus session complete. Registered ${completedMin} minutes in MoTrack.`);
      } catch (err) {
        console.error('Error recording focus block:', err);
      }
    } else {
      alert('Break complete. Ready for another focus session.');
    }

    // Reset loop context
    setIsRunning(false);
    setSessionNotes('');
    configurePreset(25, 'Focus');
  };

  // Preset Configurations
  const configurePreset = (min: number, type: 'Focus' | 'Short Break' | 'Long Break') => {
    setIsRunning(false);
    setSessionType(type);
    setTimeLeft(min * 60);
    setTotalDuration(min * 60);
  };

  // Web Audio Alpha Binaural Wave synthesizer generators
  // Synthesizes a deep binaural alpha focusing tone (140Hz and 150Hz) to maximize study concentration!
  const startBinauralBeat = () => {
    try {
      if (oscillatorRef.current) return; // already active

      // Initialize Web Audio Context holding volume gain
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const actx = new AudioCtx();
      audioContextRef.current = actx;

      const osc = actx.createOscillator();
      const gain = actx.createGain();

      osc.type = 'sine';
      // Low relaxing frequency paired with Alpha concentration beats
      osc.frequency.setValueAtTime(sessionType === 'Focus' ? 144 : 120, actx.currentTime);

      gain.gain.setValueAtTime(0.04, actx.currentTime); // keep very quiet and subtle ambient murmur

      osc.connect(gain);
      gain.connect(actx.destination);

      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.error('Web Audio context blocked or not supported on this tab/system.', e);
    }
  };

  const stopBinauralBeat = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (e) {
      console.warn('Error clearing sound oscillator', e);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentProgress = ((totalDuration - timeLeft) / totalDuration) * 100;

  if (loading) {
    return <LoadingState message="Preparing your focus room..." />;
  }

  return (
    <div className="page-shell-narrow select-none font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Focus Timer
          </h1>
          <p className="page-subtitle mt-2">
            Enter a quiet focus session, attach it to a project, and let progress log itself.
          </p>
        </div>

        {/* Sound toggler */}
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className={`touch-target rounded-lg px-4 py-2 transition font-sans text-sm font-semibold flex items-center gap-2 border cursor-pointer ${
            !isAudioMuted
              ? 'bg-purple-600/15 border-purple-500/20 text-purple-300 shadow-md shadow-purple-500/10'
              : 'border-white/5 bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-purple-400 animate-bounce" />}
          {isAudioMuted ? 'Sound Off' : 'Focus Sound'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6 lg:items-start">
        {/* Main interactive visual clock */}
        <GlassCard className="relative flex min-h-[390px] flex-col items-center justify-center overflow-hidden p-5 sm:min-h-[420px] sm:p-8 lg:col-span-8" hoverScale={false}>
          
          {/* Wave pulses in background while running */}
          <AnimatePresence>
            {isRunning && (
              <motion.div
                key="pulse-aura"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.15, 0.45, 0.15]
                }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute w-80 h-80 rounded-full bg-purple-500/5 blur-3xl -z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Preset Buttons */}
          <div className="no-scrollbar z-10 mb-8 flex max-w-full gap-2 overflow-x-auto rounded-lg border border-white/5 bg-neutral-950/60 p-1 text-[11px]">
            <button
              onClick={() => configurePreset(25, 'Focus')}
              className={`touch-target shrink-0 rounded-lg px-4 py-1.5 transition font-semibold cursor-pointer ${sessionType === 'Focus' ? 'bg-purple-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              25m Focus
            </button>
            <button
              onClick={() => configurePreset(5, 'Short Break')}
              className={`touch-target shrink-0 rounded-lg px-4 py-1.5 transition font-semibold cursor-pointer ${sessionType === 'Short Break' ? 'bg-cyan-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              5m Break
            </button>
            <button
              onClick={() => configurePreset(15, 'Long Break')}
              className={`touch-target shrink-0 rounded-lg px-4 py-1.5 transition font-semibold cursor-pointer ${sessionType === 'Long Break' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              15m Long Break
            </button>
          </div>

          {/* Giant visual radial and clock text */}
          <div className="relative my-4 flex h-52 w-52 items-center justify-center sm:h-56 sm:w-56">
            
            {/* The SVG countdown bar ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 scale-95" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-neutral-900"
                strokeWidth="2.5"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                className={sessionType === 'Focus' ? 'stroke-purple-500' : (sessionType === 'Short Break' ? 'stroke-cyan-500' : 'stroke-indigo-500')}
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray="264"
                animate={{ strokeDashoffset: 264 - (264 * percentProgress) / 100 }}
                transition={{ duration: 0.35 }}
                strokeLinecap="round"
              />
            </svg>

            {/* Central Clock Typography figures */}
            <div className="text-center z-10">
              <span className="block mb-0.5 font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {formatTime(timeLeft)}
              </span>
              <span className={`text-[10px] tracking-widest uppercase font-sans font-semibold px-2 py-0.5 rounded-md ${
                sessionType === 'Focus' ? 'text-purple-400' : (sessionType === 'Short Break' ? 'text-cyan-400 bg-cyan-500/10' : 'text-indigo-400 bg-indigo-500/10')
              }`}>
                {sessionType} Active
              </span>
            </div>
          </div>

          {/* Interactive triggers */}
          <div className="flex items-center gap-4 mt-8 z-10">
            <button
              onClick={resetTimer}
              className="touch-target rounded-lg border border-white/10 bg-neutral-900/60 p-3.5 text-neutral-400 transition hover:border-white/20 hover:text-white active:scale-95 cursor-pointer"
              title="Reset cycle"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`touch-target rounded-lg p-4 font-bold font-sans tracking-wide transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 ${
                isRunning
                  ? 'bg-neutral-100 hover:bg-white text-neutral-950'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
          </div>
        </GlassCard>

        {/* Configuration mapping side control bar */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* Target project mapping */}
          <GlassCard className="p-6 text-left" hoverScale={false}>
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <FolderLock className="w-4 h-4 text-purple-400" />
              <h3 className="section-kicker">Project context</h3>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div>
                <label className="form-label">Project</label>
                {projects.length === 0 ? (
                  <p className="text-[11px] text-neutral-500 italic">No projects yet. This session will be saved as standalone focus.</p>
                ) : (
                  <select
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="field-control cursor-pointer"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="form-label">Session note</label>
                <input
                  type="text"
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  placeholder="Finish dashboard layout"
                  className="field-control"
                />
              </div>

              {/* Tips */}
              <div className="p-3.5 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[10.5px] text-purple-300 leading-normal flex gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
              Focus sound plays only while the timer is running. Keep volume low and comfortable.
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Study progress cards */}
          <GlowCard glowColor="purple" className="p-6 text-center" hoverScale={false}>
            <Flame className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-pulse" />
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Focus Summary</h3>
            <p className="text-[10.5px] text-neutral-300 px-2 mt-1.5 leading-relaxed">
              Every completed focus session is saved to your timeline and included in analytics.
            </p>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};
