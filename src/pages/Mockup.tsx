import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Search,
  Bell,
  Check,
  Flame,
  Clock,
  FolderKanban,
  CheckSquare,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  Navigation,
  Layers,
  Award,
  Zap,
  Sliders,
  Smartphone,
  RotateCcw,
  Volume2,
  Info,
  X,
  Compass,
  Play,
  Pause,
  Activity,
  User,
  Crown,
  Heart,
  Calendar,
  BookOpen,
  TrendingUp,
  Plus
} from 'lucide-react';

// Theme Presets for extreme UX customization
interface ThemeConfig {
  id: string;
  name: string;
  ambientAura: string;
  glowBorderColor: string;
  accentText: string;
  gradientBrand: string;
  accentPillBg: string;
  glowShadow: string;
}

const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'hyper-space',
    name: 'Hyper-Space Odyssey (Default)',
    ambientAura: 'from-purple-600/30 via-indigo-600/15 to-transparent',
    glowBorderColor: 'border-purple-500/30 group-hover:border-purple-500/50',
    accentText: 'text-purple-400',
    gradientBrand: 'from-purple-500 via-indigo-500 to-blue-500',
    accentPillBg: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
    glowShadow: 'shadow-[0_0_25px_rgba(168,85,247,0.15)]',
  },
  {
    id: 'titanium-cyber',
    name: 'Titanium Cyberpunk',
    ambientAura: 'from-cyan-500/25 via-emerald-500/15 to-transparent',
    glowBorderColor: 'border-cyan-500/30 group-hover:border-cyan-500/50',
    accentText: 'text-cyan-400',
    gradientBrand: 'from-cyan-500 via-teal-500 to-emerald-400',
    accentPillBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    glowShadow: 'shadow-[0_0_25px_rgba(6,182,212,0.15)]',
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Calibrator',
    ambientAura: 'from-orange-600/25 via-rose-600/15 to-transparent',
    glowBorderColor: 'border-orange-500/30 group-hover:border-orange-500/50',
    accentText: 'text-amber-400',
    gradientBrand: 'from-orange-500 via-pink-600 to-rose-500',
    accentPillBg: 'bg-orange-500/10 border-orange-500/20 text-amber-300',
    glowShadow: 'shadow-[0_0_25px_rgba(249,115,22,0.15)]',
  },
  {
    id: 'platinum-minimal',
    name: 'Platinum Executive',
    ambientAura: 'from-neutral-400/20 via-neutral-600/10 to-transparent',
    glowBorderColor: 'border-neutral-500/30 group-hover:border-neutral-500/50',
    accentText: 'text-neutral-200',
    gradientBrand: 'from-neutral-200 via-neutral-400 to-neutral-600',
    accentPillBg: 'bg-neutral-500/10 border-white/10 text-neutral-200',
    glowShadow: 'shadow-[0_0_25px_rgba(255,255,255,0.08)]',
  }
];

