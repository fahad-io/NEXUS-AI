'use client';
import { useState, useMemo } from 'react';
import { useModels } from '@/hooks/useModels';
import { FALLBACK_MODELS } from '@/lib/models-fallback';
import { AIModel } from '@/types';
import ModelDetailDialog from '@/components/ui/ModelDetailDialog';

const LABS = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'xAI', 'DeepSeek', 'Cohere', 'Stability AI', 'ElevenLabs', 'Midjourney', 'Microsoft', 'Alibaba'];
const TYPE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'language', label: 'Language' },
  { id: 'vision', label: 'Vision' },
  { id: 'code', label: 'Code' },
  { id: 'image', label: 'Image Gen' },
  { id: 'audio', label: 'Audio' },
  { id: 'open', label: 'Open Source' },
];
const PRICING_OPTIONS = ['Free', 'Pay-per-use', 'Subscription'];
const LICENSE_OPTIONS = ['Open Source', 'Commercial', 'Research Only'];

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  hot: { bg: '#fff1c7', color: '#8d6727' },
  new: { bg: '#e2f6ef', color: '#1c6a55' },
  open: { bg: '#e9f2ff', color: '#295f9c' },
  beta: { bg: '#e7f5fb', color: '#0f5d6b' },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#cf9b32' : '#d5e0e7', fontSize: '0.75rem' }}>
          ★
        </span>
      ))}
      <span style={{ fontSize: '0.75rem', color: 'var(--text3)', marginLeft: 3 }}>{rating}</span>
    </span>
  );
}

