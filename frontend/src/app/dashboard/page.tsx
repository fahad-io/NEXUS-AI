'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthState } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuthState();
    if (!auth.isAuthenticated) { router.push('/auth/login'); return; }
    setUser(auth.user);
  }, [router]);

  if (!user) return null;

  const stats = [
    { label: 'Total Requests', value: '142', sub: 'all time', color: 'var(--accent)' },
    { label: 'Models Used', value: '8', sub: 'unique models', color: 'var(--blue)' },
    { label: 'Avg Latency', value: '1.2s', sub: 'this month', color: 'var(--teal)' },
    { label: 'Total Cost', value: '$3.40', sub: 'this month', color: 'var(--amber)' },
  ];

  const navItems = [
    { href: '/dashboard', label: '📊 Overview', active: true },
    { href: '/dashboard/history', label: '💬 Chat History', active: false },
    { href: '/dashboard/settings', label: '⚙️ Settings', active: false },
    { href: '/dashboard/billing', label: '💳 Billing', active: false },
    { href: '/chat', label: '🚀 Go to Chat Hub', active: false },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: 'var(--white)', borderRight: '1px solid var(--border)', padding: '1.5rem 1rem' }}>
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', fontWeight: 600, marginBottom: '0.75rem' }}>Dashboard</div>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{ display: 'block', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: item.active ? 'var(--accent)' : 'var(--text2)', textDecoration: 'none', background: item.active ? 'var(--accent-lt)' : 'transparent', marginBottom: 2, fontWeight: item.active ? 600 : 400 }}>
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Welcome back, {user.name} 👋</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text3)', marginBottom: '0.5rem' }}>{s.label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: '0.3rem' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>Quick Start</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { href: '/chat', label: '🚀 Open Chat Hub', primary: true },
              { href: '/marketplace', label: '🛍 Browse Models', primary: false },
              { href: '/agents', label: '🤖 Build Agent', primary: false },
              { href: '/dashboard/history', label: '💬 View History', primary: false },
            ].map(b => (
              <Link key={b.href} href={b.href} style={{ padding: '0.6rem 1.25rem', background: b.primary ? 'var(--accent)' : 'var(--bg)', border: '1px solid', borderColor: b.primary ? 'var(--accent)' : 'var(--border2)', borderRadius: 'var(--radius)', fontSize: '0.85rem', fontWeight: 600, color: b.primary ? 'white' : 'var(--text2)', textDecoration: 'none', transition: 'all 0.15s' }}>
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
