'use client';

const RESEARCH_ITEMS = [
  { date: { day: 26, month: 'MAR' }, cat: 'Benchmark', title: 'Gemini 2.0 Pro achieves new SOTA on reasoning benchmarks', desc: 'Score 83.2% on MATH-500 with competitive performance across reasoning tasks.' },
  { date: { day: 22, month: 'MAR' }, cat: 'Research', title: 'Scaling laws for multimodal models: new empirical findings', desc: 'Research reveals consistent scaling behavior when combining vision and language data.' },
  { date: { day: 18, month: 'MAR' }, cat: 'Research', title: 'Constitutional AI vs. improved alignment through iterative refinement', desc: 'New study comparing alignment approaches shows RLHF variants outperform on nuanced tasks.' },
  { date: { day: 16, month: 'MAR' }, cat: 'Model', title: 'Llama 4 Scout & Maverick: natively multimodal from the ground up', desc: 'Meta releases two new open models combining text, image, and audio in a single architecture.' },
  { date: { day: 10, month: 'MAR' }, cat: 'Research', title: 'Long-context recall: how models handle 4M token windows', desc: 'Comprehensive evaluation shows recall performance drops beyond 500K tokens for most models.' },
  { date: { day: 5, month: 'MAR' }, cat: 'Benchmark', title: 'DeepSeek-R1 open weights: reproducing frontier reasoning at minimal cost', desc: 'Full weight release enabling self-hosted fine-tuning at a fraction of the frontier model cost.' },
  { date: { day: 1, month: 'MAR' }, cat: 'Model', title: 'Mistral releases Codestral Mamba for ultra-fast code completion', desc: 'SSM-based architecture enables 10x faster inference than transformer models of similar size.' },
  { date: { day: 25, month: 'FEB' }, cat: 'Research', title: 'Prompt injection attacks: new defense strategies for production LLMs', desc: 'Systematic evaluation of 12 defense mechanisms against adversarial prompt injection vectors.' },
];

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  Benchmark: { bg: '#EDE9FE', color: '#5B21B6' },
  Research: { bg: '#DCFCE7', color: '#166534' },
  Model: { bg: '#FEF3C7', color: '#92400E' },
};

export default function DiscoverPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '1.5rem 2.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--accent-lt)', border: '1px solid var(--accent-border)', borderRadius: '2rem', padding: '0.3rem 0.8rem', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
            📡 Live Research Feed
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.8rem', color: 'var(--text)', marginBottom: '0.4rem' }}>AI Research Feed</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Stay up to date with the latest AI research, model releases, and benchmarks.</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {RESEARCH_ITEMS.map((item, i) => {
            const catColor = CAT_COLORS[item.cat] || { bg: 'var(--bg)', color: 'var(--text2)' };
            return (
              <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', gap: '1.25rem', transition: 'box-shadow 0.2s' }}>
                {/* Date */}
                <div style={{ flexShrink: 0, width: 52, textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: 'var(--text)', lineHeight: 1 }}>{item.date.day}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{item.date.month}</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 700, background: catColor.bg, color: catColor.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.cat}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.4rem', lineHeight: 1.4 }}>{item.title}</h3>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.55, marginBottom: '0.6rem' }}>{item.desc}</p>
                  <a href="#" style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Read more →</a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button style={{ padding: '0.65rem 1.75rem', background: 'var(--white)', border: '1px solid var(--border2)', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
            Load more articles
          </button>
        </div>
      </div>
    </div>
  );
}
