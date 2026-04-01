'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import ModelCard from '@/components/ui/ModelCard';
import { toast } from '@/components/ui/Toast';
import { FALLBACK_MODELS } from '@/lib/models-fallback';

const ARROW = '\u2192';

const ICONS = {
  brain: '\u{1F9E0}',
  palette: '\u{1F3A8}',
  music: '\u{1F3B5}',
  video: '\u{1F3AC}',
  clipboard: '\u{1F4CB}',
  chart: '\u{1F4C8}',
  write: '\u270D\uFE0F',
  laptop: '\u{1F4BB}',
  doc: '\u{1F4C4}',
  globe: '\u{1F310}',
  bars: '\u{1F4CA}',
  question: '\u2753',
  fileBox: '\u{1F5C2}\uFE0F',
  compass: '\u{1F9ED}',
  ruler: '\u{1F4D0}',
  robot: '\u{1F916}',
  money: '\u{1F4B0}',
  star: '\u2B50',
  microscope: '\u{1F52C}',
  sparkles: '\u2726',
  trophy: '\u{1F3C6}',
  scales: '\u2696\uFE0F',
  speaker: '\u{1F50A}',
  free: '\u{1F193}',
  fire: '\u{1F525}',
  lock: '\u{1F512}',
  rocket: '\u{1F680}',
  bulb: '\u{1F4A1}',
  wand: '\u2728',
  greenDot: '\u{1F7E2}',
  blueDiamond: '\u{1F537}',
  moon: '\u{1F319}',
  pin: '\u{1F4CC}',
  image: '\u{1F5BC}\uFE0F',
  camera: '\u{1F4F7}',
  paperclip: '\u{1F4CE}',
  mic: '\u{1F3A4}',
  lab: '\u2697\uFE0F',
};

const BADGE_TONES = {
  teal: { background: 'var(--teal-lt)', color: 'var(--teal)' },
  amber: { background: 'var(--amber-lt)', color: 'var(--amber)' },
  blue: { background: 'var(--blue-lt)', color: 'var(--blue)' },
  rose: { background: 'var(--rose-lt)', color: 'var(--rose)' },
} as const;

const SPEED_TONES = {
  fast: { dot: '#22c55e', color: 'var(--green)', label: 'Fast' },
  moderate: { dot: '#f59e0b', color: 'var(--amber)', label: 'Moderate' },
  fastest: { dot: '#2a6fbb', color: 'var(--blue)', label: 'Fastest' },
} as const;

const BUDGET_TONES = {
  teal: { background: 'var(--teal-lt)', border: 'rgba(19, 138, 123, 0.16)', color: 'var(--teal)' },
  blue: { background: 'var(--blue-lt)', border: 'var(--blue-border)', color: 'var(--blue)' },
  amber: { background: 'var(--amber-lt)', border: 'rgba(155, 107, 50, 0.16)', color: 'var(--amber)' },
  accent: { background: 'var(--accent-lt)', border: 'var(--accent-border)', color: 'var(--accent2)' },
} as const;

const ACTION_GRID = [
  { label: 'Create image', icon: ICONS.palette },
  { label: 'Generate audio', icon: ICONS.music },
  { label: 'Create video', icon: ICONS.video },
  { label: 'Create slides', icon: ICONS.clipboard },
  { label: 'Analyze data', icon: ICONS.chart },
  { label: 'Write content', icon: ICONS.write },
  { label: 'Code generation', icon: ICONS.laptop },
  { label: 'Document analysis', icon: ICONS.doc },
  { label: 'Translate', icon: ICONS.globe },
  { label: 'Create infographics', icon: ICONS.bars },
  { label: 'Create quiz', icon: ICONS.question },
  { label: 'Create flashcards', icon: ICONS.fileBox },
  { label: 'Just exploring', icon: ICONS.compass },
];

const HERO_STATS = [
  { val: '525+', label: 'AI Models' },
  { val: '82K', label: 'Builders' },
  { val: '28', label: 'AI Labs' },
  { val: '4.8', label: 'Avg Rating' },
];

