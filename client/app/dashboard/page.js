'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute';

const STATUS = {
  active:    { label: 'Active',    dot: '#16A34A' },
  completed: { label: 'Completed', dot: '#8A8A8A' },
  'on-hold': { label: 'On Hold',   dot: '#D97706' },
};

// ── 3-dot menu ──────────────────────────────────────────────────────────────
function RowMenu({ project, onEdit, onDelete, visible }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleOpen = (e) => {
    e.stopPropagation();
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.right - 144 });
    setOpen(v => !v);
  };

  return (
    <div onClick={e => e.stopPropagation()}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-1.5 rounded transition-all"
        style={{
          color: open ? '#1C1C1C' : '#8A8A8A',
          background: open ? '#F0EEE9' : 'transparent',
          opacity: visible || open ? 1 : 0,
          pointerEvents: visible || open ? 'auto' : 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#F0EEE9'; e.currentTarget.style.color = '#1C1C1C'; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8A8A8A'; } }}
        title="Options"
      >
        <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5"  r="1.5"/>
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>

      {open && typeof window !== 'undefined' && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            zIndex: 9999,
            width: '144px',
            background: '#FFFFFF',
            border: '1px solid #E5E3DE',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '4px 0',
          }}
        >
          <button
            onClick={() => { setOpen(false); onEdit(project); }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors"
            style={{ color: '#1C1C1C' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F5F4F0'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(project._id); }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors"
            style={{ color: '#B91C1C' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Edit modal ───────────────────────────────────────────────────────────────
function EditModal({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    title:      project.title,
    clientName: project.clientName,
    status:     project.status,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/projects/${project._id}`, form);
      onSave();
      onClose();
    } catch {
      /* swallow */
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { background: '#F5F4F0', border: '1px solid #E5E3DE', color: '#1C1C1C' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5E3DE' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold" style={{ color: '#1C1C1C', letterSpacing: '-0.01em' }}>
            Edit project
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-lg transition-colors"
            style={{ color: '#8A8A8A' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F0EEE9'; e.currentTarget.style.color = '#1C1C1C'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8A8A8A'; }}
          >×</button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {[
            { key: 'title',      label: 'Project title', type: 'text', placeholder: 'e.g. Landing page redesign' },
            { key: 'clientName', label: 'Client',        type: 'text', placeholder: 'e.g. Acme Corp' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A8A8A' }}>
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
                style={inputStyle}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#1C1C1C'}
                onBlur={e => e.target.style.borderColor = '#E5E3DE'}
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A8A8A' }}>Status</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle}
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#1C1C1C'}
              onBlur={e => e.target.style.borderColor = '#E5E3DE'}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#F0EEE9', color: '#1C1C1C', border: '1px solid #E5E3DE' }}
              onMouseEnter={e => e.currentTarget.style.background = '#E5E3DE'}
              onMouseLeave={e => e.currentTarget.style.background = '#F0EEE9'}
            >Cancel</button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: '#1C1C1C', opacity: saving ? 0.6 : 1 }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#333333'; }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#1C1C1C'; }}
            >{saving ? 'Saving...' : 'Save changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({ title: '', clientName: '', status: 'active' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', form);
      setForm({ title: '', clientName: '', status: 'active' });
      setShowCreate(false);
      fetchProjects();
    } catch {
      setError('Failed to create project');
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch {
      setError('Failed to delete');
    }
  };

  const tabs = [
    { key: 'all',       label: 'All' },
    { key: 'active',    label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'on-hold',   label: 'On Hold' },
  ];

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  const inputStyle = { background: '#F5F4F0', border: '1px solid #E5E3DE', color: '#1C1C1C' };

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F4F0' }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Page header */}
        <div className="px-10 py-8" style={{ borderBottom: '1px solid #E5E3DE', background: '#FFFFFF' }}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#8A8A8A' }}>
                FreelanceDesk
              </p>
              <h1 className="text-2xl font-semibold" style={{ color: '#1C1C1C', letterSpacing: '-0.02em' }}>
                Projects
              </h1>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#1C1C1C', color: '#FFFFFF' }}
              onMouseEnter={e => e.currentTarget.style.background = '#333333'}
              onMouseLeave={e => e.currentTarget.style.background = '#1C1C1C'}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New project
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 mt-6">
            {tabs.map(({ key, label }) => {
              const count = key === 'all' ? projects.length : projects.filter(p => p.status === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors"
                  style={
                    filter === key
                      ? { background: '#F0EEE9', color: '#1C1C1C', fontWeight: 500 }
                      : { color: '#8A8A8A' }
                  }
                >
                  {label}
                  <span className="text-xs px-1.5 py-0.5 rounded"
                    style={
                      filter === key
                        ? { background: '#E5E3DE', color: '#1C1C1C' }
                        : { color: '#B0ADAA' }
                    }
                  >{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-10 py-6">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-800 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-sm font-medium mb-1" style={{ color: '#1C1C1C' }}>
                {filter === 'all' ? 'No projects yet' : `No ${filter} projects`}
              </p>
              <p className="text-sm" style={{ color: '#8A8A8A' }}>
                {filter === 'all' ? 'Create your first project to get started.' : 'Try a different filter.'}
              </p>
            </div>
          ) : (
            <div className="rounded-xl" style={{ border: '1px solid #E5E3DE', background: '#FFFFFF', overflow: 'visible' }}>
              {/* Table header */}
              <div
                className="grid text-xs font-medium uppercase tracking-wider px-6 py-3"
                style={{
                  gridTemplateColumns: '1fr 180px 130px 90px 36px',
                  color: '#8A8A8A',
                  borderBottom: '1px solid #E5E3DE',
                  background: '#FAFAF9',
                }}
              >
                <span>Project</span>
                <span>Client</span>
                <span>Status</span>
                <span>Created</span>
                <span />
              </div>

              {/* Rows */}
              {filtered.map((project, i) => {
                const st = STATUS[project.status] || STATUS['on-hold'];
                return (
                  <div
                    key={project._id}
                    onClick={() => router.push(`/project/${project._id}`)}
                    className="grid items-center px-6 py-4 cursor-pointer transition-colors"
                    style={{
                      gridTemplateColumns: '1fr 180px 130px 90px 36px',
                      borderBottom: i < filtered.length - 1 ? '1px solid #F0EEE9' : 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FAFAF9'; setHoveredRow(project._id); }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; setHoveredRow(null); }}
                  >
                    <span className="text-sm font-medium truncate pr-4" style={{ color: '#1C1C1C' }}>
                      {project.title}
                    </span>

                    <span className="text-sm truncate pr-4" style={{ color: '#8A8A8A' }}>
                      {project.clientName}
                    </span>

                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.dot }} />
                      <span className="text-sm" style={{ color: '#1C1C1C' }}>{st.label}</span>
                    </span>

                    <span className="text-sm" style={{ color: '#B0ADAA' }}>
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : '—'}
                    </span>

                    <RowMenu
                      project={project}
                      onEdit={setEditingProject}
                      onDelete={deleteProject}
                      visible={hoveredRow === project._id}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}
        >
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E5E3DE' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold" style={{ color: '#1C1C1C', letterSpacing: '-0.01em' }}>New project</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-lg transition-colors"
                style={{ color: '#8A8A8A' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F0EEE9'; e.currentTarget.style.color = '#1C1C1C'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8A8A8A'; }}
              >×</button>
            </div>

            <form onSubmit={createProject} className="space-y-4">
              {[
                { key: 'title',      label: 'Project title', type: 'text', placeholder: 'e.g. Landing page redesign' },
                { key: 'clientName', label: 'Client',        type: 'text', placeholder: 'e.g. Acme Corp' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A8A8A' }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
                    style={inputStyle}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    onFocus={e => e.target.style.borderColor = '#1C1C1C'}
                    onBlur={e => e.target.style.borderColor = '#E5E3DE'}
                    required
                    autoFocus={key === 'title'}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A8A8A' }}>Status</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={inputStyle}
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#1C1C1C'}
                  onBlur={e => e.target.style.borderColor = '#E5E3DE'}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: '#F0EEE9', color: '#1C1C1C', border: '1px solid #E5E3DE' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E5E3DE'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F0EEE9'}
                >Cancel</button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
                  style={{ background: '#1C1C1C' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#333333'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1C1C1C'}
                >Create project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingProject && (
        <EditModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={fetchProjects}
        />
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <ProjectsPage />
    </ProtectedRoute>
  );
}
