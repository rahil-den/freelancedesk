'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../lib/api';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';

const BackIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
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

function ProjectDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [form, setForm] = useState({ title: '', dueDate: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get(`/tasks/${id}`),
        api.get('/projects'),
      ]);
      setTasks(tasksRes.data);
      setProject(projectsRes.data.find(p => p._id === id) || null);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...form, projectId: id });
      setForm({ title: '', dueDate: '' });
      fetchData();
    } catch {
      setError('Failed to create task');
    }
  };

  const toggleTask = async (task) => {
    try {
      await api.patch(`/tasks/${task._id}`, { completed: !task.completed });
      fetchData();
    } catch {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchData();
    } catch {
      setError('Failed to delete task');
    }
  };

  const completed = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const inputStyle = { background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3' };

  return (
    <div className="flex min-h-screen" style={{ background: '#0d1117' }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-8 pb-6" style={{ borderBottom: '1px solid #21262d' }}>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-sm mb-4 transition-all"
            style={{ color: '#8b949e' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e6edf3'}
            onMouseLeave={e => e.currentTarget.style.color = '#8b949e'}
          >
            <BackIcon /> Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#8b949e' }}>Project</p>
              <h1 className="text-2xl font-bold text-white mb-2">
                {project ? project.title : 'Loading...'}
              </h1>
              <div className="flex items-center gap-3">
                {project && (
                  <>
                    <span className="text-sm" style={{ color: '#8b949e' }}>{project.clientName}</span>
                    <span style={{ color: '#30363d' }}>·</span>
                    <StatusBadge status={project?.status} />
                  </>
                )}
              </div>
            </div>

            {/* Progress ring summary */}
            {tasks.length > 0 && (
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{progress}%</p>
                <p className="text-xs" style={{ color: '#8b949e' }}>{completed}/{tasks.length} done</p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {tasks.length > 0 && (
            <div className="mt-4">
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#21262d' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: progress === 100 ? '#10b981' : '#6366f1' }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-8 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              {error}
            </div>
          )}

          {/* Add Deliverable */}
          <form onSubmit={createTask} className="flex gap-3">
            <input
              type="text"
              placeholder="Add a deliverable..."
              className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
              style={inputStyle}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#30363d'}
              required
            />
            <input
              type="date"
              className="px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ ...inputStyle, width: '160px' }}
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#30363d'}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all whitespace-nowrap"
              style={{ background: '#6366f1' }}
              onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
              onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
            >
              Add
            </button>
          </form>

          {/* Task list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl py-20 text-center" style={{ background: '#161b22', border: '1px dashed #30363d' }}>
              <p className="text-white font-medium mb-1">No deliverables yet</p>
              <p className="text-sm" style={{ color: '#8b949e' }}>Add your first deliverable above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Pending tasks */}
              {tasks.filter(t => !t.completed).map(task => (
                <div
                  key={task._id}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl group transition-all"
                  style={{ background: '#161b22', border: '1px solid #21262d' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#30363d'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#21262d'}
                >
                  <button
                    onClick={() => toggleTask(task)}
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center"
                    style={{ borderColor: '#484f58' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#484f58'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs mt-0.5" style={{ color: '#8b949e' }}>
                        Due {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all"
                    style={{ color: '#8b949e' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}

              {/* Completed tasks */}
              {tasks.some(t => t.completed) && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest pt-2 pb-1" style={{ color: '#484f58' }}>Completed</p>
                  {tasks.filter(t => t.completed).map(task => (
                    <div
                      key={task._id}
                      className="flex items-center gap-4 px-5 py-4 rounded-xl group transition-all"
                      style={{ background: '#161b22', border: '1px solid #21262d', opacity: 0.6 }}
                    >
                      <button
                        onClick={() => toggleTask(task)}
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
                        style={{ background: '#6366f1', border: '2px solid #6366f1' }}
                      >
                        <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-through truncate" style={{ color: '#8b949e' }}>{task.title}</p>
                        {task.dueDate && (
                          <p className="text-xs mt-0.5" style={{ color: '#484f58' }}>
                            Due {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all"
                        style={{ color: '#8b949e' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ProjectDetail() {
  return (
    <ProtectedRoute>
      <ProjectDetailContent />
    </ProtectedRoute>
  );
}
