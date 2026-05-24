import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Folder, CheckSquare, FileText, Calendar, Plus } from 'lucide-react';
import { mockDb } from '../lib/supabase';
import { GradientButton } from './Reusable';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

type TabType = 'project' | 'subtask' | 'note' | 'activity';

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onAdded }) => {
  const [activeTab, setActiveTab ] = useState<TabType>('project');
  const [projects, setProjects] = useState<any[]>([]);

  // Form states
  // Project form
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState('Development');
  const [projectPriority, setProjectPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [projectDeadline, setProjectDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [projectNotes, setProjectNotes] = useState('');

  // Subtask form
  const [subtaskProjectId, setSubtaskProjectId] = useState('');
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskDesc, setSubtaskDesc] = useState('');
  const [subtaskPriority, setSubtaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [subtaskDueDate, setSubtaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Note form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');
  const [noteTags, setNoteTags] = useState('');
  const [noteProjId, setNoteProjId] = useState('');

  // Activity form
  const [actTitle, setActTitle] = useState('');
  const [actType, setActType] = useState<'Study' | 'Project' | 'Exercise' | 'Reading' | 'Personal' | 'Other'>('Study');
  const [actDuration, setActDuration] = useState(45);
  const [actNotes, setActNotes] = useState('');

  // Load projects to associate subtasks and notes
  useEffect(() => {
    if (isOpen) {
      mockDb.getProjects().then(({ data }) => {
        if (data && data.length > 0) {
          setProjects(data);
          setSubtaskProjectId(data[0].id);
        }
      });
    }
  }, [isOpen]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    await mockDb.upsertProject({
      title: projectTitle,
      description: projectDesc,
      category: projectCategory,
      priority: projectPriority,
      status: 'In Progress',
      deadline: projectDeadline,
      notes: projectNotes
    });

    setProjectTitle('');
    setProjectDesc('');
    setProjectNotes('');
    onAdded();
    onClose();
  };

  const handleCreateSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskTitle.trim() || !subtaskProjectId) return;

    await mockDb.upsertSubtask({
      project_id: subtaskProjectId,
      title: subtaskTitle,
      description: subtaskDesc,
      priority: subtaskPriority,
      status: 'Not Started',
      due_date: subtaskDueDate,
      is_completed: false
    });

    setSubtaskTitle('');
    setSubtaskDesc('');
    onAdded();
    onClose();
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    await mockDb.upsertNote({
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      tags: noteTags.split(',').map(t => t.trim()).filter(Boolean),
      project_id: noteProjId || null,
      is_pinned: false
    });

    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setNoteProjId('');
    onAdded();
    onClose();
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    await mockDb.upsertDailyActivity({
      title: actTitle,
      type: actType,
      date: new Date().toISOString().split('T')[0],
      duration: Number(actDuration),
      notes: actNotes,
      status: 'Completed'
    });

    setActTitle('');
    setActNotes('');
    onAdded();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-pointer bg-[#02040c]/82 backdrop-blur-sm sm:backdrop-blur-md"
        />

        <motion.div
          initial={{ y: 36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 36, opacity: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="mobile-sheet relative z-50 flex w-full max-w-xl flex-col overflow-hidden border border-white/10 bg-[#070b16]/96 shadow-[0_24px_90px_-48px_rgba(139,92,246,0.8)] backdrop-blur-xl sm:relative sm:rounded-lg"
        >
          <div className="flex justify-center pt-3 sm:hidden">
            <span className="h-1.5 w-11 rounded-full bg-white/20" />
          </div>

          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-5 py-4 sm:px-6">
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-normal text-white">
                <Plus className="h-4 w-4 text-purple-300" />
                Create
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">Capture the next meaningful move.</p>
            </div>
            <button
              onClick={onClose}
              className="touch-target cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-white/5 bg-neutral-900/20 p-2 text-xs">
            <button
              onClick={() => setActiveTab('project')}
              className={`touch-target flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition ${
                activeTab === 'project'
                  ? 'bg-purple-500/15 font-semibold text-purple-200'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              Project
            </button>
            <button
              onClick={() => setActiveTab('subtask')}
              className={`touch-target flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition ${
                activeTab === 'subtask'
                  ? 'bg-purple-500/15 font-semibold text-purple-200'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Task
            </button>
            <button
              onClick={() => setActiveTab('note')}
              className={`touch-target flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition ${
                activeTab === 'note'
                  ? 'bg-purple-500/15 font-semibold text-purple-200'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Note
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`touch-target flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition ${
                activeTab === 'activity'
                  ? 'bg-purple-500/15 font-semibold text-purple-200'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Activity
            </button>
          </div>

          <div className="keyboard-safe-scroll max-h-[calc(92dvh-132px)] overflow-y-auto px-5 py-5 text-sm sm:max-h-[70vh] sm:px-6">
            {activeTab === 'project' && (
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="form-label">Project *</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={e => setProjectTitle(e.target.value)}
                    placeholder="Build the MoTrack mobile flow"
                    className="field-control"
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    value={projectDesc}
                    onChange={e => setProjectDesc(e.target.value)}
                    placeholder="Summarize the outcome and why it matters."
                    className="field-control resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      value={projectCategory}
                      onChange={e => setProjectCategory(e.target.value)}
                      placeholder="e.g. Development, Academics"
                      className="field-control"
                    />
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <select
                      value={projectPriority}
                      onChange={e => setProjectPriority(e.target.value as any)}
                      className="field-control cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      value={projectDeadline}
                      onChange={e => setProjectDeadline(e.target.value)}
                      className="field-control block"
                    />
                  </div>
                  <div className="flex items-end">
                    <span className="text-[10px] text-neutral-400 leading-relaxed mb-1">
                      New projects start as <span className="text-purple-300 font-semibold">In Progress</span>.
                    </span>
                  </div>
                </div>
                <div>
                  <label className="form-label">Notes</label>
                  <input
                    type="text"
                    value={projectNotes}
                    onChange={e => setProjectNotes(e.target.value)}
                    placeholder="Frameworks, references, constraints..."
                    className="field-control"
                  />
                </div>
                <div className="modal-actions flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="touch-target rounded-lg px-4 py-2 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </button>
                  <GradientButton type="submit">Create Project</GradientButton>
                </div>
              </form>
            )}

            {activeTab === 'subtask' && (
              <form onSubmit={handleCreateSubtask} className="space-y-4">
                {projects.length === 0 ? (
                  <div className="text-center py-6 text-neutral-400">
                    <p className="mb-2">No active projects yet.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('project')}
                      className="text-purple-400 underline"
                    >
                      Create a project first
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="form-label">Project *</label>
                      <select
                        value={subtaskProjectId}
                        onChange={e => setSubtaskProjectId(e.target.value)}
                        className="field-control cursor-pointer"
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.category})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Task *</label>
                      <input
                        type="text"
                        required
                        value={subtaskTitle}
                        onChange={e => setSubtaskTitle(e.target.value)}
                      placeholder="Build the API route proxy"
                        className="field-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        value={subtaskDesc}
                        onChange={e => setSubtaskDesc(e.target.value)}
                      placeholder="Key detail or deliverable."
                        className="field-control"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      <div>
                        <label className="form-label">Priority</label>
                        <select
                          value={subtaskPriority}
                          onChange={e => setSubtaskPriority(e.target.value as any)}
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
                          value={subtaskDueDate}
                          onChange={e => setSubtaskDueDate(e.target.value)}
                          className="field-control block"
                        />
                      </div>
                    </div>
                    <div className="modal-actions flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="touch-target rounded-lg px-4 py-2 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
                      >
                        Cancel
                      </button>
                      <GradientButton type="submit">Add Task</GradientButton>
                    </div>
                  </>
                )}
              </form>
            )}

            {activeTab === 'note' && (
              <form onSubmit={handleCreateNote} className="space-y-4">
                <div>
                  <label className="form-label">Note *</label>
                  <input
                    type="text"
                    required
                    value={noteTitle}
                    onChange={e => setNoteTitle(e.target.value)}
                      placeholder="Deep learning notes"
                    className="field-control"
                  />
                </div>
                <div>
                  <label className="form-label">Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    placeholder="Write notes, lists, links, or code snippets."
                    className="field-control resize-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      value={noteCategory}
                      onChange={e => setNoteCategory(e.target.value)}
                      placeholder="e.g. Design, Research, General"
                      className="field-control"
                    />
                  </div>
                  <div>
                    <label className="form-label">Project</label>
                    <select
                      value={noteProjId}
                      onChange={e => setNoteProjId(e.target.value)}
                      className="field-control cursor-pointer"
                    >
                      <option value="">None</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    value={noteTags}
                    onChange={e => setNoteTags(e.target.value)}
                    placeholder="design, math, cs301"
                    className="field-control"
                  />
                </div>
                <div className="modal-actions flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="touch-target rounded-lg px-4 py-2 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </button>
                  <GradientButton type="submit">Save Note</GradientButton>
                </div>
              </form>
            )}

            {activeTab === 'activity' && (
              <form onSubmit={handleCreateActivity} className="space-y-4">
                <div>
                  <label className="form-label">Activity *</label>
                  <input
                    type="text"
                    required
                    value={actTitle}
                    onChange={e => setActTitle(e.target.value)}
                    placeholder="Review algorithms problem set"
                    className="field-control"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="form-label">Type</label>
                    <select
                      value={actType}
                      onChange={e => setActType(e.target.value as any)}
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
                  <div>
                    <label className="form-label">Duration</label>
                    <input
                      type="number"
                      min={5}
                      max={480}
                      value={actDuration}
                      onChange={e => setActDuration(Number(e.target.value))}
                      className="field-control"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Notes</label>
                  <input
                    type="text"
                    value={actNotes}
                    onChange={e => setActNotes(e.target.value)}
                    placeholder="Finished problem 2 and reviewed formulas."
                    className="field-control"
                  />
                </div>
                <div className="modal-actions flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="touch-target rounded-lg px-4 py-2 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </button>
                  <GradientButton type="submit">Log Activity</GradientButton>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
