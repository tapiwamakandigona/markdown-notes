import { useState, useMemo, useEffect } from 'react';
import './App.css';

interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  updatedAt: number;
  createdAt: number;
  pinned: boolean;
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\n/g, '<br>');
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('md-notes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore corrupted localStorage data — start fresh
    }
    return [{
      id: '1', title: 'Welcome', content: '# Welcome to Markdown Notes\n\nStart writing **bold**, *italic*, and `code`.\n\n- Create folders\n- Pin important notes\n- Search across everything\n\n> All data stored locally.',
      folder: 'Getting Started', updatedAt: Date.now(), createdAt: Date.now(), pinned: true
    }];
  });
  const [activeId, setActiveId] = useState<string>(notes[0]?.id || '');
  const [search, setSearch] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('md-notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeId);

  const folders = useMemo(() => {
    const set = new Set(notes.map(n => n.folder));
    return Array.from(set).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let result = notes;
    if (activeFolder) result = result.filter(n => n.folder === activeFolder);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    return result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, activeFolder, search]);

  const createNote = () => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled',
      content: '',
      folder: activeFolder || 'General',
      updatedAt: Date.now(),
      createdAt: Date.now(),
      pinned: false,
    };
    setNotes(prev => [note, ...prev]);
    setActiveId(note.id);
  };

  const updateNote = (field: keyof Note, value: string | boolean) => {
    setNotes(prev => prev.map(n =>
      n.id === activeId ? { ...n, [field]: value, updatedAt: Date.now() } : n
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const remaining = prev.filter(n => n.id !== id);
      if (activeId === id) {
        setActiveId(remaining[0]?.id || '');
      }
      return remaining;
    });
  };

  const wordCount = activeNote ? activeNote.content.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="notes-app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Notes</h1>
          <button className="new-btn" onClick={createNote}>+</button>
        </div>
        <input className="search" placeholder="Search notes..." value={search}
          onChange={e => setSearch(e.target.value)} />
        <div className="folders">
          <button className={!activeFolder ? 'active' : ''} onClick={() => setActiveFolder(null)}>
            All ({notes.length})
          </button>
          {folders.map(f => (
            <button key={f} className={activeFolder === f ? 'active' : ''}
              onClick={() => setActiveFolder(f)}>
              {f} ({notes.filter(n => n.folder === f).length})
            </button>
          ))}
        </div>
        <div className="note-list">
          {filteredNotes.map(n => (
            <div key={n.id} className={`note-item ${n.id === activeId ? 'active' : ''}`}
              onClick={() => setActiveId(n.id)}>
              <div className="note-item-header">
                {n.pinned && <span className="pin">📌</span>}
                <span className="note-title">{n.title || 'Untitled'}</span>
              </div>
              <span className="note-date">{new Date(n.updatedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className="editor-area">
        {activeNote ? (
          <>
            <div className="editor-toolbar">
              <input className="title-input" value={activeNote.title}
                onChange={e => updateNote('title', e.target.value)} placeholder="Note title" />
              <div className="toolbar-actions">
                <select value={activeNote.folder} onChange={e => updateNote('folder', e.target.value)}>
                  {folders.map(f => <option key={f}>{f}</option>)}
                  <option value="General">General</option>
                </select>
                <button onClick={() => updateNote('pinned', !activeNote.pinned)}>
                  {activeNote.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? 'Edit Only' : 'Preview'}
                </button>
                <button className="delete-btn" onClick={() => deleteNote(activeNote.id)}>Delete</button>
              </div>
            </div>
            <div className={`editor-content ${showPreview ? 'split' : ''}`}>
              <textarea className="editor"
                value={activeNote.content}
                onChange={e => updateNote('content', e.target.value)}
                placeholder="Start writing in Markdown..." />
              {showPreview && (
                <div className="preview" dangerouslySetInnerHTML={{ __html: markdownToHtml(activeNote.content) }} />
              )}
            </div>
            <div className="status-bar">
              <span>{wordCount} words</span>
              <span>{activeNote.content.length} chars</span>
              <span>Last edited: {new Date(activeNote.updatedAt).toLocaleString()}</span>
            </div>
          </>
        ) : (
          <div className="empty-editor">Select a note or create a new one</div>
        )}
      </main>
    </div>
  );
}
