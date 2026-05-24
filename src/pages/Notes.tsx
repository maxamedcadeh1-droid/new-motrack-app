import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  StickyNote,
  Pin,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import { mockDb } from '../lib/supabase';
import { EmptyState, LoadingState, GradientButton, PageHeader } from '../components/Reusable';

export const Notes: React.FC = () => {
  const [notesList, setNotesList] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active reading / editing select note index
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Search/Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState('All');

  // Input states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Research');
  const [noteTags, setNoteTags] = useState('');
  const [noteProjId, setNoteProjId] = useState('');

  const loadData = async () => {
    try {
      const { data: nts } = await mockDb.getNotes();
      const { data: projs } = await mockDb.getProjects();
      setNotesList(nts || []);
      setProjects(projs || []);

      if (nts && nts.length > 0 && !selectedNoteId) {
        setSelectedNoteId(nts[0].id);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
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

  const handleCreateOrUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const payload = {
      id: isEditing ? selectedNoteId : undefined,
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      tags: noteTags.split(',').map(t => t.trim()).filter(Boolean),
      project_id: noteProjId || null
    };

    const { data } = await mockDb.upsertNote(payload);
    if (data) {
      setSelectedNoteId(data.id);
    }

    // Reset creator block
    if (!isEditing) {
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
      setNoteProjId('');
    }
    setIsEditing(false);
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Delete this note? This action is permanent.')) {
      await mockDb.deleteNote(id);
      setSelectedNoteId(null);
    }
  };

  const handleTogglePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await mockDb.togglePinNote(id);
  };

  const handleStartEditing = (note: any) => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setNoteTags(note.tags.join(', '));
    setNoteProjId(note.project_id || '');
    setIsEditing(true);
  };

  const handleStartCreating = () => {
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('Study');
    setNoteTags('');
    setNoteProjId('');
    setIsEditing(false);
    setSelectedNoteId(null);
  };

  if (loading) {
    return <LoadingState message="Preparing your notes..." />;
  }

  // Categories extracted dynamically from database list
  const categories = ['All', ...Array.from(new Set(notesList.map(n => n.category))).filter(Boolean)];

  // Apply filters in order
  const filteredNotes = notesList.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
                          note.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesProj = selectedProjectId === 'All' || note.project_id === selectedProjectId;
    return matchesSearch && matchesCat && matchesProj;
  });

  // Sort: pinned first, then chronological descending
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const activeNote = notesList.find(n => n.id === selectedNoteId);

  // Tiny custom Markdown rendering parser to cleanly show markdown on the sidebar
  const renderMarkdown = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-md font-bold font-sans text-white mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={i} className="text-lg font-bold font-sans text-purple-400 mt-5 mb-3">{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="ml-4 list-disc text-neutral-300 my-1 leading-relaxed">{line.substring(2)}</li>;
      }
      if (line.startsWith('```')) {
        if (line === '```' || line.startsWith('```sql') || line.startsWith('```js')) {
          return null; // code tags ignore line
        }
        return null;
      }
      // Inline highlights or code formatting patterns
      if (line.includes('`')) {
        const parts = line.split('`');
        return (
          <p key={i} className="text-xs text-neutral-300 leading-relaxed my-2.5 font-sans">
            {parts.map((p, idx) => idx % 2 === 1 ? <code key={idx} className="bg-neutral-900 border border-white/10 text-purple-300 font-mono px-1 rounded text-[11px] font-semibold">{p}</code> : p)}
          </p>
        );
      }
      return <p key={i} className="text-neutral-300 leading-relaxed text-xs my-2.5 font-sans">{line}</p>;
    });
  };

  return (
    <div className="page-shell flex min-h-0 flex-col font-sans text-xs">
      
      <PageHeader
        icon={StickyNote}
        title="Notes"
        description="Capture useful thinking before it disappears: notes, references, ideas, and reflections."
        className="border-b border-white/5 pb-4"
        action={
          <GradientButton
            onClick={handleStartCreating}
            className="w-full px-4 py-2 text-sm sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            New Note
          </GradientButton>
        }
      />

      {/* Primary Split Screen Layout */}
      <div className="grid min-h-0 grid-cols-1 gap-4 lg:min-h-[calc(100dvh-13rem)] lg:grid-cols-12 lg:gap-6">
        
        {/* Left pane: search filters list */}
        <div className="glass-panel flex max-h-[42dvh] min-h-[320px] flex-col overflow-hidden rounded-lg p-4 lg:col-span-4 lg:max-h-none lg:min-h-0">
          
          {/* Search container */}
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2">
            <Search className="w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search notes"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="min-h-0 w-full border-none bg-transparent text-sm text-white focus:outline-none"
            />
          </div>

          {/* Categorized filter selection bar */}
          <div className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto py-1 font-sans text-[11px]">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`touch-target shrink-0 cursor-pointer rounded-lg px-3 py-1.5 transition ${
                  selectedCategory === cat
                    ? 'bg-purple-500/15 border border-purple-500/25 text-purple-300 font-bold'
                    : 'text-neutral-400 bg-neutral-900 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable list elements */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 text-left">
            {sortedNotes.length === 0 ? (
              <p className="text-center text-xs text-neutral-500 py-12">No notes match this view.</p>
            ) : (
              sortedNotes.map(n => {
                const isSelected = n.id === selectedNoteId;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedNoteId(n.id);
                      setIsEditing(false);
                    }}
                    className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative group ${
                      isSelected
                        ? 'bg-purple-600/10 border-purple-500/30'
                        : 'bg-neutral-900/40 hover:bg-neutral-900/80 border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] text-purple-400 font-mono font-semibold uppercase block mb-1">
                        {n.category}
                      </span>
                      <button
                        onClick={(e) => handleTogglePin(n.id, e)}
                        className={`transition hover:scale-110 p-1 border-none bg-transparent cursor-pointer ${
                          n.is_pinned ? 'text-amber-400' : 'text-neutral-600 group-hover:text-neutral-400'
                        }`}
                        title={n.is_pinned ? 'Unpin sheet' : 'Pin sheet'}
                      >
                        <Pin className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <h3 className={`text-[12px] font-bold tracking-tight leading-snug group-hover:text-purple-300 transition duration-200 ${
                      isSelected ? 'text-white' : 'text-neutral-200'
                    }`}>
                      {n.title}
                    </h3>
                    <p className="text-[10px] text-neutral-400 line-clamp-2 mt-1.5 leading-normal">
                      {n.content}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-white/5">
                      {n.tags?.map((t: string) => (
                        <span key={t} className="text-[9px] font-mono font-medium text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right pane: reading sheet or rich form creation screen */}
        <div className="glass-panel flex min-h-[430px] flex-col overflow-hidden rounded-lg p-4 sm:p-6 lg:col-span-8 lg:min-h-0">
          
          {/* Note content sheet */}
          {selectedNoteId || isEditing ? (
            <div className="flex flex-col h-full min-h-0 space-y-4">
              
              {/* If editing or creating */}
              {isEditing || !selectedNoteId ? (
                <form onSubmit={handleCreateOrUpdateNote} className="flex-1 flex flex-col space-y-4 min-h-0 text-left font-sans text-xs">
                  <div className="flex flex-col gap-3 border-b border-white/5 pb-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-md font-bold text-white">
                      {isEditing ? 'Edit Note' : 'New Note'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          if (!selectedNoteId && notesList.length > 0) {
                            setSelectedNoteId(notesList[0].id);
                          }
                        }}
                        className="touch-target rounded-lg border border-white/5 bg-neutral-900 px-3.5 py-1.5 text-sm text-neutral-400 transition hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <GradientButton type="submit">
                        Save Note
                      </GradientButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        required
                        value={noteTitle}
                        onChange={e => setNoteTitle(e.target.value)}
                        placeholder="e.g. EECS 301 sequence logic formulas"
                        className="field-control"
                      />
                    </div>
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
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label className="form-label">Tags</label>
                      <input
                        type="text"
                        value={noteTags}
                        onChange={e => setNoteTags(e.target.value)}
                        placeholder="e.g. transformer, math, cs301"
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
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0">
                    <label className="form-label">Content *</label>
                    <textarea
                      required
                      value={noteContent}
                      onChange={e => setNoteContent(e.target.value)}
                      placeholder="Use headings, lists, and code snippets."
                      className="field-control min-h-[220px] flex-1 resize-none border-white/10 bg-neutral-950 px-4 py-3.5 font-mono leading-relaxed"
                    />
                  </div>
                </form>
              ) : (
                /* Static Detailed View Mode */
                <div className="flex-1 flex flex-col min-h-0 text-left">
                  <div className="flex flex-col justify-between gap-4 border-b border-white/5 pb-4 shrink-0 sm:flex-row sm:items-start">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider font-semibold text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded">
                        {activeNote.category}
                      </span>
                      <h2 className="text-xl font-bold font-sans text-white mt-2 leading-tight">
                        {activeNote.title}
                      </h2>
                      <span className="text-[10px] font-mono text-neutral-500 block mt-1">
                        Created: {new Date(activeNote.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEditing(activeNote)}
                        className="touch-target rounded-lg border border-white/5 bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-neutral-400 transition hover:border-purple-500/10 hover:text-white cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(activeNote.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-rose-500/10 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Rendered Markdown Body scroll section */}
                  <div className="flex-grow overflow-y-auto pr-1 my-4 min-h-0 text-neutral-300 font-sans leading-relaxed text-xs">
                    {renderMarkdown(activeNote.content)}
                  </div>
                  
                  {/* Foot tags elements */}
                  {activeNote.tags && activeNote.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap border-t border-white/5 pt-4 shrink-0">
                      {activeNote.tags.map((t: string) => (
                        <span key={t} className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-white/5 px-2 py-1 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <EmptyState
                title="No Note Selected"
                description="Select a note from the list or create a fresh one."
                icon={StickyNote}
                actionLabel="New Note"
                onAction={handleStartCreating}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
