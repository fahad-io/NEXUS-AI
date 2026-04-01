'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useModels } from '@/hooks/useModels';
import { FALLBACK_MODELS } from '@/lib/models-fallback';
import { AIModel } from '@/types';

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
  hot: { bg: '#FEF3C7', color: '#92400E' },
  new: { bg: '#DCFCE7', color: '#166534' },
  open: { bg: '#EDE9FE', color: '#5B21B6' },
  beta: { bg: '#FEE2E2', color: '#991B1B' },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#F59E0B' : '#D1D5DB', fontSize: '0.75rem' }}>★</span>
      ))}
      <span style={{ fontSize: '0.75rem', color: 'var(--text3)', marginLeft: 3 }}>{rating}</span>
    </span>
  );
}

function MCard({ model }: { model: AIModel }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const badgeStyle = model.badge ? BADGE_STYLES[model.badge] : null;

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
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: model.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{model.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>{model.name}</h3>
            {model.badge && badgeStyle && (
              <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 700, background: badgeStyle.bg, color: badgeStyle.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{model.badge}</span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{model.org}</div>
        </div>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.55, margin: 0 }}>{model.desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {model.tags.slice(0, 4).map(tag => (
          <span key={tag} style={{ padding: '0.2rem 0.55rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '2rem', fontSize: '0.7rem', color: 'var(--text2)' }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StarRating rating={model.rating} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)' }}>{model.price}</span>
        </div>
        <button
          onClick={() => router.push(`/chat?model=${model.id}`)}
          style={{ padding: '0.4rem 0.85rem', background: 'var(--accent-lt)', color: 'var(--accent)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'inherit' }}
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
      {/* Header Bar */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: 'var(--text)', margin: 0 }}>Model Marketplace</h1>
          <div style={{ flex: 1, minWidth: 200, maxWidth: 400 }}>
            <input
              placeholder="Search models..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.85rem', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--text)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TYPE_FILTERS.map(f => (
              <button key={f.id} onClick={() => setTypeFilter(f.id)} style={{ padding: '0.35rem 0.85rem', borderRadius: '2rem', border: '1px solid', borderColor: typeFilter === f.id ? 'var(--accent)' : 'var(--border2)', background: typeFilter === f.id ? 'var(--accent)' : 'var(--white)', color: typeFilter === f.id ? 'white' : 'var(--text2)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Labs Bar */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          <button onClick={() => setActiveLab('')} style={{ padding: '0.25rem 0.7rem', borderRadius: '2rem', border: '1px solid', borderColor: !activeLab ? 'var(--accent)' : 'var(--border)', background: !activeLab ? 'var(--accent-lt)' : 'var(--white)', color: !activeLab ? 'var(--accent)' : 'var(--text2)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>All Labs</button>
          {uniqueLabs.map(lab => (
            <button key={lab} onClick={() => setActiveLab(lab === activeLab ? '' : lab)} style={{ padding: '0.25rem 0.7rem', borderRadius: '2rem', border: '1px solid', borderColor: activeLab === lab ? 'var(--accent)' : 'var(--border)', background: activeLab === lab ? 'var(--accent-lt)' : 'var(--white)', color: activeLab === lab ? 'var(--accent)' : 'var(--text2)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {lab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: 1400, margin: '0 auto', padding: '1.5rem 1.5rem' }}>
        {/* Left Sidebar */}
        <aside style={{ width: 220, flexShrink: 0, marginRight: '1.5rem' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.6rem' }}>Provider</h4>
            {LABS.slice(0, 8).map(lab => (
              <label key={lab} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text2)' }}>
                <input type="checkbox" checked={selectedProviders.includes(lab)} onChange={() => setSelectedProviders(p => toggleArr(p, lab))} style={{ accentColor: 'var(--accent)' }} />
                {lab}
              </label>
            ))}
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.6rem' }}>Pricing</h4>
            {PRICING_OPTIONS.map(p => (
              <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text2)' }}>
                <input type="checkbox" checked={pricingFilter.includes(p)} onChange={() => setPricingFilter(prev => toggleArr(prev, p))} style={{ accentColor: 'var(--accent)' }} />
                {p}
              </label>
            ))}
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.6rem' }}>Min Rating</h4>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {[0, 4.0, 4.3, 4.5, 4.7].map(r => (
                <button key={r} onClick={() => setMinRating(r)} style={{ padding: '0.2rem 0.5rem', borderRadius: 6, border: '1px solid', borderColor: minRating === r ? 'var(--accent)' : 'var(--border)', background: minRating === r ? 'var(--accent-lt)' : 'none', color: minRating === r ? 'var(--accent)' : 'var(--text2)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                  {r === 0 ? 'All' : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.6rem' }}>License</h4>
            {LICENSE_OPTIONS.map(l => (
              <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text2)' }}>
                <input type="checkbox" checked={licenseFilter.includes(l)} onChange={() => setLicenseFilter(prev => toggleArr(prev, l))} style={{ accentColor: 'var(--accent)' }} />
                {l}
              </label>
            ))}
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.6rem' }}>Quick Guides</h4>
            {['Getting Started', 'API Reference', 'Pricing Guide', 'Model Comparison'].map(g => (
              <div key={g} style={{ fontSize: '0.78rem', color: 'var(--accent)', marginBottom: 6, cursor: 'pointer' }}>→ {g}</div>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text3)' }}>
            {loading ? 'Loading models...' : `${filtered.length} models found`}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
            {filtered.map(model => <MCard key={model.id} model={model} />)}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)', fontSize: '0.9rem' }}>
              No models match your filters. <button onClick={() => { setSearch(''); setTypeFilter('all'); setActiveLab(''); setSelectedProviders([]); setPricingFilter([]); setMinRating(0); setLicenseFilter([]); }} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
