'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AIModel } from '@/types';

interface ModelCardProps {
  model: AIModel;
  showUseButton?: boolean;
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  hot: { bg: '#fff1c7', color: '#8d6727' },
  new: { bg: '#e2f6ef', color: '#1c6a55' },
  open: { bg: '#e9f2ff', color: '#295f9c' },
  beta: { bg: '#e7f5fb', color: '#0f5d6b' },
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
        background: 'linear-gradient(180deg, rgba(250,254,255,0.98), rgba(238,248,252,0.9))',
        border: hovered ? '1px solid var(--accent-border)' : '1px solid rgba(71, 99, 119, 0.11)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow)',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: model.bg || '#eef5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            flexShrink: 0,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {model.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'var(--text)',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {model.name}
            </h3>
            {model.badge && badgeStyle && (
              <span
                style={{
                  padding: '0.18rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  background: badgeStyle.bg,
                  color: badgeStyle.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                }}
              >
                {model.badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>{model.org}</div>
        </div>
        <div
          style={{
            textAlign: 'right',
            flexShrink: 0,
            background: 'rgba(244, 251, 255, 0.86)',
            border: '1px solid rgba(71, 99, 119, 0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.45rem 0.55rem',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent2)' }}>{model.price}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2, justifyContent: 'flex-end' }}>
            <span style={{ color: '#cf9b32', fontSize: '0.75rem' }}>★</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text2)' }}>{model.rating}</span>
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: '0.82rem',
          color: 'var(--text2)',
          lineHeight: 1.6,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {model.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {model.tags.slice(0, 4).map(tag => (
          <span
            key={tag}
            style={{
              padding: '0.24rem 0.58rem',
              background: 'rgba(241, 249, 253, 0.92)',
              border: '1px solid rgba(71, 99, 119, 0.11)',
              borderRadius: '999px',
              fontSize: '0.72rem',
              color: 'var(--text2)',
              fontWeight: 600,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: 'var(--text3)',
          paddingTop: '0.7rem',
          borderTop: '1px solid rgba(71, 99, 119, 0.1)',
        }}
      >
        <span>⚡ {model.latency}</span>
        <span>📝 {model.context}</span>
        <span>⭐ {model.reviews.toLocaleString()} reviews</span>
      </div>

      {showUseButton && (
        <button
          onClick={() => router.push(`/chat?model=${model.id}`)}
          style={{
            marginTop: 'auto',
            padding: '0.65rem',
            background: hovered ? 'var(--gradient)' : 'var(--accent-lt)',
            color: hovered ? 'white' : 'var(--accent2)',
            border: '1px solid var(--accent-border)',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            fontFamily: 'inherit',
            width: '100%',
            boxShadow: hovered ? '0 14px 28px rgba(22,122,139,0.18)' : 'none',
          }}
        >
          Use in Chat Hub →
        </button>
      )}
    </div>
  );
}