function MCard({ model, onOpenDialog }: { model: AIModel; onOpenDialog: (m: AIModel) => void }) {
  const [hovered, setHovered] = useState(false);
  const badgeStyle = model.badge ? BADGE_STYLES[model.badge] : null;

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
        gap: '0.8rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: model.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            flexShrink: 0,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {model.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>{model.name}</h3>
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
                }}
              >
                {model.badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{model.org}</div>
        </div>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{model.desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {model.tags.slice(0, 4).map(tag => (
          <span
            key={tag}
            style={{
              padding: '0.24rem 0.58rem',
              background: 'rgba(241, 249, 253, 0.92)',
              border: '1px solid rgba(71, 99, 119, 0.11)',
              borderRadius: '999px',
              fontSize: '0.7rem',
              color: 'var(--text2)',
              fontWeight: 600,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(71, 99, 119, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StarRating rating={model.rating} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent2)' }}>{model.price}</span>
        </div>
        <button
          onClick={() => onOpenDialog(model)}
          style={{
            padding: '0.48rem 0.9rem',
            background: hovered ? 'var(--gradient)' : 'var(--accent-lt)',
            color: hovered ? 'white' : 'var(--accent2)',
            border: '1px solid var(--accent-border)',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 700,
            fontFamily: 'inherit',
            boxShadow: hovered ? '0 14px 28px rgba(22,122,139,0.18)' : 'none',
          }}
        >
          Use in Chat Hub
        </button>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const { models, loading } = useModels();
  const allModels = models.length ? models : FALLBACK_MODELS;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeLab, setActiveLab] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [pricingFilter, setPricingFilter] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [licenseFilter, setLicenseFilter] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogModel, setDialogModel] = useState<AIModel>(FALLBACK_MODELS[0]);

  const toggleArr = (arr: string[], val: string): string[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const filtered = useMemo(() => {
    return allModels.filter(m => {
      const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.desc.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || (typeFilter === 'open' ? m.price === 'Free' : m.types.includes(typeFilter));
      const matchLab = !activeLab || m.lab === activeLab;
      const matchProvider = !selectedProviders.length || selectedProviders.includes(m.org);
      const matchPricing = !pricingFilter.length || (pricingFilter.includes('Free') && m.price === 'Free') || (pricingFilter.includes('Pay-per-use') && m.price !== 'Free' && !m.price.includes('/mo')) || (pricingFilter.includes('Subscription') && m.price.includes('/mo'));
      const matchRating = m.rating >= minRating;
      const matchLicense = !licenseFilter.length || (licenseFilter.includes('Open Source') && m.price === 'Free');
      return matchSearch && matchType && matchLab && matchProvider && matchPricing && matchRating && matchLicense;
    });
  }, [allModels, search, typeFilter, activeLab, selectedProviders, pricingFilter, minRating, licenseFilter]);

  const uniqueLabs = [...new Set(allModels.map(m => m.lab))];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(244,251,255,0.92), rgba(250,254,255,0.74))',
          border: '1px solid rgba(71, 99, 119, 0.12)',
          borderRadius: 'calc(var(--radius-xl) - 2px)',
          padding: '1.2rem 1.4rem',
          maxWidth: 1400,
          margin: '1.1rem auto 0',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.45rem', color: 'var(--text)', margin: 0 }}>Model Marketplace</h1>
          <div style={{ flex: 1, minWidth: 220, maxWidth: 430 }}>
            <input
              placeholder="Search models..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.62rem 0.95rem', border: '1px solid rgba(71, 99, 119, 0.14)', borderRadius: '999px', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit', background: 'rgba(250,254,255,0.85)', color: 'var(--text)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TYPE_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: typeFilter === f.id ? 'var(--accent)' : 'rgba(71, 99, 119, 0.12)',
                  background: typeFilter === f.id ? 'var(--gradient)' : 'rgba(250,254,255,0.76)',
                  color: typeFilter === f.id ? 'white' : 'var(--text2)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: typeFilter === f.id ? '0 12px 22px rgba(22,122,139,0.18)' : 'none',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          <button
            onClick={() => setActiveLab('')}
            style={{
              padding: '0.3rem 0.78rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: !activeLab ? 'var(--accent)' : 'rgba(71, 99, 119, 0.11)',
              background: !activeLab ? 'var(--accent-lt)' : 'rgba(250,254,255,0.76)',
              color: !activeLab ? 'var(--accent2)' : 'var(--text2)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            All Labs
          </button>
          {uniqueLabs.map(lab => (
            <button
              key={lab}
              onClick={() => setActiveLab(lab === activeLab ? '' : lab)}
              style={{
                padding: '0.3rem 0.78rem',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: activeLab === lab ? 'var(--accent)' : 'rgba(71, 99, 119, 0.11)',
                background: activeLab === lab ? 'var(--accent-lt)' : 'rgba(250,254,255,0.76)',
                color: activeLab === lab ? 'var(--accent2)' : 'var(--text2)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {lab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: 1400, margin: '0 auto', padding: '1.5rem' }}>
        <aside style={{ width: 230, flexShrink: 0, marginRight: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(180deg, rgba(250,254,255,0.95), rgba(240,249,253,0.88))', border: '1px solid rgba(71, 99, 119, 0.11)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.65rem' }}>Provider</h4>
            {LABS.slice(0, 8).map(lab => (
              <label key={lab} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text2)' }}>
                <input type="checkbox" checked={selectedProviders.includes(lab)} onChange={() => setSelectedProviders(p => toggleArr(p, lab))} style={{ accentColor: 'var(--accent)' }} />
                {lab}
              </label>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(180deg, rgba(250,254,255,0.95), rgba(240,249,253,0.88))', border: '1px solid rgba(71, 99, 119, 0.11)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.65rem' }}>Pricing</h4>
            {PRICING_OPTIONS.map(p => (
              <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text2)' }}>
                <input type="checkbox" checked={pricingFilter.includes(p)} onChange={() => setPricingFilter(prev => toggleArr(prev, p))} style={{ accentColor: 'var(--accent)' }} />
                {p}
              </label>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(180deg, rgba(250,254,255,0.95), rgba(240,249,253,0.88))', border: '1px solid rgba(71, 99, 119, 0.11)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.65rem' }}>Min Rating</h4>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {[0, 4.0, 4.3, 4.5, 4.7].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  style={{
                    padding: '0.24rem 0.58rem',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: minRating === r ? 'var(--accent)' : 'rgba(71, 99, 119, 0.11)',
                    background: minRating === r ? 'var(--accent-lt)' : 'rgba(250,254,255,0.78)',
                    color: minRating === r ? 'var(--accent2)' : 'var(--text2)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                  }}
                >
                  {r === 0 ? 'All' : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'linear-gradient(180deg, rgba(250,254,255,0.95), rgba(240,249,253,0.88))', border: '1px solid rgba(71, 99, 119, 0.11)', borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.65rem' }}>License</h4>
            {LICENSE_OPTIONS.map(l => (
              <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text2)' }}>
                <input type="checkbox" checked={licenseFilter.includes(l)} onChange={() => setLicenseFilter(prev => toggleArr(prev, l))} style={{ accentColor: 'var(--accent)' }} />
                {l}
              </label>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(180deg, rgba(250,254,255,0.95), rgba(240,249,253,0.88))', border: '1px solid rgba(71, 99, 119, 0.11)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.65rem' }}>Quick Guides</h4>
            {['Getting Started', 'API Reference', 'Pricing Guide', 'Model Comparison'].map(g => (
              <div key={g} style={{ fontSize: '0.78rem', color: 'var(--accent2)', marginBottom: 7, cursor: 'pointer', fontWeight: 600 }}>
                → {g}
              </div>
            ))}
          </div>
        </aside>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text3)', fontWeight: 600 }}>
            {loading ? 'Loading models...' : `${filtered.length} models found`}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
            {filtered.map(model => (
              <MCard key={model.id} model={model} onOpenDialog={m => { setDialogModel(m); setDialogOpen(true); }} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)', fontSize: '0.9rem' }}>
              No models match your filters.{' '}
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter('all');
                  setActiveLab('');
                  setSelectedProviders([]);
                  setPricingFilter([]);
                  setMinRating(0);
                  setLicenseFilter([]);
                }}
                style={{ color: 'var(--accent2)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <ModelDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        model={dialogModel}
      />
    </div>
  );
}
