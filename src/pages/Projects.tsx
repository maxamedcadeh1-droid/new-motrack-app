import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  FolderKanban,
  CheckCircle,
  Trash2,
  Calendar,
  ChevronLeft,
  Plus,
  StickyNote,
  ArrowRight
} from 'lucide-react';
import { mockDb } from '../lib/supabase';
import { GlassCard, GlowCard, EmptyState, LoadingState, GradientButton, PageHeader, ProgressBar, StatusBadge } from '../components/Reusable';

export const Projects: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // Shared states
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [subtasks, setSubtasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjCat, setNewProjCat] = useState('Development');
  const [newProjPriority, setNewProjPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newProjDeadline, setNewProjDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [newProjNotes, setNewProjNotes] = useState('');

  // Subtask inside detail form
  const [newSubTitle, setNewSubTitle] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubPriority, setNewSubPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newSubDueDate, setNewSubDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Loading sequence
  const loadData = async () => {
    try {
      const { data: projs } = await mockDb.getProjects();
      setProjectsList(projs || []);

      if (id) {
        const { data: proj, error } = await mockDb.getProject(id);
        if (proj) {
          setSelectedProject(proj);
          const { data: subs } = await mockDb.getSubtasks(id);
          setSubtasks(subs || []);
        } else {
          // Fallback if not found
          navigate('/projects');
        }
      }
    } catch (err) {
      console.error('Error fetching project data:', err);
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
  }, [id, navigate]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    await mockDb.upsertProject({
      title: newProjTitle,
      description: newProjDesc,
      category: newProjCat,
      priority: newProjPriority,
      status: 'In Progress',
      deadline: newProjDeadline,
      notes: newProjNotes
    });

    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjNotes('');
    setIsCreatingProject(false);
  };

  const handleDeleteProject = async (projId: string) => {
    if (confirm('Delete this project? This action cannot be reversed.')) {
      setLoading(true);
      await mockDb.deleteProject(projId);
      navigate('/projects');
    }
  };

  const handleCreateSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTitle.trim() || !id) return;

    await mockDb.upsertSubtask({
      project_id: id,
      title: newSubTitle,
      description: newSubDesc,
      priority: newSubPriority,
      status: 'Not Started',
      due_date: newSubDueDate,
      is_completed: false
    });

    setNewSubTitle('');
    setNewSubDesc('');
    // State listener auto-updates
  };

  const handleToggleSubtask = async (subId: string) => {
    await mockDb.toggleSubtask(subId);
  };

  const handleDeleteSubtask = async (subId: string) => {
    await mockDb.deleteSubtask(subId);
  };

  if (loading) {
    return <LoadingState message="Preparing your projects..." />;
  }

  // RENDERING DETAIL VIEW FOR /projects/:id
  if (id && selectedProject) {
    const completedSubs = subtasks.filter(s => s.is_completed).length;
    const progressPercent = selectedProject.progress;

    return (
      <div className="page-shell-narrow">
        {/* Back Link Header */}
        <div>
          <button
            onClick={() => navigate('/projects')}
            className="touch-target flex items-center gap-2 rounded-lg border-none bg-transparent px-1 text-sm font-sans text-neutral-400 transition hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 transition group-hover:-translate-x-0.5" />
            Back to projects
          </button>
        </div>

        {/* Project Header block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Info */}
          <GlassCard className="lg:col-span-8 p-6" hoverScale={false}>
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge tone="purple">{selectedProject.category}</StatusBadge>
                  <StatusBadge tone={selectedProject.priority === 'High' ? 'rose' : selectedProject.priority === 'Medium' ? 'amber' : 'neutral'}>
                    {selectedProject.priority} Priority
                  </StatusBadge>
                </div>
                <h1 className="font-display text-2xl font-semibold leading-tight tracking-normal text-white md:text-3xl">
                  {selectedProject.title}
                </h1>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {selectedProject.description || 'No description yet.'}
                </p>
              </div>

              <button
                onClick={() => handleDeleteProject(selectedProject.id)}
                className="p-2 border border-white/5 bg-neutral-900/40 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Progress indicators */}
            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-sans">Momentum</span>
                <span className="font-mono font-bold text-white text-sm">{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} color="blue" className="h-2.5" />
              <div className="flex justify-between items-center text-[10px] text-neutral-400 font-sans pt-2">
                <span>{completedSubs} of {subtasks.length} tasks complete</span>
                {selectedProject.deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Deadline: {selectedProject.deadline}
                  </span>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Quick Technical specifications display side element */}
          <GlassCard className="lg:col-span-4 p-6" hoverScale={false}>
            <div className="flex items-center gap-2 mb-3">
              <StickyNote className="w-4 h-4 text-purple-400" />
              <h3 className="section-kicker">Project notes</h3>
            </div>
            {selectedProject.notes ? (
              <div className="p-3 bg-neutral-900/40 border border-white/5 rounded-xl font-mono text-[10px] text-neutral-300 min-h-[140px] leading-relaxed whitespace-pre-wrap">
                {selectedProject.notes}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-500 italic py-6">No project notes yet.</p>
            )}
          </GlassCard>
        </div>

        {/* Tasks Checklist Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subtasks listing */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="section-kicker px-1">Task checklist</h2>

            {subtasks.length === 0 ? (
              <EmptyState
                title="No tasks yet."
                description="Break this project into small, satisfying next moves."
                icon={CheckCircle}
              />
            ) : (
              <div className="space-y-3">
                {subtasks.map(s => (
                  <div
                    key={s.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition duration-200 ${
                      s.is_completed
                        ? 'bg-neutral-900/10 border-white/5 opacity-55'
                        : 'bg-neutral-900/40 hover:bg-neutral-900/70 border-white/10'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleSubtask(s.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 cursor-pointer ${
                        s.is_completed
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'border-white/20 hover:border-purple-400 hover:bg-purple-500/10'
                      }`}
                    >
                      {s.is_completed && <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[12px] font-semibold block leading-tight ${s.is_completed ? 'line-through text-neutral-500' : 'text-white'}`}>
                          {s.title}
                        </span>
                        <button
                          onClick={() => handleDeleteSubtask(s.id)}
                          className="p-1 hover:text-white text-neutral-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-snug mt-1">{s.description || 'No description yet.'}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          s.priority === 'High' ? 'bg-rose-500/10 text-rose-300' :
                          s.priority === 'Medium' ? 'bg-amber-500/10 text-amber-300' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {s.priority} Priority
                        </span>
                        {s.due_date && (
                          <span className="text-[9px] font-mono text-neutral-400">Due: {s.due_date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New subtask creator block */}
          <GlassCard className="lg:col-span-5 p-6 h-fit" hoverScale={false}>
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-purple-400" />
              <h3 className="section-kicker">Add task</h3>
            </div>

            <form onSubmit={handleCreateSubtask} className="space-y-4 font-sans text-xs">
              <div>
                <label className="form-label">Task *</label>
                <input
                  type="text"
                  required
                  value={newSubTitle}
                  onChange={e => setNewSubTitle(e.target.value)}
                  placeholder="Write the integration hook"
                  className="field-control"
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  value={newSubDesc}
                  onChange={e => setNewSubDesc(e.target.value)}
                  placeholder="Key detail or expected outcome"
                  className="field-control resize-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={newSubPriority}
                    onChange={e => setNewSubPriority(e.target.value as any)}
                    className="field-control cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Due date</label>
                  <input
                    type="date"
                    value={newSubDueDate}
                    onChange={e => setNewSubDueDate(e.target.value)}
                    className="field-control block"
                  />
                </div>
              </div>
              <div className="pt-2">
                <GradientButton type="submit" className="w-full">
                  Add Task
                </GradientButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    );
  }

  // RENDERING COMPREHENSIVE PROJECTS LIST VIEW 
  return (
    <div className="page-shell">
      <PageHeader
        icon={FolderKanban}
        title="Projects"
        description="Organize coursework, product builds, and study plans into clear momentum."
        action={
          <GradientButton
            onClick={() => setIsCreatingProject(!isCreatingProject)}
            variant={isCreatingProject ? 'ghost' : 'purple'}
            className="w-full px-4 py-2 text-sm sm:w-auto"
          >
            {isCreatingProject ? 'Cancel' : 'New Project'}
          </GradientButton>
        }
      />

      {/* Project Creator Form block */}
      {isCreatingProject && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <GlassCard className="p-6 border-purple-500/15" hoverScale={false}>
            <div className="mb-4">
              <h3 className="text-md font-semibold text-white">Create a project</h3>
              <p className="text-[11px] text-neutral-400">Give the work a name, a purpose, and a clear next deadline.</p>
            </div>
            
            <form onSubmit={handleCreateProject} className="space-y-4 font-sans text-xs text-left">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="form-label">Project *</label>
                  <input
                    type="text"
                    required
                    value={newProjTitle}
                    onChange={e => setNewProjTitle(e.target.value)}
                    placeholder="CSE 404 research build"
                    className="field-control"
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={newProjCat}
                    onChange={e => setNewProjCat(e.target.value)}
                    placeholder="Research, academics, product"
                    className="field-control"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={newProjDesc}
                  onChange={e => setNewProjDesc(e.target.value)}
                  placeholder="Outline the objective and scope."
                  className="field-control"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={newProjPriority}
                    onChange={e => setNewProjPriority(e.target.value as any)}
                    className="field-control cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    value={newProjDeadline}
                    onChange={e => setNewProjDeadline(e.target.value)}
                    className="field-control block"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Notes</label>
                <textarea
                  rows={2}
                  value={newProjNotes}
                  onChange={e => setNewProjNotes(e.target.value)}
                  placeholder="Libraries, references, grading details..."
                  className="field-control resize-none font-mono"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="touch-target rounded-lg px-4 py-2 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <GradientButton type="submit">Create Project</GradientButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {/* Project cards */}
      {projectsList.length === 0 ? (
        <EmptyState
          title="No projects yet."
          description="Create a project to turn scattered work into visible progress."
          icon={FolderKanban}
          actionLabel="Create Project"
          onAction={() => setIsCreatingProject(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projectsList.map(p => (
            <Link to={`/projects/${p.id}`} key={p.id}>
              <GlowCard glowColor={p.priority === 'High' ? 'purple' : 'blue'} className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <StatusBadge tone="purple">{p.category}</StatusBadge>
                    </div>
                    <StatusBadge tone={p.priority === 'High' ? 'rose' : p.priority === 'Medium' ? 'amber' : 'neutral'}>
                      {p.priority}
                    </StatusBadge>
                  </div>

                  <h3 className="text-md font-bold font-sans text-white leading-snug hover:text-purple-300 transition duration-200">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 leading-normal mt-2 line-clamp-2">
                    {p.description || 'No objective yet.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-neutral-400 font-sans">Progress</span>
                    <span className="font-mono font-bold text-white">{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} className="h-1.5" />
                  <div className="flex justify-between items-center text-[9px] text-neutral-500 font-sans">
                    <span>Deadline: {p.deadline || 'None'}</span>
                    <span className="text-purple-400 flex items-center gap-1 font-semibold group-hover:underline">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </GlowCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
