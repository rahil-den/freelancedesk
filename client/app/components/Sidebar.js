'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const GridIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const LogoIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <rect x="2" y="2" width="9" height="9" rx="2" fill="#6366f1"/>
    <rect x="13" y="2" width="9" height="9" rx="2" fill="#6366f1" opacity="0.6"/>
    <rect x="2" y="13" width="9" height="9" rx="2" fill="#6366f1" opacity="0.6"/>
    <rect x="13" y="13" width="9" height="9" rx="2" fill="#6366f1" opacity="0.3"/>
  </svg>
);

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <GridIcon /> },
  ];

  return (
    <aside
      style={{ background: '#161b22', borderRight: '1px solid #21262d' }}
      className="w-60 min-h-screen flex flex-col flex-shrink-0"
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid #21262d' }}>
        <div className="flex items-center gap-3">
          <LogoIcon />
          <span className="font-bold text-white text-base tracking-tight">FreelanceDesk</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#484f58' }}>Menu</p>
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={
              isActive(href)
                ? { background: 'rgba(99,102,241,0.15)', color: '#818cf8' }
                : { color: '#8b949e' }
            }
            onMouseEnter={e => { if (!isActive(href)) { e.currentTarget.style.background = '#21262d'; e.currentTarget.style.color = '#e6edf3'; } }}
            onMouseLeave={e => { if (!isActive(href)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b949e'; } }}
          >
            <span style={{ opacity: isActive(href) ? 1 : 0.7 }}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid #21262d' }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: '#8b949e' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </aside>
  );
}