const BUILDER_FEATURES = [
  {
    icon: ICONS.compass,
    title: 'Guided Discovery Chat',
    desc: "I'll greet you, ask about your goals, and have a genuine conversation before recommending models. No overwhelming lists.",
    href: '/chat',
  },
  {
    icon: ICONS.ruler,
    title: 'Prompt Engineering Guide',
    desc: 'Every model includes tailored prompt templates, principles, and examples so you get the best output from day one.',
    href: '/marketplace',
  },
  {
    icon: ICONS.robot,
    title: 'Agent Builder',
    desc: 'Step-by-step agent creation guides for every model: system prompts, tool configuration, memory setup, and deployment.',
    href: '/agents',
  },
  {
    icon: ICONS.money,
    title: 'Flexible Pricing',
    desc: 'Free tiers, pay-per-use, subscriptions, and enterprise plans with transparent pricing and no hidden fees.',
    href: '/marketplace',
  },
  {
    icon: ICONS.star,
    title: 'User Reviews & Ratings',
    desc: 'Verified reviews from real builders, benchmark scores, and detailed I/O specs to help you choose confidently.',
    href: '/marketplace',
  },
  {
    icon: ICONS.microscope,
    title: 'Research Feed',
    desc: 'Daily curated AI research, model releases, and breakthroughs from top labs so you stay ahead of the curve.',
    href: '/discover',
  },
];

const LAB_CARDS = [
  { icon: ICONS.brain, name: 'OpenAI', meta: '3 models: GPT-5.4, Sora 2' },
  { icon: '\u26A1', name: 'Anthropic', meta: '3 models: Opus, Sonnet, Haiku' },
  { icon: ICONS.microscope, name: 'Google DeepMind', meta: '5 models: Gemini 3.1, Veo 3' },
  { icon: 'X', name: 'xAI (Grok)', meta: '2 models: Grok-4-1, Grok-Imagine' },
  { icon: ICONS.laptop, name: 'DeepSeek', meta: '3 models: V3, V3.2, R1' },
  { icon: '\u{1F999}', name: 'Meta (Llama)', meta: '2 models: Maverick, Scout' },
  { icon: '\u2318', name: 'Alibaba (Qwen)', meta: '2 models: Qwen3-Max, Coder' },
  { icon: '\u{1F300}', name: 'Mistral', meta: '2 models: Devstral 2, Medium 3.1' },
  { icon: ICONS.greenDot, name: 'NVIDIA NIM', meta: '4 models: Nemotron Ultra, Nano' },
  { icon: ICONS.blueDiamond, name: 'GLM (Zhipu)', meta: '3 models: GLM-5, 4.7, 4.6V' },
  { icon: ICONS.moon, name: 'Moonshot (Kimi)', meta: '2 models: k2.5, k2-Thinking' },
];

const COMPARISON_ROWS = [
  { icon: ICONS.brain, model: 'GPT-5.4', lab: 'OpenAI', context: '1.05M', input: '$2.50', output: '$15', multimodal: true, speed: 'fast', bestFor: 'High-precision professional tasks' },
  { icon: '\u{1F451}', model: 'Claude Opus 4.6', lab: 'Anthropic', context: '200K / 1M beta', input: '$5', output: '$25', multimodal: true, speed: 'moderate', bestFor: 'Agents, advanced coding' },
  { icon: '\u26A1', model: 'Claude Sonnet 4.6', lab: 'Anthropic', context: '200K / 1M beta', input: '$3', output: '$15', multimodal: true, speed: 'fast', bestFor: 'Code, data, content at scale' },
  { icon: ICONS.rocket, model: 'Claude Haiku 4.5', lab: 'Anthropic', context: '200K', input: '$1', output: '$5', multimodal: true, speed: 'fastest', bestFor: 'Real-time, high-volume' },
  { icon: ICONS.microscope, model: 'Gemini 3.1 Pro', lab: 'Google', context: '2M - 5M', input: '$2', output: '$12', multimodal: true, speed: 'moderate', bestFor: 'Deep reasoning, long context' },
  { icon: '\u26A1', model: 'Gemini 3.1 Flash', lab: 'Google', context: '1M', input: '$2', output: '$12', multimodal: true, speed: 'moderate', bestFor: 'High-volume chat and coding' },
  { icon: ICONS.bulb, model: 'Gemini 3.1 Flash-Lite', lab: 'Google', context: '1M', input: '$0.10', output: '$0.40', multimodal: true, speed: 'fastest', bestFor: 'Low-cost agents and translation' },
  { icon: 'X', model: 'Grok-4-1 Fast', lab: 'xAI', context: '2000K', input: '$0.20', output: '$0.50', multimodal: true, speed: 'moderate', bestFor: 'Real-time X data analysis' },
  { icon: ICONS.laptop, model: 'DeepSeek-V3', lab: 'DeepSeek', context: '128K', input: '~$0.07', output: '~$0.28', multimodal: true, speed: 'moderate', bestFor: 'Budget general model' },
  { icon: '\u{1F999}', model: 'Llama 4 Maverick', lab: 'Meta', context: '128K', input: 'Free', output: 'Free', multimodal: true, speed: 'moderate', bestFor: 'Open-source multimodal' },
  { icon: '\u2318', model: 'Qwen3-Max', lab: 'Alibaba', context: '128K', input: '$0.40', output: '$1.20', multimodal: true, speed: 'moderate', bestFor: 'Multilingual / APAC' },
];

