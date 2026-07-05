'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data))
      .catch(() => {});
  }, [pathname]); // re-fetch when route changes so list stays fresh

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const isProjectActive = (id) => pathname === `/project/${id}`;
  const isDashboardActive = pathname === '/dashboard';

  return (
    <aside
      className="w-52 min-h-screen flex flex-col flex-shrink-0"
      style={{ background: '#FFFFFF', borderRight: '1px solid #E5E3DE' }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid #E5E3DE' }}>
        <span className="text-sm font-semibold tracking-tight" style={{ color: '#1C1C1C', letterSpacing: '-0.01em' }}>
          FreelanceDesk
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">

        {/* Dashboard link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors mb-1"
          style={
            isDashboardActive
              ? { color: '#1C1C1C', background: '#F0EEE9', fontWeight: 500 }
              : { color: '#8A8A8A' }
          }
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          All Projects
        </Link>

        {/* Projects section */}
        {projects.length > 0 && (
          <div className="mt-3">
            <p className="px-3 mb-1 text-xs font-medium uppercase tracking-widest" style={{ color: '#B0ADAA' }}>
              Pages
            </p>
            <div className="space-y-0.5">
              {projects.map(project => {
                const active = isProjectActive(project._id);
                const STATUS_DOT = {
                  active:    '#16A34A',
                  completed: '#8A8A8A',
                  'on-hold': '#D97706',
                };
                return (
                  <Link
                    key={project._id}
                    href={`/project/${project._id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors group"
                    style={
                      active
                        ? { color: '#1C1C1C', background: '#F0EEE9', fontWeight: 500 }
                        : { color: '#8A8A8A' }
                    }
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#1C1C1C'; e.currentTarget.style.background = '#F8F7F4'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#8A8A8A'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: STATUS_DOT[project.status] || '#8A8A8A' }}
                    />
                    <span className="truncate">{project.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid #E5E3DE' }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors text-left"
          style={{ color: '#8A8A8A' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#1C1C1C'; e.currentTarget.style.background = '#F0EEE9'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8A8A8A'; e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
