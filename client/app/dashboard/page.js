'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';

function DashboardContent() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', clientName: '', status: 'active' });
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', form);
      setForm({ title: '', clientName: '', status: 'active' });
      fetchProjects();
    } catch (err) {
      setError('Failed to create project');
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const statusColor = (status) => {
    if (status === 'active') return 'bg-green-100 text-green-700';
    if (status === 'completed') return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Projects</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form onSubmit={createProject} className="bg-white p-6 rounded shadow mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Add New Project</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Project Title"
              className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Client Name"
              className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.clientName}
              onChange={e => setForm({ ...form, clientName: e.target.value })}
              required
            />
            <select
              className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Project
          </button>
        </form>

        <div className="grid grid-cols-1 gap-4">
          {projects.length === 0 && (
            <p className="text-gray-500 text-center py-8">No projects yet. Create one above.</p>
          )}
          {projects.map(project => (
            <div
              key={project._id}
              className="bg-white p-6 rounded shadow flex justify-between items-center"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => router.push(`/project/${project._id}`)}
              >
                <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                <p className="text-gray-500 text-sm">Client: {project.clientName}</p>
                <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${statusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <button
                onClick={() => deleteProject(project._id)}
                className="text-red-500 hover:text-red-700 text-sm ml-4"
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

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