const TRENDING_ITEMS = [
  {
    badge: `${ICONS.free} Just Released`,
    tone: 'teal',
    lab: 'Anthropic',
    title: 'Claude Opus 4.6 & Sonnet 4.6',
    desc: 'Adaptive Thinking and 1M token context mark a major leap in agent capability. Now the most intelligent Claude for coding and agentic tasks.',
  },
  {
    badge: `${ICONS.fire} Hot`,
    tone: 'amber',
    lab: 'Google DeepMind',
    title: 'Gemini 3.1 Pro - Thought Signatures',
    desc: 'Thought Signatures bring new transparency to deep reasoning. The 5M context window makes it a go-to for ultra-long document analysis.',
  },
  {
    badge: `${ICONS.robot} Computer Use`,
    tone: 'blue',
    lab: 'OpenAI',
    title: 'GPT-5.4 - Native Computer-Use Agents',
    desc: 'GPT-5.4 introduces native computer-use agents that can operate browsers, apps, and files with stronger reasoning efficiency.',
  },
  {
    badge: '\u26A1 Real-Time',
    tone: 'rose',
    lab: 'xAI',
    title: 'Grok-4-1 Fast - 4-Agent Architecture',
    desc: "Grok's 4-agent architecture with real-time X data access and 2M context makes it unique for live analysis tasks.",
  },
  {
    badge: `${ICONS.lock} Open Source`,
    tone: 'blue',
    lab: 'Meta',
    title: 'Llama 4 Maverick - 400B MoE',
    desc: "Meta's 400B Mixture-of-Experts model brings native multimodal understanding and a full commercial self-hosting path.",
  },
  {
    badge: `${ICONS.laptop} Coding`,
    tone: 'teal',
    lab: 'Mistral',
    title: 'Devstral 2 - Fastest Coding Agent',
    desc: 'Mistral builds for coding with 256K context, multi-file editing, and codebase navigation for rapid engineering workflows.',
  },
];

const BUDGET_BUCKETS = [
  {
    icon: ICONS.free,
    title: 'Free & Open Source',
    desc: 'Llama 4 Maverick, Llama 4 Scout, DeepSeek-V3, and DeepSeek-R1 let teams self-host with zero API cost.',
    meta: '6 models available',
    tone: 'teal',
  },
  {
    icon: ICONS.money,
    title: 'Budget - Under $0.50/1M',
    desc: 'Gemini 3.1 Flash-Lite, Mistral Medium, and Nemotron Nano deliver the best performance per dollar.',
    meta: '9 models available',
    tone: 'blue',
  },
  {
    icon: ICONS.scales,
    title: 'Mid-Range - $1-$5/1M',
    desc: 'Claude Sonnet 4.6, Claude Haiku 4.5, Gemini 3.1 Pro, GPT-5.4, and Qwen3-Max balance cost and quality.',
    meta: '11 models available',
    tone: 'amber',
  },
  {
    icon: ICONS.trophy,
    title: 'Premium - $5+/1M',
    desc: 'Claude Opus 4.6, Sora 2 Pro, and gpt-image-1.5 focus on top-tier quality for demanding workloads.',
    meta: '5 models available',
    tone: 'accent',
  },
];

