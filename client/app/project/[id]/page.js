'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '../../lib/api';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';

function ProjectDetailContent() {
  const { id } = useParams(); // reads the [id] from the URL
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', dueDate: '' });
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    }
  };

  useEffect(() => { fetchTasks(); }, [id]);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...form, projectId: id });
      setForm({ title: '', dueDate: '' });
      fetchTasks();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const toggleTask = async (task) => {
    try {
      await api.patch(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Deliverables</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form onSubmit={createTask} className="bg-white p-6 rounded shadow mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Add Deliverable</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Deliverable title"
              className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="date"
              className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Deliverable
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-gray-500 text-center py-8">No deliverables yet. Add one above.</p>
          )}
          {tasks.map(task => (
            <div
              key={task._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div>
                  <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className="text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
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
