'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { background: '#161b22', border: '1px solid #30363d' };
  const focusStyle = '#6366f1';
  const blurStyle = '#30363d';

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
            Get started for free
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your freelance.<br />
            <span style={{ color: '#6366f1' }}>Organised.</span>
          </h1>
          <p className="text-base" style={{ color: '#8b949e' }}>
            Create your account and start tracking projects, deliverables, and clients in minutes.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {['Free to use', 'No limits', 'Ship faster'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)' }}>
                <svg width="10" height="10" fill="none" stroke="#818cf8" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-xs" style={{ color: '#8b949e' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
            <p className="text-sm" style={{ color: '#8b949e' }}>Fill in your details to get started</p>
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
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith' },
              { key: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#8b949e' }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-all"
                  style={inputStyle}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  onFocus={e => e.target.style.borderColor = focusStyle}
                  onBlur={e => e.target.style.borderColor = blurStyle}
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all mt-2"
              style={{ background: loading ? '#4338ca' : '#6366f1' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4f46e5'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#6366f1'; }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center" style={{ color: '#8b949e' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: '#818cf8' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
