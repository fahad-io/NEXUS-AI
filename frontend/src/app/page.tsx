'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import ModelCard from '@/components/ui/ModelCard';
import { FALLBACK_MODELS } from '@/lib/models-fallback';

const ACTION_GRID = [
  { label: 'Create image', icon: '🎨' },
  { label: 'Generate audio', icon: '🎵' },
  { label: 'Create video', icon: '🎬' },
  { label: 'Create slides', icon: '📋' },
  { label: 'Analyze Data', icon: '📈' },
  { label: 'Write content', icon: '✍️' },
  { label: 'Code Generation', icon: '💻' },
  { label: 'Document Analysis', icon: '📄' },
  { label: 'Translate', icon: '🌐' },
  { label: 'Create Infographs', icon: '📊' },
  { label: 'Create quiz', icon: '❓' },
  { label: 'Create Flashcards', icon: '🗂️' },
  { label: 'Just Exploring', icon: '🧭' },
];

const FEATURES = [
  { icon: '🔍', title: 'Guided Discovery', desc: 'Our AI guides you to the perfect model based on your use case, budget, and performance needs.' },
  { icon: '⚡', title: 'Instant Comparison', desc: 'Compare models side-by-side on latency, cost, context window, and real-world performance.' },
  { icon: '🔌', title: 'One-Click Deploy', desc: 'Integrate any model into your stack with a unified API — no per-provider setup needed.' },
  { icon: '📡', title: 'Live Monitoring', desc: 'Track usage, latency, and costs in real-time with our built-in observability dashboard.' },
  { icon: '🤖', title: 'Agent Builder', desc: 'Build, configure, and deploy custom AI agents from templates or scratch in minutes.' },
  { icon: '🔒', title: 'Enterprise Ready', desc: 'SOC-2 compliant with role-based access, audit logs, and private model endpoints.' },
];

export default function LandingPage() {
  const router = useRouter();
  const popularModels = FALLBACK_MODELS.slice(0, 6);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '5rem 2.5rem 3rem', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        {/* Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border2)', borderRadius: '2rem', padding: '0.4rem 1rem', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text2)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          ✦ All models live · Updated hourly
        </div>

        {/* H1 */}
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '1.25rem' }}>
          Find your perfect{' '}
          <span style={{ color: 'var(--accent)' }}>AI model</span>
          <br />with guided discovery
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--text2)', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Compare 400+ AI models by performance, cost, and capability. Get personalised recommendations powered by NexusAI&apos;s guided discovery engine.
        </p>

        {/* Hero Search Card */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-xl)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-md)', maxWidth: 700, margin: '0 auto 2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              placeholder="Ask anything — describe your project, use case, or task..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--text)', background: 'transparent', fontFamily: 'inherit', cursor: 'pointer' }}
              readOnly
              onClick={() => router.push('/chat')}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {['🎙️', '📎', '🖼️', '📷'].map((ic, i) => (
                <button key={i} onClick={() => router.push('/chat')} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ic}</button>
              ))}
            </div>
            <button onClick={() => router.push('/chat')} style={{ padding: '0.55rem 1.25rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' }}>
              Ask →
            </button>
          </div>

          {/* Action Grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '0.9rem', paddingTop: '0.9rem', borderTop: '1px solid var(--border)' }}>
            {ACTION_GRID.map(a => (
              <button key={a.label} onClick={() => router.push('/chat')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.35rem 0.75rem', background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, color: 'var(--text2)', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                <span>{a.icon}</span> {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2.5rem' }}>
          {[{ val: '400+', label: 'Models' }, { val: '50M+', label: 'Requests' }, { val: '99.9%', label: 'Uptime' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)' }}>{s.val}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text3)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Models */}
      <section style={{ padding: '3rem 2.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>Popular Models</h2>
          <Link href="/marketplace" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Browse all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1rem' }}>
          {popularModels.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '3rem 2.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem', textAlign: 'center' }}>Everything you need</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--text)' }}>{f.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 2.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text3)' }}>
        © 2025 NexusAI · Built for the AI-native era
      </footer>
    </div>
  );
}
