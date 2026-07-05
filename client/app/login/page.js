'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0d1117' }}>
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)', borderRight: '1px solid #21262d' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#6366f1' }}>
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>
          </div>
          <span className="font-bold text-white text-lg">FreelanceDesk</span>
        </div>

        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block"></span>
            Freelance Project Management
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Manage every project.<br />
            <span style={{ color: '#6366f1' }}>Ship on time.</span>
          </h1>
          <p className="text-base" style={{ color: '#8b949e' }}>
            Track deliverables, manage clients, and stay on top of every deadline — all in one clean dashboard.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {['Projects Tracked', 'Deliverables', 'Clients'].map((label, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-bold text-white">{['120+', '450+', '60+'][i]}</p>
              <p className="text-xs" style={{ color: '#8b949e' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm" style={{ color: '#8b949e' }}>Sign in to your account to continue</p>
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-6"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#8b949e' }}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-all"
                style={{ background: '#161b22', border: '1px solid #30363d' }}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#30363d'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#8b949e' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-all"
                style={{ background: '#161b22', border: '1px solid #30363d' }}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#30363d'}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all mt-2"
              style={{ background: loading ? '#4338ca' : '#6366f1' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4f46e5'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#6366f1'; }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center" style={{ color: '#8b949e' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium" style={{ color: '#818cf8' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
