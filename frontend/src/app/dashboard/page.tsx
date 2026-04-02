'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthState } from '@/lib/auth';

// --- Tiny SVG bar chart ---
function BarChart({ data, color = 'var(--accent)' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.value));
  const W = 360, H = 110, barW = Math.floor((W - (data.length + 1) * 8) / data.length);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ display: 'block' }}>
      {data.map((d, i) => {
        const barH = Math.round((d.value / max) * H);
        const x = 8 + i * (barW + 8);
        const y = H - barH;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} rx={3} fill={color} opacity={0.85} />
            <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize={9} fill="var(--text3)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// --- Tiny SVG line chart ---
function LineChart({ data, color = 'var(--accent)' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  const W = 360, H = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (W - 16) + 8;
    const y = H - (d.value / max) * (H - 10) - 4;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');

  // fill area under the line
  const first = pts[0];
  const last = pts[pts.length - 1];
  const fillPts = `${first} ${polyline} ${last.split(',')[0]},${H} 8,${H}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lgfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#lgfill)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const [x, y] = pts[i].split(',').map(Number);
        return (
          <g key={d.label}>
            <circle cx={x} cy={y} r={3.5} fill={color} />
            <text x={x} y={H + 14} textAnchor="middle" fontSize={9} fill="var(--text3)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// --- Tiny donut chart ---
function DonutChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, d) => s + d.value, 0);
  const R = 44, cx = 56, cy = 56, strokeW = 18;
  let offset = 0;
  const circ = 2 * Math.PI * R;
  const segments = slices.map(s => {
    const dash = (s.value / total) * circ;
    const gap = circ - dash;
    const seg = { ...s, dash, gap, offset };
    offset += dash;
    return seg;
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <svg width={112} height={112} viewBox="0 0 112 112" style={{ flexShrink: 0 }}>
        {segments.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeW}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--text)">{total}</text>
        <text x={cx} y={cy + 17} textAnchor="middle" fontSize={8} fill="var(--text3)">total</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {slices.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text2)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, display: 'inline-block', flexShrink: 0 }} />
            {s.label} — <strong style={{ color: 'var(--text)' }}>{s.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const chatData = [
    { label: 'Mar 27', value: 8 },
    { label: 'Mar 28', value: 14 },
    { label: 'Mar 29', value: 10 },
    { label: 'Mar 30', value: 20 },
    { label: 'Mar 31', value: 17 },
    { label: 'Apr 1', value: 25 },
    { label: 'Apr 2', value: 19 },
  ];

  const modelUsageData = [
    { label: 'GPT-4o', value: 42 },
    { label: 'Claude', value: 35 },
    { label: 'Gemini', value: 28 },
    { label: 'Llama', value: 18 },
    { label: 'Mistral', value: 12 },
    { label: 'DALL·E', value: 7 },
  ];

  const modelTypeSlices = [
    { label: 'Chat', value: 77, color: 'var(--accent)' },
    { label: 'Vision', value: 28, color: 'var(--blue)' },
    { label: 'Image Gen', value: 22, color: 'var(--teal)' },
    { label: 'Code', value: 15, color: 'var(--amber)' },
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
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Welcome back, {user.name}</p>
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

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

          {/* Chat activity line chart */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>Chat Activity</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Messages sent — last 7 days</div>
            </div>
            <LineChart data={chatData} color="var(--accent)" />
          </div>

          {/* Model usage bar chart */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>Model Usage</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Requests per model — all time</div>
            </div>
            <BarChart data={modelUsageData} color="var(--blue)" />
          </div>
        </div>

        {/* Donut + quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>

          {/* Model type breakdown donut */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>Usage by Category</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Requests grouped by model type</div>
            </div>
            <DonutChart slices={modelTypeSlices} />
          </div>

          {/* Quick Links */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>Quick Start</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/chat', label: '🚀 Open Chat Hub', primary: true },
                { href: '/marketplace', label: '🛍 Browse Models', primary: false },
                { href: '/agents', label: '🤖 Build Agent', primary: false },
                { href: '/dashboard/history', label: '💬 View History', primary: false },
              ].map(b => (
                <Link key={b.href} href={b.href} style={{ padding: '0.6rem 1.25rem', background: b.primary ? 'var(--accent)' : 'var(--bg)', border: '1px solid', borderColor: b.primary ? 'var(--accent)' : 'var(--border2)', borderRadius: 'var(--radius)', fontSize: '0.85rem', fontWeight: 600, color: b.primary ? 'white' : 'var(--text2)', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                  {b.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
