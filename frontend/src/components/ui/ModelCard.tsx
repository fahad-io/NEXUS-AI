'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AIModel } from '@/types';

interface ModelCardProps {
  model: AIModel;
  showUseButton?: boolean;
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  hot: { bg: '#FEF3C7', color: '#92400E' },
  new: { bg: '#DCFCE7', color: '#166534' },
  open: { bg: '#EDE9FE', color: '#5B21B6' },
  beta: { bg: '#FEE2E2', color: '#991B1B' },
};

export default function ModelCard({ model, showUseButton = true }: ModelCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const badgeStyle = model.badge ? BADGE_STYLES[model.badge] || BADGE_STYLES.new : null;

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
        gap: '0.75rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow)',
        cursor: 'default',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: model.bg || '#F4F2EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
          {model.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{model.name}</h3>
            {model.badge && badgeStyle && (
              <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 700, background: badgeStyle.bg, color: badgeStyle.color, textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
                {model.badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>{model.org}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)' }}>{model.price}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2, justifyContent: 'flex-end' }}>
            <span style={{ color: '#F59E0B', fontSize: '0.75rem' }}>★</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)' }}>{model.rating}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {model.desc}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {model.tags.slice(0, 4).map(tag => (
          <span key={tag} style={{ padding: '0.2rem 0.55rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '2rem', fontSize: '0.72rem', color: 'var(--text2)', fontWeight: 500 }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text3)' }}>
        <span>⚡ {model.latency}</span>
        <span>📝 {model.context}</span>
        <span>⭐ {model.reviews.toLocaleString()} reviews</span>
      </div>

      {/* Action */}
      {showUseButton && (
        <button
          onClick={() => router.push(`/chat?model=${model.id}`)}
          style={{ marginTop: 'auto', padding: '0.55rem', background: 'var(--accent-lt)', color: 'var(--accent)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit', transition: 'background 0.15s', width: '100%' }}
        >
          Use in Chat Hub →
        </button>
      )}
    </div>
  );
}