const QUICK_STARTS = [
  { icon: ICONS.laptop, title: 'Code Generation', models: 'Claude Opus 4.6, Devstral 2, GPT-5.4, Qwen3-Coder', cta: 'Start building', href: '/chat' },
  { icon: ICONS.palette, title: 'Image Generation', models: 'gpt-image-1.5, Grok-Imagine-Pro, Gemini Flash Image', cta: 'Create images', href: '/chat' },
  { icon: ICONS.robot, title: 'AI Agents', models: 'GPT-5.4, Claude Opus 4.6, kimi-k2.5, Grok-4-1', cta: 'Build agents', href: '/agents' },
  { icon: ICONS.doc, title: 'Document Analysis', models: 'Claude Sonnet 4.6, Gemini 3.1 Pro, Nemotron Ultra', cta: 'Analyze docs', href: '/chat' },
  { icon: ICONS.video, title: 'Video Generation', models: 'Sora 2 Pro, Veo 3.1, Grok-Imagine-Video', cta: 'Create video', href: '/chat' },
  { icon: ICONS.speaker, title: 'Voice & Audio', models: 'Gemini-TTS, ElevenLabs, Whisper v3', cta: 'Add voice', href: '/chat' },
  { icon: '\u{1F30D}', title: 'Multilingual / Translation', models: 'Qwen3-Max, Gemini 3.1 Flash-Lite, GLM-4.7', cta: 'Go multilingual', href: '/chat' },
  { icon: '\u{1F522}', title: 'Math & Research', models: 'DeepSeek-R1, QwQ-32B, Gemini 3.1 Pro', cta: 'Start researching', href: '/discover' },
];

