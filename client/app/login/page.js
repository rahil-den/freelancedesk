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
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F4F0' }}>
      <div className="w-full max-w-sm">

        {/* Wordmark */}
        <div className="mb-10">
          <span className="text-sm font-semibold" style={{ color: '#1C1C1C', letterSpacing: '-0.01em' }}>
            FreelanceDesk
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-1" style={{ color: '#1C1C1C', letterSpacing: '-0.02em' }}>
          Sign in
        </h1>
        <p className="text-sm mb-8" style={{ color: '#8A8A8A' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="underline underline-offset-2" style={{ color: '#1C1C1C' }}>
            Create one
          </Link>
        </p>

        {error && (
          <p className="text-sm mb-6 px-4 py-3 rounded-lg" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A8A8A' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={{ background: '#FFFFFF', border: '1px solid #E5E3DE', color: '#1C1C1C' }}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#1C1C1C'}
              onBlur={e => e.target.style.borderColor = '#E5E3DE'}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A8A8A' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={{ background: '#FFFFFF', border: '1px solid #E5E3DE', color: '#1C1C1C' }}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#1C1C1C'}
              onBlur={e => e.target.style.borderColor = '#E5E3DE'}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium transition-colors mt-2"
            style={{ background: '#1C1C1C', color: '#FFFFFF', opacity: loading ? 0.6 : 1 }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#333333'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1C1C1C'; }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
