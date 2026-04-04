'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthState } from '@/lib/auth';
import { chatApi } from '@/lib/api';

interface Session {
  id: string;
  modelId: string;
  title: string;
  updatedAt: string;
  messages: { role: string }[];
}

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthState();
    if (!auth.isAuthenticated) { router.push('/auth/login'); return; }

    chatApi.getHistory(1, 50)
      .then(res => {
        setSessions(Array.isArray(res.data?.data) ? res.data.data : []);
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    try {
      await chatApi.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch {
      // ignore
    }
  };

  const navItems = [
    { href: '/dashboard', label: '📊 Overview' },
    { href: '/dashboard/history', label: '💬 Chat History', active: true },
    { href: '/dashboard/settings', label: '⚙️ Settings' },
    { href: '/dashboard/billing', label: '💳 Billing' },
    { href: '/chat', label: '🚀 Go to Chat Hub' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <aside style={{ width: 220, flexShrink: 0, background: 'var(--white)', borderRight: '1px solid var(--border)', padding: '1.5rem 1rem' }}>
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', fontWeight: 600, marginBottom: '0.75rem' }}>Dashboard</div>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{ display: 'block', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: (item as any).active ? 'var(--accent)' : 'var(--text2)', textDecoration: 'none', background: (item as any).active ? 'var(--accent-lt)' : 'transparent', marginBottom: 2, fontWeight: (item as any).active ? 600 : 400 }}>{item.label}</Link>
        ))}
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem' }}>Chat History</h1>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)' }}>Loading...</div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)' }}>No chat sessions yet. <Link href="/chat" style={{ color: 'var(--accent)' }}>Start chatting →</Link></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sessions.map(s => (
              <div key={s.id} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>{s.title || 'Untitled Chat'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{s.modelId} · {s.messages?.length ?? 0} messages · {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/chat?session=${s.id}`} style={{ padding: '0.4rem 0.9rem', background: 'var(--accent-lt)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Continue →</Link>
                  <button onClick={() => handleDelete(s.id)} style={{ padding: '0.4rem 0.9rem', background: 'none', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text3)', cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