function SectionHeader({
  title,
  description,
  linkHref,
  linkLabel,
}: {
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="landing-section-header">
      <div className="landing-section-copy">
        <h2 className="landing-section-title">{title}</h2>
        {description ? <p className="landing-section-description">{description}</p> : null}
      </div>
      {linkHref && linkLabel ? (
        <Link href={linkHref} className="landing-section-link">
          {linkLabel} {ARROW}
        </Link>
      ) : null}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const popularModels = FALLBACK_MODELS.slice(0, 6);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newsletterEmail.trim();

    if (!trimmed) {
      toast('Enter an email address to subscribe.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast('Enter a valid email address.', 'error');
      return;
    }

    toast("You're subscribed to NexusAI Weekly.", 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="landing-page">
      <Navbar />

      <main className="landing-main">
        <section className="landing-shell landing-hero">
          <div className="landing-hero-badge">
            <span className="landing-live-dot" />
            All models live | Updated hourly
          </div>

          <h1 className="landing-hero-title">
            Find your perfect <span>AI model</span>
            <br />
            with guided discovery
          </h1>

          <p className="landing-hero-copy">
            Compare leading models by performance, cost, and capability, then move straight into chat, agents, or research with one clean workflow.
          </p>

          <div className="landing-hero-search">
            <div className="landing-hero-search-row">
              <input
                readOnly
                value=""
                placeholder="Describe your project, use case, or workflow..."
                className="landing-hero-input"
                onClick={() => router.push('/chat')}
              />

              <div className="landing-hero-tools" aria-hidden="true">
                {[ICONS.mic, ICONS.paperclip, ICONS.image, ICONS.camera].map(icon => (
                  <span key={icon} className="landing-hero-tool">
                    {icon}
                  </span>
                ))}
              </div>

              <button type="button" className="landing-primary-button" onClick={() => router.push('/chat')}>
                Ask AI {ARROW}
              </button>
            </div>

            <div className="landing-chip-row">
              {ACTION_GRID.map(action => (
                <button
                  key={action.label}
                  type="button"
                  className="landing-chip"
                  onClick={() => router.push(action.label === 'Just exploring' ? '/discover' : '/chat')}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="landing-stats">
            {HERO_STATS.map(stat => (
              <div key={stat.label} className="landing-stat-card">
                <strong>{stat.val}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-shell landing-section">
          <SectionHeader title="Featured Models" linkHref="/marketplace" linkLabel="Browse all" />
          <div className="landing-model-grid">
            {popularModels.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </section>

        <section className="landing-shell landing-section">
          <SectionHeader title="Built for every builder" />
          <div className="landing-feature-grid">
            {BUILDER_FEATURES.map(feature => (
              <Link key={feature.title} href={feature.href} className="landing-card landing-feature-card">
                <span className="landing-card-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="landing-band">
          <div className="landing-shell landing-section">
            <SectionHeader title="Browse by AI Lab" linkHref="/marketplace" linkLabel="See all labs" />
            <div className="landing-lab-grid">
              {LAB_CARDS.map(lab => (
                <Link key={lab.name} href="/marketplace" className="landing-card landing-lab-card">
                  <span className="landing-lab-icon">{lab.icon}</span>
                  <h3>{lab.name}</h3>
                  <p>{lab.meta}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-shell landing-section">
          <SectionHeader
            title="Flagship Model Comparison"
            description="Side-by-side pricing and capability snapshots for the leading frontier models across the major labs."
            linkHref="/marketplace"
            linkLabel="Compare all"
          />

          <div className="landing-comparison-wrap">
            <table className="landing-comparison-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Lab</th>
                  <th>Context</th>
                  <th>Input $/1M</th>
                  <th>Output $/1M</th>
                  <th>Multimodal</th>
                  <th>Speed</th>
                  <th>Best for</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(row => {
                  const speedTone = SPEED_TONES[row.speed as keyof typeof SPEED_TONES];

                  return (
                    <tr key={row.model}>
                      <td>
                        <div className="landing-table-model">
                          <span className="landing-table-icon">{row.icon}</span>
                          <span>{row.model}</span>
                        </div>
                      </td>
                      <td>{row.lab}</td>
                      <td>{row.context}</td>
                      <td className="landing-table-price">{row.input}</td>
                      <td className="landing-table-price">{row.output}</td>
                      <td className="landing-table-center">{row.multimodal ? 'Yes' : 'No'}</td>
                      <td>
                        <span className="landing-speed-pill" style={{ color: speedTone.color }}>
                          <span className="landing-speed-dot" style={{ background: speedTone.dot }} />
                          {speedTone.label}
                        </span>
                      </td>
                      <td>{row.bestFor}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="landing-footnote">
            * Prices are directional and can change. Free self-hosted options exclude infrastructure cost.
          </p>
        </section>

        <section className="landing-band">
          <div className="landing-shell landing-section">
            <SectionHeader title="Trending This Week" linkHref="/discover" linkLabel="View research feed" />
            <div className="landing-trending-grid">
              {TRENDING_ITEMS.map(item => {
                const tone = BADGE_TONES[item.tone as keyof typeof BADGE_TONES];

                return (
                  <Link key={item.title} href="/discover" className="landing-card landing-trending-card">
                    <div className="landing-trending-meta">
                      <span className="landing-tag" style={{ background: tone.background, color: tone.color }}>
                        {item.badge}
                      </span>
                      <span className="landing-trending-lab">{item.lab}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="landing-shell landing-section">
          <SectionHeader title="Find Models by Budget" />
          <div className="landing-budget-grid">
            {BUDGET_BUCKETS.map(bucket => {
              const tone = BUDGET_TONES[bucket.tone as keyof typeof BUDGET_TONES];

              return (
                <Link
                  key={bucket.title}
                  href="/marketplace"
                  className="landing-budget-card"
                  style={{ background: tone.background, borderColor: tone.border }}
                >
                  <span className="landing-card-icon" style={{ color: tone.color }}>
                    {bucket.icon}
                  </span>
                  <h3 style={{ color: tone.color }}>{bucket.title}</h3>
                  <p>{bucket.desc}</p>
                  <span className="landing-budget-link" style={{ color: tone.color }}>
                    {bucket.meta} {ARROW}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="landing-band">
          <div className="landing-shell landing-section">
            <SectionHeader title="Quick-Start by Use Case" />
            <div className="landing-quick-grid">
              {QUICK_STARTS.map(item => (
                <Link key={item.title} href={item.href} className="landing-card landing-quick-card">
                  <span className="landing-card-icon">{item.icon}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.models}</p>
                    <span className="landing-quick-link">
                      {item.cta} {ARROW}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-newsletter">
          <div className="landing-newsletter-inner">
            <span className="landing-newsletter-eyebrow">Stay ahead of the curve</span>
            <h2>
              New models drop every week.
              <br />
              Don&apos;t miss a release.
            </h2>
            <p>
              Get a curated weekly digest with model launches, pricing changes, benchmark shifts, and practical prompt engineering notes.
            </p>

            <form className="landing-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={newsletterEmail}
                onChange={event => setNewsletterEmail(event.target.value)}
                className="landing-newsletter-input"
              />
              <button type="submit" className="landing-newsletter-button">
                Subscribe free {ARROW}
              </button>
            </form>

            <span className="landing-newsletter-note">
              No spam. Unsubscribe any time. Trusted by 82K+ builders.
            </span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span className="landing-footer-brand">NexusAI Model Marketplace</span>
          <div className="landing-footer-links">
            <Link href="/marketplace">Models</Link>
            <Link href="/discover">Research</Link>
            <button type="button" onClick={() => toast('API docs are coming soon.', 'info')}>
              API
            </button>
            <button type="button" onClick={() => toast('Privacy policy page is coming soon.', 'info')}>
              Privacy
            </button>
            <button type="button" onClick={() => toast('Terms page is coming soon.', 'info')}>
              Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