export const Mockup: React.FC = () => {
  // Device Controls State
  const [batteryLevel, setBatteryLevel] = useState(94);
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
  const [cameraControlActive, setCameraControlActive] = useState(false);
  
  // Custom interactive systems
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(THEME_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'tasks' | 'profile'>('dashboard');
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  
  // App interactive parameters
  const [streakDays, setStreakDays] = useState(16);
  const [momentumScore, setMomentumScore] = useState(82);
  const [focusRatio, setFocusRatio] = useState(135); // 135 mins
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [audioWave, setAudioWave] = useState([20, 45, 15, 60, 30, 75, 40]);
  const [timeStr, setTimeStr] = useState('09:41');

  // Input bindings inside mockup screen
  const [newMockTaskTitle, setNewMockTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newTaskTag, setNewTaskTag] = useState('Academics');

  // Simulated live tasks inside the phone view
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review MoTrack study timeline', priority: 'high', tag: 'Academics', time: '09:00 AM', done: true },
    { id: 2, text: 'Review live AI Platform course', priority: 'medium', tag: 'Coding', time: '11:15 AM', done: false },
    { id: 3, text: 'Sustain deep focus state review', priority: 'high', tag: 'Focus', time: '02:30 PM', done: false },
    { id: 4, text: 'Test portfolio website responsiveness', priority: 'low', tag: 'Design', time: '04:45 PM', done: false },
  ]);

  // Project List progress
  const [projectsList, setProjectsList] = useState([
    { id: 1, name: 'MoTrack App', progress: 92, count: '14/15 tasks done', color: 'from-purple-500 to-indigo-500' },
    { id: 2, name: 'AI Course Platform', progress: 68, count: '8/12 tasks done', color: 'from-blue-500 to-cyan-400' },
    { id: 3, name: 'Study Planner', progress: 50, count: '5/10 tasks done', color: 'from-emerald-400 to-teal-500' },
    { id: 4, name: 'Portfolio Website', progress: 41, count: '3/7 tasks done', color: 'from-amber-400 to-orange-500' },
    { id: 5, name: 'Mobile UI Kit', progress: 85, count: '17/20 tasks done', color: 'from-pink-500 to-rose-400' }
  ]);

  // Profile tuning deck bounds
  const [studyIntensity, setStudyIntensity] = useState(85);
  const [sustainGoal, setSustainGoal] = useState(180); // daily focus mins standard

  // Real-time ticking Clock simulation inside iPhone status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const isAm = hours < 12;
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Wave motion ticks when audio is playing in Dynamic Island
  useEffect(() => {
    let interval: any;
    if (audioPlayed) {
      interval = setInterval(() => {
        setAudioWave(prev => prev.map(() => Math.floor(Math.random() * 60) + 12));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [audioPlayed]);

  // Interactive callbacks
  const handleToggleTask = (id: number) => {
    setTasks(prev => 
      prev.map(t => {
        if (t.id === id) {
          const nextDone = !t.done;
          if (nextDone) {
            setMomentumScore(s => Math.min(100, s + 3));
          } else {
            setMomentumScore(s => Math.max(15, s - 3));
          }
          return { ...t, done: nextDone };
        }
        return t;
      })
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMockTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      text: newMockTaskTitle.trim(),
      priority: newTaskPriority,
      tag: newTaskTag,
      time: '03:15 PM',
      done: false
    };

    setTasks(prev => [...prev, newTask]);
    setNewMockTaskTitle('');
    // Trigger tiny score update
    setMomentumScore(s => Math.min(100, s + 2));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const solvedCount = tasks.filter(t => t.done).length;
  const progressRatioPct = Math.round((solvedCount / (tasks.length || 1)) * 100);

  return (
    <div className="page-shell">
      
      {/* LANDING PAGE HEADER BANNER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-8 relative">
        <div className="space-y-1.5 text-left">
          <span className="section-kicker block text-indigo-400">
            Mobile preview
          </span>
          <h1 className="page-title flex items-center gap-3">
            <Smartphone className="w-9 h-9 text-purple-400 shrink-0" />
            iPhone Preview
          </h1>
          <p className="page-subtitle">
            Explore a cinematic mobile preview of <span className="text-white font-semibold">MoTrack</span> with live controls, theme tuning, and interactive task states.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => {
              setStreakDays(16);
              setMomentumScore(82);
              setFocusRatio(135);
              setTasks([
                { id: 1, text: 'Review MoTrack study timeline', priority: 'high', tag: 'Academics', time: '09:00 AM', done: true },
                { id: 2, text: 'Review live AI Platform course', priority: 'medium', tag: 'Coding', time: '11:15 AM', done: false },
                { id: 3, text: 'Sustain deep focus state review', priority: 'high', tag: 'Focus', time: '02:30 PM', done: false },
                { id: 4, text: 'Test portfolio website responsiveness', priority: 'low', tag: 'Design', time: '04:45 PM', done: false },
              ]);
              setProjectsList([
                { id: 1, name: 'MoTrack App', progress: 92, count: '14/15 tasks done', color: 'from-purple-500 to-indigo-500' },
                { id: 2, name: 'AI Course Platform', progress: 68, count: '8/12 tasks done', color: 'from-blue-500 to-cyan-400' },
                { id: 3, name: 'Study Planner', progress: 50, count: '5/10 tasks done', color: 'from-emerald-400 to-teal-500' },
                { id: 4, name: 'Portfolio Website', progress: 41, count: '3/7 tasks done', color: 'from-amber-400 to-orange-500' },
                { id: 5, name: 'Mobile UI Kit', progress: 85, count: '17/20 tasks done', color: 'from-pink-500 to-rose-400' }
              ]);
              setIsIslandExpanded(false);
              setAudioPlayed(false);
            }}
            className="touch-target flex items-center gap-2 rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-xs font-bold font-mono text-neutral-300 transition-all hover:bg-neutral-800 cursor-pointer group"
          >
            <RotateCcw className="w-4 h-4 text-neutral-500 group-hover:rotate-180 transition-transform duration-300" />
            Reset Preview
          </button>
          
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs font-bold font-mono text-purple-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse text-purple-400" />
            Live mobile render
          </div>
        </div>
      </div>

      {/* CORE TWO-COLUMN WORKSPACE: LEFT DECK CONTROLS & RIGHT HARDWARE MOCKUP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* LEFT COLUMN: INTERACTIVE HARDWARE BUTTON CONTROLLERS (col-span-4) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 text-left">
          
          {/* THEME SELECTOR: THE ULTIMATE MODERN UX HIGHLIGHT */}
          <div className="glass-panel relative overflow-hidden rounded-lg p-5 shadow-2xl space-y-4">
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Theme selector
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                Live Change
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Tune the preview atmosphere and see the mobile UI adapt instantly.
            </p>

            <div className="grid grid-cols-1 gap-2">
              {THEME_PRESETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t)}
                  className={`relative p-3 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                    activeTheme.id === t.id
                      ? 'bg-neutral-900 border-white/20 shadow-md ring-1 ring-white/10'
                      : 'bg-neutral-950/60 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Circle preview of colors */}
                    <div className="flex -space-x-1 shrink-0">
                      <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${t.gradientBrand}`} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{t.name}</span>
                      <span className="text-[9px] text-neutral-500 font-mono">Spectrum mode {t.id}</span>
                    </div>
                  </div>
                  
                  {activeTheme.id === t.id && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SIMULATOR HARDWARE BRIDGE */}
          <div className="glass-panel rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase pb-3 border-b border-white/5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Device controls
            </h3>

            <div className="space-y-3">
              {/* Expand Dynamic Island */}
              <button 
                onClick={() => setIsIslandExpanded(!isIslandExpanded)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-left group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Expand Dynamic Island</span>
                  <span className="text-[9px] text-neutral-500 block mt-0.5">Toggle live lo-fi soundbar widget</span>
                </div>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isIslandExpanded ? 'bg-purple-400 scale-125 shadow-lg shadow-purple-500/50' : 'bg-neutral-600'}`} />
              </button>

              {/* Toggle camera control sensor */}
              <button 
                onClick={() => setCameraControlActive(!cameraControlActive)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-left group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Camera Control Strip</span>
                  <span className="text-[9px] text-neutral-500 block mt-0.5">Display iOS force feedback slider</span>
                </div>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${cameraControlActive ? 'bg-indigo-400 scale-125 shadow-lg shadow-indigo-500/50' : 'bg-neutral-600'}`} />
              </button>

              {/* Adjust simulated battery level */}
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">TELEMETRY: STATE OF CHARGE</span>
                  <span className="text-xs font-mono font-bold text-neutral-200">{batteryLevel}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-950/60 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${batteryLevel}%` }} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={() => setBatteryLevel(prev => Math.max(8, prev - 12))}
                    className="flex-1 py-1 px-2.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition duration-150 rounded-lg text-[9px] font-bold text-neutral-300"
                  >
                    Drain Battery
                  </button>
                  <button 
                    onClick={() => setBatteryLevel(prev => Math.min(100, prev + 15))}
                    className="flex-1 py-1 px-2.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition duration-150 rounded-lg text-[9px] font-bold text-neutral-300"
                  >
                    Power Supply +15%
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE PHYSICS SPECS */}
          <div className="glass-panel rounded-lg p-5 space-y-3.5">
            <h3 className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase flex items-center gap-1.5 text-neutral-300">
              <Compass className="w-4 h-4 text-emerald-400" />
              Preview specs
            </h3>
            
            <div className="space-y-3 text-xs leading-relaxed text-neutral-400">
              <div className="flex justify-between">
                <span className="text-neutral-500">Device Aspect Ratio</span>
                <span className="text-white font-mono">9 : 19 locked (Proportions precise)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Backdrop Filtration</span>
                <span className="text-white font-mono">24px heavy glassmorphism blur</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Core Frame Bezels</span>
                <span className="text-white font-mono">Ultra-narrow titanium outline</span>
              </div>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: HIGH QUALITY PHYSICAL IPHONE 16 PRO MOCKUP (col-span-8) */}
        {/* We place the phone mockup in a larger responsive container and add a stunning organic dark-cinematic glowing background sphere */}
        <div className="relative flex min-h-[680px] flex-col items-center justify-start overflow-hidden py-4 sm:min-h-[850px] lg:col-span-8 lg:justify-center">
          
          {/* AMBIENT RADIAL LIGHTING (Dynamic based on selected presets) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-3xl">
            <div className={`absolute w-[450px] h-[450px] rounded-full filter blur-[120px] bg-gradient-to-tr ${activeTheme.ambientAura} transition-all duration-700 opacity-60`} />
            <div className="absolute w-[800px] h-[800px] rounded-full filter blur-[160px] bg-indigo-900/10 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-4 bg-neutral-900/40 p-2 rounded-xl border border-white/5 backdrop-blur-sm z-10 flex items-center gap-1.5 select-none">
            <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            Interactive iPhone 16 Pro Simulator Viewport
          </span>

          {/* THE PHYSICAL DEVICE CONTAINER */}
          <div className="relative z-10 origin-top scale-[0.78] select-none rounded-[54px] bg-gradient-to-b from-[#252528] via-[#111113] to-[#040405] p-1.5 shadow-[0_15px_70px_rgba(0,0,0,0.9),_0_0_0_1.5px_rgba(255,255,255,0.06),_0_0_80px_rgba(168,85,247,0.1)] transition-all duration-500 ease-out sm:scale-100">
            
            {/* Outer Protective Rim Line */}
            <div className="absolute inset-0 border border-white/5 rounded-[54px] pointer-events-none" />

            {/* Apple Physical Side Buttons Shims */}
            {/* Left Hand: Custom Action Button & Volume */}
            <div className="absolute left-[-2.5px] top-[140px] w-[3px] h-[28px] bg-neutral-800 rounded-l border-y border-white/10" />
            <div className="absolute left-[-2.5px] top-[190px] w-[3px] h-[50px] bg-neutral-800 rounded-l border-y border-white/10" />
            <div className="absolute left-[-2.5px] top-[252px] w-[3px] h-[50px] bg-neutral-800 rounded-l border-y border-white/10" />

            {/* Right Hand: Deep Power Key Lock & Camera Force sensor */}
            <div className="absolute right-[-2.5px] top-[190px] w-[3px] h-[65px] bg-neutral-800 rounded-r border-y border-white/10" />
            
            {/* Camera Force Touch sensor */}
            <div className={`absolute right-[-2.5px] top-[340px] w-[3.5px] h-[55px] rounded-r transition-all duration-305 ${cameraControlActive ? 'bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.7)] scale-x-110' : 'bg-neutral-800/80'} border-y border-white/5`} />

            {/* SCREEN CONTAINER (Locked to standard high-density 9:19 iPhone limits 390px * 822px) */}
            <div className="relative w-[390px] h-[822px] bg-[#020205] rounded-[52px] overflow-hidden border-[4.5px] border-black/90 ring-1 ring-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05),_inset_0_0_12px_rgba(168,85,247,0.15),_inset_0_0_0_1.5px_rgba(255,255,255,0.12)] flex flex-col select-text">
              
              {/* TOP LIGHTING BAR GRADIENT */}
              <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-purple-500/5 via-indigo-500/0 to-transparent pointer-events-none z-10" />

              {/* iOS STATUS BAR SIMULATOR */}
              <div className="h-11 px-8 pt-3 flex items-center justify-between text-white text-[11px] font-semibold z-40 select-none pointer-events-none bg-gradient-to-b from-[#020205] to-transparent shrink-0">
                {/* Status bar Clock */}
                <div className="font-mono tracking-tight text-neutral-100 font-bold">
                  {timeStr}
                </div>

                {/* Blank center for Physical camera island gap safety */}
                <div className="w-16" />

                {/* Battery percentage / Wifi signals */}
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-300">
                  <span>5G</span>
                  <div className="flex items-end gap-[1.5px] h-2">
                    <div className="w-[1.5px] h-[2.5px] bg-white rounded-2xs" />
                    <div className="w-[1.5px] h-[4px] bg-white rounded-2xs" />
                    <div className="w-[1.5px] h-[5.5px] bg-white rounded-2xs" />
                    <div className="w-[1.5px] h-[7px] bg-white rounded-2xs" />
                  </div>
                  
                  <span className="ml-1 text-neutral-400">{batteryLevel}%</span>
                  <div className="w-[19px] h-2.5 rounded-sm border border-neutral-400/80 p-0.5 flex items-center">
                    <div 
                      className={`h-full rounded-2xs transition-all duration-300 ${batteryLevel < 20 ? 'bg-rose-500' : 'bg-emerald-400'}`} 
                      style={{ width: `${batteryLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* THE DYNAMIC ISLAND WIDGET (FULLY FUNCTIONAL EASTER EGG IN THIS VERSION!) */}
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-50 select-none">
                <motion.div
                  onClick={() => setIsIslandExpanded(!isIslandExpanded)}
                  layout
                  className="bg-black text-white rounded-full flex items-center justify-between pointer-events-auto cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-white/10 text-center px-4 overflow-hidden"
                  animate={{
                    width: isIslandExpanded ? 320 : 105,
                    height: isIslandExpanded ? 72 : 28,
                    borderRadius: isIslandExpanded ? 24 : 99,
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                >
                  {!isIslandExpanded ? (
                    /* Default state */
                    <div className="w-full flex items-center justify-between text-[11px] px-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping mr-1" />
                      <span className="font-mono text-[8px] tracking-widest text-purple-400 font-bold block truncate max-w-[62px]">
                        MOTRACK
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1cbb50] ml-1" />
                    </div>
                  ) : (
                    /* Expanded Ambient Lo-Fi Player block */
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-full flex items-center justify-between px-2 py-1.5 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid closing island
                            setAudioPlayed(!audioPlayed);
                          }}
                          className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-purple-600/35 transition shrink-0 cursor-pointer"
                        >
                          {audioPlayed ? <Pause className="w-4 h-4 text-purple-300" /> : <Play className="w-4 h-4 text-purple-300 fill-purple-300" />}
                        </button>
                        <div>
                          <span className="text-[8px] font-mono tracking-widest text-purple-400 font-bold uppercase block">
                            Lo-Fi Study Ambiance
                          </span>
                          <span className="text-[11px] font-bold text-white block truncate max-w-[130px]">
                            {audioPlayed ? 'Focus Waves: Alpha Alpha..' : 'Ambient Audio Idle'}
                          </span>
                        </div>
                      </div>

                      {/* Mock wave visualizer bars */}
                      <div className="flex items-end gap-1 h-6 pr-2 shrink-0">
                        {audioWave.map((h, idx) => (
                          <motion.div 
                            key={idx}
                            animate={{ height: audioPlayed ? `${h}%` : '20%' }}
                            transition={{ type: 'tween' }}
                            className="w-[2px] bg-purple-400 rounded-full" 
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* CAMERA CONTROL HUD OVERLAY (IF SENSOR CLICKED IN DECK) */}
              <AnimatePresence>
                {cameraControlActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-x-4 top-16 bottom-20 bg-black/95 z-40 rounded-[28px] border border-indigo-500/25 p-5 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase">Apple Force Sensor Active</span>
                      </div>
                      <button 
                        onClick={() => setCameraControlActive(false)}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="my-auto text-center space-y-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 mx-auto flex items-center justify-center text-white scale-100 animate-pulse">
                        <Volume2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-white">Apple Force Calibration</h4>
                        <p className="text-[10px] text-neutral-400 max-w-xs mx-auto leading-relaxed">
                          Slide fingers along the iPhone 16 Pro bezel track sensor to cycle focus audio levels or scale study goal ranges.
                        </p>
                      </div>

                      {/* Slider tracker HUD widget */}
                      <div className="bg-neutral-900 rounded-xl p-3 max-w-[220px] mx-auto border border-white/5 space-y-1 text-left">
                        <div className="flex justify-between text-[8px] text-neutral-400 font-mono">
                          <span>AUDIO BALANCE factor</span>
                          <span>LEVEL 4</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-indigo-500 rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block">
                        Tap bezel button to lock feedback
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ------------------------------------- */}
              {/* SCROLL CONTAINER BODY ENCLOSING ACTIVE NAV TAB PANEL */}
              {/* ------------------------------------- */}
              <div className="flex-1 overflow-y-auto px-5 pt-3 pb-24 space-y-5 scrollbar-none select-text">
                
                {/* BRANDING TOP BAR */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button className="text-neutral-400 hover:text-white transition">
                      <Menu className="w-5 h-5" />
                    </button>
                    <span className="text-[12.5px] font-black tracking-widest text-white tracking-widest ml-0.5">
                      MOTRACK
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="text-neutral-400 hover:text-white transition">
                      <Search className="h-[18px] w-[18px]" />
                    </button>
                    
                    {/* Notification Alert Bell */}
                    <button className="relative text-neutral-400 hover:text-white transition">
                      <Bell className="h-[18px] w-[18px]" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-black animate-pulse" />
                    </button>

                    {/* Circular user avatar image with active green dot */}
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                        alt="Mohamed Portfolio Profile"
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-white/15"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
                    </div>
                  </div>
                </div>

                {/* SWITCH VIEWS DYNAMIC CONTENT MODULE */}
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: DASHBOARD VIEW */}
                  {activeTab === 'dashboard' && (
                    <motion.div
                      key="dashboard-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5 text-left"
                    >
                      {/* Hero Section Banner inside simulator */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h2 className="text-lg font-black text-white leading-tight">
                            Good morning, Mohamed. 👋
                          </h2>
                          <p className="text-[11px] text-neutral-400 font-medium">
                            Let’s build your best day.
                          </p>
                        </div>

                        {/* Streak Banner Pill */}
                        <div className="px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-400 flex items-center gap-1 shrink-0 select-none shadow-[0_2px_12px_rgba(249,115,22,0.1)]">
                          <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                          {streakDays} day streak
                        </div>
                      </div>

                      {/* STATS MATRIX: Circular Score, Tasks open, focus, and projects counts */}
                      <div className="grid grid-cols-2 gap-3">
                        
                        {/* CARD 1: Circular Momentum Progress */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-[8.5px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                              Momentum
                            </span>
                            <span className="text-[8px] font-mono font-extrabold text-[#11bb51] bg-[#11bb51]/15 px-1.5 py-0.5 rounded-md">
                              +12.4%
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15" className="stroke-white/5" strokeWidth="2.5" fill="transparent" />
                                <circle cx="18" cy="18" r="15" className={`stroke-purple-500`} strokeWidth="3" fill="transparent" strokeDasharray="94" strokeDashoffset={94 - (94 * momentumScore) / 100} strokeLinecap="round" />
                              </svg>
                              <span className="text-[10px] font-mono font-black text-white">{momentumScore}%</span>
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] text-neutral-400 block font-bold leading-tight">Momentum Score</span>
                              <span className="text-[8.5px] text-purple-400 block font-mono font-bold mt-0.5">optimal factor</span>
                            </div>
                          </div>
                        </div>

                        {/* CARD 2: Tasks count */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-[8.5px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                              Tasks Today
                            </span>
                            <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400">
                              <CheckSquare className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <div>
                            <span className="text-lg font-mono font-black text-white block">
                              12 tasks
                            </span>
                            <span className="text-[9px] text-neutral-500 block font-medium mt-0.5">
                              {solvedCount} completed / {tasks.length - solvedCount} open
                            </span>
                          </div>
                        </div>

                        {/* CARD 3: Focus Session Tracker */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-[8.5px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                              Focus Time
                            </span>
                            <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <div>
                            <span className="text-lg font-mono font-black text-white block">
                              135m
                            </span>
                            <span className="text-[9px] text-neutral-500 block font-medium mt-0.5">
                              Goal: {sustainGoal}m / {Math.round((focusRatio / sustainGoal) * 100)}%
                            </span>
                          </div>
                        </div>

                        {/* CARD 4: Active Projects Count */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-[8.5px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                              Active Projects
                            </span>
                            <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                              <FolderKanban className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <div>
                            <span className="text-base font-mono font-black text-white block">
                              8 projects
                            </span>
                            <span className="text-[9px] text-neutral-500 block font-medium mt-0.5">
                              5 sandbox coursework
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* TODAY TASKS CARD VIEW BRIEF */}
                      <div className="p-4 rounded-2xl bg-[#08080d]/80 border border-white/10 backdrop-blur-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[8px] font-mono tracking-widest text-[#a855f7] uppercase font-bold block mb-0.5">Focus Schedule</span>
                            <h3 className="text-xs font-bold text-white">Daily Task Subroutines</h3>
                          </div>
                          
                          <div className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-white/5 text-[9px] font-mono text-neutral-400">
                            {solvedCount}/{tasks.length} Done
                          </div>
                        </div>

                        {/* Render top 3 tasks compact list */}
                        <div className="space-y-2">
                          {tasks.slice(0, 3).map((task) => (
                            <div 
                              key={task.id}
                              onClick={() => handleToggleTask(task.id)}
                              className={`p-2.5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                                task.done 
                                  ? 'bg-purple-950/5 border-purple-500/10 opacity-60' 
                                  : 'bg-neutral-950/70 border-white/5 hover:border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                                  task.done ? 'bg-purple-500 border-purple-400 text-white' : 'bg-neutral-900 border-white/10'
                                }`}>
                                  <Check className={`w-3 h-3 stroke-[3px] transition ${task.done ? 'scale-100' : 'scale-0'}`} />
                                </div>
                                
                                <div className="min-w-0">
                                  <span className={`text-[11px] font-semibold block truncate leading-snug ${task.done ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                                    {task.text}
                                  </span>
                                  <span className="text-[8px] text-neutral-500 font-mono block mt-0.5">
                                    {task.time} / {task.tag}
                                  </span>
                                </div>
                              </div>

                              <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase shrink-0 ${
                                task.priority === 'high' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/10' :
                                task.priority === 'medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/10' :
                                'bg-blue-500/15 text-blue-400 border border-blue-500/10'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive lower progress tracker */}
                        <div className="space-y-1 pt-1 border-t border-white/5">
                          <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                            <span>TOTAL COMPLETED QUOTIENT</span>
                            <span className="font-bold text-purple-400">{progressRatioPct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                              animate={{ width: `${progressRatioPct}%` }}
                              transition={{ type: 'spring', stiffness: 100 }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ACTIVE PROJECTS CARD (Colored icons, horizontal curves) */}
                      <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[8px] font-mono tracking-widest text-cyan-400 uppercase font-bold block">Active Portfolio Nodes</span>
                            <h3 className="text-xs font-bold text-white">Project Pipeline Calibration</h3>
                          </div>
                          <span className="text-[9px] font-mono text-neutral-500">5 Registered</span>
                        </div>

                        <div className="space-y-2.5">
                          {projectsList.slice(0, 3).map((p) => (
                            <div key={p.id} className="space-y-1 select-none">
                              <div className="flex justify-between items-center text-[10.5px]">
                                <span className="font-bold text-neutral-200">{p.name}</span>
                                <span className="font-mono text-neutral-400 font-bold">{p.progress}%</span>
                              </div>
                              <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${p.color} rounded-full`} style={{ width: `${p.progress}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* FOCUS TIME RECORD WITH MINI ANALYTICS BAR CHART */}
                      <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono text-blue-400 tracking-widest uppercase font-bold block">Telemetry Metrics</span>
                            <h4 className="text-xs font-bold text-white">Focus Time Calibration</h4>
                          </div>
                          <div className="text-[10px] text-emerald-400 font-bold font-mono px-1.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/10 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            +15.4% today
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-mono font-black text-white">2h 15m</span>
                          <span className="text-[9.5px] text-neutral-400">logged inside active room</span>
                        </div>

                        {/* Interactive analytic volume columns */}
                        <div className="flex items-end justify-between h-9 pt-1.5 gap-0.5">
                          {[30, 65, 40, 85, 110, 135, 75, 45, 95, 130, 80, 115, 150].map((val, i) => (
                            <div 
                              key={i} 
                              className="flex-grow bg-neutral-900 rounded-t-xs hover:bg-purple-500/50 transition duration-150"
                              style={{ height: `${(val / 150) * 100}%` }}
                              title={`${val} Focus Minutes`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* MOMENTUM STREAK CALENDAR CHART */}
                      <div className="p-4 rounded-2xl bg-[#09090f] border border-white/5 space-y-3.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[8.5px] font-mono tracking-widest text-[#f97316] uppercase font-bold block">Concentric Streaks</span>
                          <Flame className="h-[18px] w-[18px] text-orange-500 animate-pulse" />
                        </div>

                        <span className="text-base font-black text-white block">
                          16 days consecutively
                        </span>

                        <div className="grid grid-cols-7 gap-1">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                            const isStreak = idx < 5; // Simulates streak on M-F
                            return (
                              <div key={idx} className="flex flex-col items-center gap-1 p-1 bg-neutral-900/60 rounded-xl border border-white/5">
                                <span className="text-[7px] font-mono text-neutral-500 font-bold">{day}</span>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  isStreak ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-400 text-white' : 'bg-neutral-800 text-neutral-400'
                                }`}>
                                  {isStreak ? '✓' : ''}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* LARGE WEEKLY PROGRESS CHART */}
                      <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[8px] font-mono tracking-widest text-indigo-400 uppercase font-bold block mb-0.5">Chronology Specs</span>
                            <h3 className="text-xs font-bold text-white">Weekly Analytics</h3>
                          </div>

                          <div className="px-2 py-1 rounded-lg bg-neutral-900 border border-white/5 text-[9px] font-mono font-bold text-neutral-300 flex items-center gap-1 cursor-default">
                            <span>This Week</span>
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-end h-28 gap-3 px-1">
                            {[
                              { day: 'Mon', h: 65, color: 'from-purple-600 to-indigo-600' },
                              { day: 'Tue', h: 42, color: 'from-blue-600 to-indigo-500' },
                              { day: 'Wed', h: 80, color: 'from-purple-500 to-blue-500' },
                              { day: 'Thu', h: 55, color: 'from-purple-600 to-indigo-600' },
                              { day: 'Fri', h: 95, color: 'from-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]' },
                              { day: 'Sat', h: 30, color: 'from-blue-600 to-indigo-500' },
                              { day: 'Sun', h: 10, color: 'from-neutral-800 to-neutral-700' }
                            ].map((bar, idx) => (
                              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                <div 
                                  className={`w-full rounded-t-md bg-gradient-to-t ${bar.color} transition-all duration-500`}
                                  style={{ height: `${bar.h}%` }}
                                />
                                <span className="text-[8.5px] font-mono text-neutral-400 font-bold">{bar.day}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500 px-1 border-t border-white/5 pt-2">
                            <span>PEAK INTENSITY: FRI (4.2H)</span>
                            <span>WEEKLY RATIO: 62%</span>
                          </div>
                        </div>
                      </div>

                      {/* CLINICAL AI SMART SUGGESTION CARD */}
                      <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-950/20 to-indigo-950/20 border border-purple-500/25 relative overflow-hidden">
                        <div className="absolute top-[-10px] right-[-10px] w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 bg-purple-500/10 rounded-xl text-purple-400 shrink-0">
                            <Sparkles className="w-4 h-4 animate-pulse text-purple-300" />
                          </div>
                          <div>
                            <span className="text-[7.5px] font-mono uppercase tracking-widest text-purple-400 block mb-0.5">MoTrack AI Brain</span>
                            <h4 className="text-xs font-bold text-white leading-tight">You have a productive morning!</h4>
                            <p className="text-[10px] text-neutral-300 mt-1 leading-relaxed">
                              Sustain momentum by knocking off your “AI Course Platform review” before 12:00 PM. High likelihood of matching focus milestone record.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSuggestionModalOpen(true);
                            }}
                            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-[9.5px] shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition flex items-center gap-1 border border-purple-400/25 shrink-0"
                          >
                            View Suggestions
                            <ArrowUpRight className="w-3.5 h-3.5 animate-bounce" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* TAB 2: PROJECTS EXPULSION LIST */}
                  {activeTab === 'projects' && (
                    <motion.div
                      key="projects-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 text-left"
                    >
                      <div>
                        <span className="text-[8px] font-mono tracking-widest text-[#a855f7] uppercase font-bold block mb-0.5">Workspace Pipeline</span>
                        <h2 className="text-md font-black text-white">Active Milestone Repositories</h2>
                        <p className="text-[10px] text-neutral-400">Interact with continuous development status loops.</p>
                      </div>

                      <div className="space-y-3">
                        {projectsList.map((project) => (
                          <div 
                            key={project.id}
                            className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-3 relative overflow-hidden group hover:border-white/10 transition-all duration-200"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${project.color}`} />
                                <h3 className="text-xs font-black text-white group-hover:text-purple-300 transition duration-150">{project.name}</h3>
                              </div>
                              <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                                {project.progress}% Complete
                              </span>
                            </div>

                            {/* Double-layered horizontal Loader track */}
                            <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full bg-gradient-to-r ${project.color}`} style={{ width: `${project.progress}%` }} />
                            </div>

                            <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500">
                              <span>METRIC FACTOR: COMPLIANT</span>
                              <span>{project.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-xl border border-white/5 bg-neutral-950/40 text-[10px] text-neutral-400 flex gap-2">
                        <Info className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>All project milestones synchronize in the centralized MoTrack ledger and propagate to parent metrics instantly.</span>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: COMPLETE TODOLIST TRACKER (WITH LIVE ADDING FORM INSIDE MOBILE VIEW) */}
                  {activeTab === 'tasks' && (
                    <motion.div
                      key="tasks-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] font-mono tracking-widest text-emerald-400 uppercase font-bold block mb-0.5">Task Planner DB</span>
                          <h2 className="text-md font-black text-white">Sprint Checklist</h2>
                          <p className="text-[10px] text-neutral-400">Append recurring study loops dynamically below.</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                          {solvedCount} Resolved
                        </span>
                      </div>

                      {/* CALENDAR WEEKLY STRIP */}
                      <div className="grid grid-cols-7 gap-1 bg-neutral-900/40 p-1.5 rounded-xl border border-white/5">
                        {['18\nMon', '19\nTue', '20\nWed', '21\nThu', '22\nFri', '23\nSat', '24\nSun'].map((val, idx) => {
                          const [num, label] = val.split('\n');
                          const isToday = label === 'Fri';
                          return (
                            <div key={idx} className={`p-1.5 rounded-lg text-center transition flex flex-col items-center justify-center ${
                              isToday ? 'bg-purple-600 text-white' : 'hover:bg-white/5 text-neutral-400'
                            }`}>
                              <span className="text-[7px] font-mono font-bold block leading-none">{label}</span>
                              <span className="text-[10px] font-mono font-extrabold block mt-0.5 leading-none">{num}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* MICRO ADDING FORM INSIDE IPHONE SCREEN */}
                      <form onSubmit={handleCreateTask} className="p-3 rounded-2xl bg-[#09090f] border border-white/10 space-y-2 text-left">
                        <span className="text-[7.5px] uppercase font-mono tracking-wider text-purple-400 font-bold block">Quick Task Injector</span>
                        <input
                          type="text"
                          required
                          value={newMockTaskTitle}
                          onChange={(e) => setNewMockTaskTitle(e.target.value)}
                          placeholder="Configure task name..."
                          className="w-full bg-neutral-950 text-[10.5px] px-3 py-1.5 rounded-lg border border-white/5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={newTaskPriority}
                            onChange={(e: any) => setNewTaskPriority(e.target.value)}
                            className="bg-neutral-950 text-[9.5px] px-2 py-1 rounded-lg border border-white/5 text-white focus:outline-none"
                          >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                          </select>
                          <select
                            value={newTaskTag}
                            onChange={(e) => setNewTaskTag(e.target.value)}
                            className="bg-neutral-950 text-[9.5px] px-2 py-1 rounded-lg border border-white/5 text-white focus:outline-none"
                          >
                            <option value="Academics">Academics</option>
                            <option value="Coding">Coding</option>
                            <option value="Focus">Focus</option>
                            <option value="Design">Design</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-1.5 bg-gradient-to-tr from-purple-600 to-indigo-600 text-[9.5px] font-mono font-bold text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition cursor-pointer"
                        >
                          + Append Task Node
                        </button>
                      </form>

                      {/* ACTIVE CHECKS */}
                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <div 
                            key={task.id}
                            className={`p-2.5 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                              task.done 
                                ? 'bg-purple-950/5 border-purple-500/10 opacity-70' 
                                : 'bg-neutral-900/60 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div 
                              className="flex items-center gap-2.5 min-w-0 flex-grow"
                              onClick={() => handleToggleTask(task.id)}
                            >
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                                task.done ? 'bg-purple-500 border-purple-400 text-white' : 'bg-neutral-950 border-white/10'
                              }`}>
                                <Check className={`w-3 h-3 stroke-[3px] transition ${task.done ? 'scale-100' : 'scale-0'}`} />
                              </div>

                              <div className="min-w-0">
                                <span className={`text-[10.5px] font-bold block leading-tight ${task.done ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                                  {task.text}
                                </span>
                                <span className="text-[8px] text-neutral-500 font-mono mt-0.5 block">
                                  {task.time} / tag: {task.tag}
                                </span>
                              </div>
                            </div>

                            {/* Trash Icon to discard */}
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-neutral-500 hover:text-rose-400 p-1 rounded-md hover:bg-rose-500/10 transition ml-2 shrink-0 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: PROFILE INTEGRITY CALIBRATOR VIEW */}
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
                          alt="Mohamed avatar"
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/40"
                        />
                        <div>
                          <span className="text-[8px] font-mono text-purple-400 block uppercase font-bold">Academic Rank: Platinum</span>
                          <h3 className="text-xs font-black text-white leading-tight">Mohamed S.</h3>
                          <span className="text-[9px] text-[#1cbb50] font-mono block">Status: Online / Sync Active</span>
                        </div>
                      </div>

                      {/* Interactive range sliders representing metrics adjustment */}
                      <div className="space-y-3.5">
                        <span className="text-[8px] font-mono text-neutral-400 block uppercase font-bold tracking-wider">Calibration Variables</span>
                        
                        {/* Control 1 */}
                        <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 space-y-1">
                          <div className="flex justify-between items-center font-mono text-[9px] text-neutral-300">
                            <span>Study Intensity Ratio</span>
                            <span className="text-purple-400 font-bold">{studyIntensity}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="20" 
                            max="100" 
                            value={studyIntensity} 
                            onChange={(e) => setStudyIntensity(Number(e.target.value))}
                            className="w-full accent-purple-500 h-1 bg-neutral-950 rounded-lg cursor-pointer" 
                          />
                        </div>

                        {/* Control 2 */}
                        <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 space-y-1">
                          <div className="flex justify-between items-center font-mono text-[9px] text-neutral-300">
                            <span>Sustain Goal Limit (Mins)</span>
                            <span className="text-purple-400 font-bold">{sustainGoal}m</span>
                          </div>
                          <input 
                            type="range" 
                            min="60" 
                            max="300" 
                            step="15"
                            value={sustainGoal} 
                            onChange={(e) => setSustainGoal(Number(e.target.value))}
                            className="w-full accent-purple-500 h-1 bg-neutral-950 rounded-lg cursor-pointer" 
                          />
                        </div>
                      </div>

                      {/* Interactive Student Badges Showcase */}
                      <div className="space-y-2.5">
                        <span className="text-[8px] font-mono text-neutral-400 block uppercase font-bold tracking-wider">Acquired Micro-badges</span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-amber-500/10 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                            <div className="min-w-0">
                              <span className="text-[9.5px] font-bold text-white block truncate leading-none">Streaks Master</span>
                              <span className="text-[7px] text-neutral-500 block">Day counting loops</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-purple-500/10 flex items-center gap-2">
                            <Award className="w-4 h-4 text-purple-400 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[9.5px] font-bold text-white block truncate leading-none">System Builder</span>
                              <span className="text-[7px] text-neutral-500 block">SaaS layout compliance</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>

              </div>

              {/* iOS FLOATING RECTANGLE NAVIGATION DOCK (Center Lavender trigger button) */}
              <div className="absolute bottom-3 inset-x-3 h-14 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl z-30 flex items-center justify-around px-3 shadow-2xl">
                
                {/* Tab 1: Dashboard */}
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex flex-col items-center gap-0.5 transition-all text-center cursor-pointer ${
                    activeTab === 'dashboard' ? 'text-purple-400 font-bold scale-105' : 'text-neutral-400 hover:text-white/80'
                  }`}
                >
                  <Navigation className="h-[18px] w-[18px]" />
                  <span className="text-[8px] font-mono">Home</span>
                </button>

                {/* Tab 2: Projects */}
                <button 
                  onClick={() => setActiveTab('projects')}
                  className={`flex flex-col items-center gap-0.5 transition-all text-center cursor-pointer ${
                    activeTab === 'projects' ? 'text-purple-400 font-bold scale-105' : 'text-neutral-400 hover:text-white/80'
                  }`}
                >
                  <Layers className="h-[18px] w-[18px]" />
                  <span className="text-[8px] font-mono">Folders</span>
                </button>

                {/* Center glowing Lavender interactive prompt trigger */}
                <button 
                  onClick={() => {
                    // Push a new mock element inside phone tasks state dynamically
                    const titleText = 'Triggered system-wide sprint loop revision';
                    setTasks(prev => [
                      ...prev,
                      { id: Date.now(), text: titleText, priority: 'high', tag: 'Focus', time: '12:00 PM', done: false }
                    ]);
                    setActiveTab('tasks');
                  }}
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white border border-purple-400/30 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.5)] transform -translate-y-2 hover:scale-110 duration-200 active:scale-95"
                  title="Inject mock milestone task"
                >
                  <span className="text-xl font-bold font-sans">+</span>
                </button>

                {/* Tab 3: Tasks */}
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className={`flex flex-col items-center gap-0.5 transition-all text-center cursor-pointer ${
                    activeTab === 'tasks' ? 'text-purple-400 font-bold scale-105' : 'text-neutral-400 hover:text-white/80'
                  }`}
                >
                  <CheckSquare className="h-[18px] w-[18px]" />
                  <span className="text-[8px] font-mono">Checks</span>
                </button>

                {/* Tab 4: Profile Calibration */}
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex flex-col items-center gap-0.5 transition-all text-center cursor-pointer ${
                    activeTab === 'profile' ? 'text-purple-400 font-bold scale-105' : 'text-neutral-400 hover:text-white/80'
                  }`}
                >
                  <Sliders className="h-[18px] w-[18px]" />
                  <span className="text-[8px] font-mono">Tune</span>
                </button>

              </div>

              {/* iOS Home Indicator bottom strip */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-40" />

              {/* SIMULATED iOS SUGGESTION NOTIFICATION BANNER SHIM */}
              <AnimatePresence>
                {suggestionModalOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end"
                  >
                    <motion.div 
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                      className="w-full bg-[#0d0d15] border-t border-purple-500/20 rounded-t-3xl p-6 space-y-4 text-left shadow-2xl"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-mono font-bold text-purple-300">MoTrack CoPilot Insights</span>
                        </div>
                        <button 
                          onClick={() => setSuggestionModalOpen(false)}
                          className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-neutral-900/60 border border-white/5 rounded-xl space-y-1">
                          <span className="text-[7.5px] font-mono text-neutral-400 font-bold uppercase">ADAPTIVE STRATEGY ALPHA</span>
                          <p className="text-xs text-neutral-200">
                            <b>Sprint Calibration:</b> Run three 25-minute Pomodoro sprints in microtask analysis.
                          </p>
                        </div>

                        <div className="p-3 bg-neutral-900/60 border border-white/5 rounded-xl space-y-1">
                          <span className="text-[7.5px] font-mono text-neutral-400 font-bold uppercase">SOUNDSCAPE INTEGRATION</span>
                          <p className="text-xs text-neutral-200">
                            <b>Acoustic Frequency:</b> Inject 40Hz alpha wave focus patterns in the simulator to protect current streak bounds.
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSuggestionModalOpen(false)}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-purple-500/25 mt-2 cursor-pointer"
                      >
                        Apply Suggestion
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: REFINED DOCUMENTATION CARD LIST PANEL (col-span-12 or col-span-3 depending on layout) */}
        {/* We make this a highly detailed Spec list column (col-span-12 or 12 to 12 responsive) */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
          
          <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/40 backdrop-blur-xl relative overflow-hidden text-left shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <h4 className="text-xs font-mono font-bold text-purple-400 tracking-wider uppercase mb-2">
              APPLE-LEVEL HIG SPECIFICATION
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Mapped fully to physical iPhone dimensions, featuring side buttons, camera force control sliders, and narrower bezels conforming to iOS 18 layout presets.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/40 backdrop-blur-xl relative overflow-hidden text-left shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/0 rounded-full blur-2xl pointer-events-none" />
            <h4 className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase mb-2">
              STUDENT METRICS ENGINE
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Clicking checkboxes or appending lists inside this simulator triggers live hooks that recalibrate displays and recompute live Momentum Scores!
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-neutral-950/40 backdrop-blur-xl relative overflow-hidden text-left shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/0 rounded-full blur-2xl pointer-events-none" />
            <h4 className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase mb-2">
              AMBIENT LO-FI PIPELINE
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Expand the Dynamic Island at the top of the device screen to play soundscapes, which generate an animated audio wave.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
