'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthState } from '@/lib/auth';

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuthState();
    if (!auth.isAuthenticated) { router.push('/auth/login'); return; }
    setUser(auth.user);
  }, [router]);

  if (!user) return null;

  const navItems = [
    { href: '/dashboard', label: '📊 Overview' },
    { href: '/dashboard/history', label: '💬 Chat History' },
    { href: '/dashboard/settings', label: '⚙️ Settings' },
    { href: '/dashboard/billing', label: '💳 Billing', active: true },
    { href: '/chat', label: '🚀 Go to Chat Hub' },
  ];

  const invoices = [
    { date: '2025-03-01', amount: '$0.00', plan: 'Free', status: 'Paid' },
    { date: '2025-02-01', amount: '$0.00', plan: 'Free', status: 'Paid' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <aside style={{ width: 220, flexShrink: 0, background: 'var(--white)', borderRight: '1px solid var(--border)', padding: '1.5rem 1rem' }}>
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', fontWeight: 600, marginBottom: '0.75rem' }}>Dashboard</div>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{ display: 'block', padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: (item as any).active ? 'var(--accent)' : 'var(--text2)', textDecoration: 'none', background: (item as any).active ? 'var(--accent-lt)' : 'transparent', marginBottom: 2, fontWeight: (item as any).active ? 600 : 400 }}>{item.label}</Link>
        ))}
      </aside>
      <main style={{ flex: 1, padding: '2rem', maxWidth: 800 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem' }}>Billing</h1>

        {/* Current Plan */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.25rem' }}>Current Plan</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>Free</div>
            </div>
            <button style={{ padding: '0.65rem 1.5rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.875rem' }}>
              Upgrade to Pro →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {[{ l: 'API Calls / mo', v: '100 / 1,000' }, { l: 'Models Access', v: '10 models' }, { l: 'Storage', v: '100 MB' }].map(s => (
              <div key={s.l} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.875rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: '0.3rem' }}>{s.l}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan Card */}
        <div style={{ background: 'linear-gradient(135deg, var(--accent-lt), rgba(200,98,42,0.04))', border: '1.5px solid var(--accent-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>✦ Pro Plan — $19/mo</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Unlimited API calls · 400+ models · Priority support · Advanced analytics</div>
            </div>
            <button style={{ padding: '0.65rem 1.5rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
              Start Free Trial
            </button>
          </div>
        </div>

        {/* Invoices */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>Invoice History</h2>
          {invoices.map((inv, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: i < invoices.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>{inv.plan} Plan</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{inv.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{inv.amount}</span>
                <span style={{ fontSize: '0.72rem', background: 'var(--teal-lt)', color: 'var(--teal)', borderRadius: '2rem', padding: '0.15rem 0.65rem', fontWeight: 600 }}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
