'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../lib/api';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';

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

  const STATUS = {
    active:    { label: 'Active',    dot: '#16A34A' },
    completed: { label: 'Completed', dot: '#8A8A8A' },
    'on-hold': { label: 'On Hold',   dot: '#D97706' },
  };

  const pending   = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);
  const progress  = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
  const st = project ? (STATUS[project.status] || STATUS['on-hold']) : null;

  const inputStyle = { background: '#F5F4F0', border: '1px solid #E5E3DE', color: '#1C1C1C' };

  const TaskRow = ({ task }) => (
    <div
      className="flex items-center gap-4 px-5 py-3.5 group transition-colors"
      style={{ borderBottom: '1px solid #F0EEE9' }}
      onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <button
        onClick={() => toggleTask(task)}
        className="w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors"
        style={
          task.completed
            ? { background: '#1C1C1C', borderColor: '#1C1C1C' }
            : { background: 'transparent', borderColor: '#D0CEC9' }
        }
        onMouseEnter={e => { if (!task.completed) { e.currentTarget.style.borderColor = '#1C1C1C'; } }}
        onMouseLeave={e => { if (!task.completed) { e.currentTarget.style.borderColor = '#D0CEC9'; } }}
      >
        {task.completed && (
          <svg width="9" height="9" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span
          className="text-sm"
          style={{ color: task.completed ? '#B0ADAA' : '#1C1C1C', textDecoration: task.completed ? 'line-through' : 'none' }}
        >
          {task.title}
        </span>
        {task.dueDate && (
          <span className="text-xs ml-3" style={{ color: '#B0ADAA' }}>
            {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      <button
        onClick={() => deleteTask(task._id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded transition-colors"
        style={{ color: '#B0ADAA' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#B91C1C'; e.currentTarget.style.background = '#FEF2F2'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#B0ADAA'; e.currentTarget.style.background = 'transparent'; }}
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F4F0' }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-10 py-8" style={{ borderBottom: '1px solid #E5E3DE', background: '#FFFFFF' }}>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider mb-5 transition-colors"
            style={{ color: '#8A8A8A' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1C1C1C'}
            onMouseLeave={e => e.currentTarget.style.color = '#8A8A8A'}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Projects
          </button>

          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-2" style={{ color: '#1C1C1C', letterSpacing: '-0.02em' }}>
                {project ? project.title : '—'}
              </h1>
              {project && st && (
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: '#8A8A8A' }}>{project.clientName}</span>
                  <span style={{ color: '#E5E3DE' }}>·</span>
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: '#1C1C1C' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                    {st.label}
                  </span>
                </div>
              )}
            </div>

            {tasks.length > 0 && (
              <div className="text-right">
                <p className="text-2xl font-semibold" style={{ color: '#1C1C1C', letterSpacing: '-0.02em' }}>{progress}%</p>
                <p className="text-xs" style={{ color: '#8A8A8A' }}>{completed.length} of {tasks.length} done</p>
              </div>
            )}
          </div>

          {tasks.length > 0 && (
            <div className="mt-5 w-full h-px rounded-full overflow-hidden" style={{ background: '#E5E3DE' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: progress === 100 ? '#16A34A' : '#1C1C1C' }}
              />
            </div>
          )}
        </div>

        <div className="px-10 py-8">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          {/* Add task form */}
          <form onSubmit={createTask} className="flex gap-2 mb-8">
            <input
              type="text"
              placeholder="Add a deliverable..."
              className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={inputStyle}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#1C1C1C'}
              onBlur={e => e.target.style.borderColor = '#E5E3DE'}
              required
            />
            <input
              type="date"
              className="px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{ ...inputStyle, width: '150px' }}
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#1C1C1C'}
              onBlur={e => e.target.style.borderColor = '#E5E3DE'}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors whitespace-nowrap"
              style={{ background: '#1C1C1C' }}
              onMouseEnter={e => e.currentTarget.style.background = '#333333'}
              onMouseLeave={e => e.currentTarget.style.background = '#1C1C1C'}
            >
              Add
            </button>
          </form>

          {/* Task list */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-800 animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm font-medium mb-1" style={{ color: '#1C1C1C' }}>No deliverables yet</p>
              <p className="text-sm" style={{ color: '#8A8A8A' }}>Add your first deliverable above.</p>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E3DE' }}>
              {/* Pending */}
              {pending.length > 0 && (
                <div>
                  <div className="px-5 py-2.5 text-xs font-medium uppercase tracking-wider" style={{ color: '#8A8A8A', borderBottom: '1px solid #F0EEE9', background: '#FAFAF9' }}>
                    To do · {pending.length}
                  </div>
                  {pending.map(task => <TaskRow key={task._id} task={task} />)}
                </div>
              )}

              {/* Completed */}
              {completed.length > 0 && (
                <div>
                  <div className="px-5 py-2.5 text-xs font-medium uppercase tracking-wider" style={{ color: '#8A8A8A', borderBottom: '1px solid #F0EEE9', borderTop: pending.length > 0 ? '1px solid #E5E3DE' : 'none', background: '#FAFAF9' }}>
                    Done · {completed.length}
                  </div>
                  {completed.map(task => <TaskRow key={task._id} task={task} />)}
                </div>
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
