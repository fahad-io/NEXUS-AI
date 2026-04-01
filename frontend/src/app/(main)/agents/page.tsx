'use client';
import { useState } from 'react';

const TEMPLATES = [
  { icon: '🔍', name: 'Research Agent', desc: 'Autonomously search, summarise, and compile research reports on any topic.', tags: ['GPT-5', 'Web search', 'Reports'], color: '#EEF2FD' },
  { icon: '💼', name: 'Customer Support', desc: 'Handle customer inquiries, route tickets, and escalate complex issues automatically.', tags: ['GPT-5', 'Ticketing', 'Escalation'], color: '#FDF5F0' },
  { icon: '💻', name: 'Code Review', desc: 'Automatically review pull requests for bugs, style issues, and test coverage gaps.', tags: ['Claude Opus', 'Analysis', 'Code', 'Tests'], color: '#EEF8F4' },
  { icon: '📊', name: 'Data Analysis', desc: 'Connect to data sources, run analysis, and generate visualisation reports.', tags: ['Gemini', 'Data', 'Python', 'Visualization'], color: '#EBF5FB' },
  { icon: '✍️', name: 'Content Writer', desc: 'Create SEO-optimised blog posts, social media content, and marketing copy at scale.', tags: ['Claude Sonnet', 'SEO', 'Marketing'], color: '#F5F0FF' },
  { icon: '🧩', name: 'Workflow Automator', desc: 'Connect your apps and automate multi-step workflows with AI decision logic.', tags: ['Any model', 'Automation', 'Integration'], color: '#FFF0F5' },
  { icon: '➕', name: 'Build from Scratch', desc: 'Design a fully custom agent with your own tools, models, and logic from scratch.', tags: ['Any model', 'Custom'], color: '#F4F2EE' },
];

export default function AgentsPage() {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '1.5rem 2.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.8rem', color: 'var(--text)', marginBottom: '0.3rem' }}>Agent Builder</h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Build, configure, and deploy custom AI agents from templates or scratch.</p>
          </div>
          <button style={{ padding: '0.65rem 1.5rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            + New Agent
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2.5rem' }}>
        {/* Banner */}
        {!bannerDismissed && (
          <div style={{ background: 'var(--blue-lt)', border: '1px solid var(--blue-border)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🤖</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--blue)', marginBottom: '0.15rem' }}>Not sure where to start?</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Chat with our AI guide and describe what you want your agent to do — we&apos;ll recommend the best template.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button style={{ padding: '0.45rem 1rem', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600 }}>Chat with guide →</button>
              <button onClick={() => setBannerDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '1.2rem', lineHeight: 1, padding: '0 0.25rem' }}>×</button>
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1rem' }}>Agent Templates</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {TEMPLATES.map(t => (
            <TemplateCard key={t.name} template={t} />
          ))}
        </div>

        {/* My Agents */}
        <div style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1rem' }}>My Agents</h2>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '3rem', textAlign: 'center', color: 'var(--text3)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤖</div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>No agents yet</div>
            <div style={{ fontSize: '0.82rem' }}>Create your first agent from a template above or start from scratch.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: typeof TEMPLATES[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.7rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow)',
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: template.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
        {template.icon}
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>{template.name}</h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.55, margin: 0, flex: 1 }}>{template.desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {template.tags.map(tag => (
          <span key={tag} style={{ padding: '0.2rem 0.55rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '2rem', fontSize: '0.7rem', color: 'var(--text2)' }}>{tag}</span>
        ))}
      </div>
      <a href="#" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', marginTop: 'auto' }}>Use template →</a>
    </div>
  );
}
