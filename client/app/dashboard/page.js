'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute';

const PlusIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const statusConfig = {
  active:    { label: 'Active',    bg: 'rgba(16,185,129,0.12)', color: '#34d399', dot: '#10b981' },
  completed: { label: 'Completed', bg: 'rgba(99,102,241,0.12)', color: '#818cf8', dot: '#6366f1' },
  'on-hold': { label: 'On Hold',   bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', dot: '#f59e0b' },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig['on-hold'];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: cfg.dot }}></span>
      {cfg.label}
    </span>
  );
}

function DashboardContent() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', clientName: '', status: 'active' });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
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
      setShowModal(false);
      fetchProjects();
    } catch {
      setError('Failed to create project');
    }
  };

  const deleteProject = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch {
      setError('Failed to delete project');
    }
  };

  const stats = [
    { label: 'Total Projects', value: projects.length, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Active', value: projects.filter(p => p.status === 'active').length, color: '#34d399', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#818cf8', bg: 'rgba(99,102,241,0.1)' },
    { label: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length, color: '#fbbf24', bg: 'rgba(245,158,11,0.1)' },
  ];

  const inputStyle = { background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3' };

  return (
    <div className="flex min-h-screen" style={{ background: '#0d1117' }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-8 pb-0 flex items-center justify-between" style={{ borderBottom: '1px solid #21262d', paddingBottom: '24px' }}>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>Overview</p>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: '#6366f1' }}
            onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
            onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
          >
            <PlusIcon /> New Project
          </button>
        </div>

        <div className="px-8 py-8 space-y-8">
          {error && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, color, bg }) => (
              <div key={label} className="rounded-xl p-5 flex items-center gap-4" style={{ background: '#161b22', border: '1px solid #21262d' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                  <span className="text-xl font-bold" style={{ color }}>{value}</span>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#8b949e' }}>{label}</p>
                  <p className="text-lg font-bold text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">All Projects</h2>
              <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ background: '#21262d', color: '#8b949e' }}>
                {projects.length} total
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-xl py-20 text-center" style={{ background: '#161b22', border: '1px dashed #30363d' }}>
                <p className="text-white font-medium mb-1">No projects yet</p>
                <p className="text-sm mb-4" style={{ color: '#8b949e' }}>Create your first project to get started</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: '#6366f1' }}
                >
                  + New Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.map(project => (
                  <div
                    key={project._id}
                    onClick={() => router.push(`/project/${project._id}`)}
                    className="rounded-xl p-5 cursor-pointer group transition-all"
                    style={{ background: '#161b22', border: '1px solid #21262d' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#21262d'}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold text-white"
                        style={{ background: 'rgba(99,102,241,0.2)' }}>
                        {project.title.charAt(0).toUpperCase()}
                      </div>
                      <button
                        onClick={(e) => deleteProject(project._id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all"
                        style={{ color: '#8b949e' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
                      >
                        <TrashIcon />
                      </button>
                    </div>

                    <h3 className="font-semibold text-white mb-1 truncate">{project.title}</h3>
                    <p className="text-sm mb-4 truncate" style={{ color: '#8b949e' }}>{project.clientName}</p>

                    <div className="flex items-center justify-between">
                      <StatusBadge status={project.status} />
                      <span className="text-xs transition-all group-hover:translate-x-1" style={{ color: '#6366f1' }}>
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Project Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#161b22', border: '1px solid #30363d' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">New Project</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-all"
                style={{ color: '#8b949e' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#21262d'; e.currentTarget.style.color = '#e6edf3'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
              >
                ×
              </button>
            </div>

            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#8b949e' }}>Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Landing Page Redesign"
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={inputStyle}
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#30363d'}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#8b949e' }}>Client Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={inputStyle}
                  value={form.clientName}
                  onChange={e => setForm({ ...form, clientName: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#30363d'}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#8b949e' }}>Status</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={inputStyle}
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#30363d'}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: '#21262d', color: '#8b949e', border: '1px solid #30363d' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#e6edf3'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                  style={{ background: '#6366f1' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                  onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
