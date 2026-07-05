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

  const fields = [
    { key: 'name',     label: 'Full Name', type: 'text',     placeholder: 'John Smith' },
    { key: 'email',    label: 'Email',     type: 'email',    placeholder: 'you@example.com' },
    { key: 'password', label: 'Password',  type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F4F0' }}>
      <div className="w-full max-w-sm">

        <div className="mb-10">
          <span className="text-sm font-semibold" style={{ color: '#1C1C1C', letterSpacing: '-0.01em' }}>
            FreelanceDesk
          </span>
        </div>

        <h1 className="text-2xl font-semibold mb-1" style={{ color: '#1C1C1C', letterSpacing: '-0.02em' }}>
          Create account
        </h1>
        <p className="text-sm mb-8" style={{ color: '#8A8A8A' }}>
          Already have one?{' '}
          <Link href="/login" className="underline underline-offset-2" style={{ color: '#1C1C1C' }}>
            Sign in
          </Link>
        </p>

        {error && (
          <p className="text-sm mb-6 px-4 py-3 rounded-lg" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#8A8A8A' }}>
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{ background: '#FFFFFF', border: '1px solid #E5E3DE', color: '#1C1C1C' }}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#1C1C1C'}
                onBlur={e => e.target.style.borderColor = '#E5E3DE'}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium transition-colors mt-2"
            style={{ background: '#1C1C1C', color: '#FFFFFF', opacity: loading ? 0.6 : 1 }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#333333'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1C1C1C'; }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
