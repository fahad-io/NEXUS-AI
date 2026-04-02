'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AIModel } from '@/types';

const TABS = ['Overview', 'How to Use', 'Pricing', 'Prompt Guide', 'Agent Creation', 'Reviews'] as const;
type Tab = typeof TABS[number];

const TAG_ICONS: Record<string, string> = {
  Flagship: '🏆', Agents: '🤖', Multimodal: '🌐', Reasoning: '🧠',
  Vision: '👁️', Code: '💻', Analysis: '📊', Translation: '🌍',
  Education: '🎓', Fast: '⚡', 'Image Gen': '🎨', Audio: '🔊',
  Math: '📐', RAG: '🔗', 'Long context': '📄', Multilingual: '🗣️',
  'Open Source': '📖', 'Real-time': '📡', Large: '🔭', Compact: '🔬',
  Efficient: '⚙️', Balanced: '⚖️', Creative: '✨', Thinking: '💭',
};

interface Props {
  open: boolean;
  onClose: () => void;
  model: AIModel;
}

export default function ModelDetailDialog({ open, onClose, model }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Overview');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => { if (open) setTab('Overview'); }, [open, model.id]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const copyText = useCallback((text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1800);
    });
  }, []);

  if (!open) return null;

  const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
    hot: { bg: '#fff1c7', color: '#8d6727' },
    new: { bg: '#e2f6ef', color: '#1c6a55' },
    open: { bg: '#e9f2ff', color: '#295f9c' },
    beta: { bg: '#e7f5fb', color: '#0f5d6b' },
  };
  const badgeStyle = model.badge ? BADGE_STYLES[model.badge] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(18, 35, 50, 0.48)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          animation: 'backdropIn 0.2s ease',
        }}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(840px, 94vw)',
          maxHeight: '88vh',
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1001,
          animation: 'dialogIn 0.22s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem 1.75rem 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: 54, height: 54, borderRadius: 16,
              background: model.bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '1.65rem', flexShrink: 0,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
            }}>
              {model.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.35rem', color: 'var(--text)', margin: 0 }}>
                  {model.name}
                </h2>
                {model.badge && badgeStyle && (
                  <span style={{
                    padding: '0.22rem 0.65rem', background: badgeStyle.bg,
                    color: badgeStyle.color, borderRadius: 999,
                    fontSize: '0.68rem', fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {model.badge}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: 3 }}>
                by {model.org} · {model.tags[0]} model
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              style={{
                background: 'none', border: '1px solid var(--border)',
                cursor: 'pointer', width: 34, height: 34, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', color: 'var(--text3)', flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: t === tab ? '2px solid var(--accent)' : '2px solid transparent',
                  padding: '0.6rem 1.05rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '0.85rem',
                  fontWeight: t === tab ? 700 : 500,
                  color: t === tab ? 'var(--accent)' : 'var(--text2)',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem' }}>
          {tab === 'Overview'       && <OverviewTab model={model} />}
          {tab === 'How to Use'     && <HowToUseTab model={model} />}
          {tab === 'Pricing'        && <PricingTab model={model} />}
          {tab === 'Prompt Guide'   && <PromptGuideTab copyText={copyText} copiedIndex={copiedIndex} />}
          {tab === 'Agent Creation' && (
            <AgentCreationTab
              model={model}
              onOpenAgentBuilder={() => { onClose(); router.push('/agents'); }}
            />
          )}
          {tab === 'Reviews' && <ReviewsTab model={model} />}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────── Overview ─────────────────────────────── */

function getInputLabel(model: AIModel) {
  if (model.category === 'image') return 'Text prompts';
  const parts = ['Text'];
  if (model.types.includes('vision')) parts.push('images');
  if (model.types.includes('audio')) parts.push('audio');
  if (model.context !== 'N/A') parts.push('PDFs');
  return parts.join(', ');
}

function getOutputLabel(model: AIModel) {
  if (model.category === 'image') return 'Images';
  if (model.category === 'audio') return 'Audio';
  return 'Text, code, structured data';
}

function getExamplePrompt(model: AIModel) {
  if (model.types.includes('code')) return 'Review this function for edge cases, suggest improvements, and add type annotations.';
  if (model.category === 'image') return 'Create a photorealistic image of a futuristic city at dawn with flying vehicles.';
  if (model.category === 'audio') return 'Transcribe this 3-minute audio file and highlight key action items.';
  return 'Summarize this research paper in 3 bullet points and suggest 2 follow-up questions.';
}

function getExampleBullets(model: AIModel): [string, string] {
  if (model.types.includes('code')) return [
    'Found 2 potential null-dereference issues in lines 14 and 27.',
    'Recommend optional chaining (?.) and stricter input validation.',
  ];
  if (model.category === 'image') return [
    'Generated a 1792×1024 image with 94% prompt-adherence score.',
    'Consistent lighting, depth-of-field, and photorealistic textures applied.',
  ];
  return [
    'The paper introduces a new attention mechanism reducing compute by 40%.',
    'Results on MMLU show a 3.2% improvement over the previous baseline.',
  ];
}

function OverviewTab({ model }: { model: AIModel }) {
  const useCases = model.tags.slice(0, 6).map(tag => ({
    icon: TAG_ICONS[tag] ?? '✨',
    label: tag,
  }));
  const [b1, b2] = getExampleBullets(model);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <InfoBox label="Description">
          <p style={{ fontSize: '0.84rem', color: 'var(--text2)', lineHeight: 1.65, margin: 0 }}>{model.desc}</p>
        </InfoBox>
        <InfoBox label="Input / Output">
          <div style={{ fontSize: '0.83rem', color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
            <div><b style={{ color: 'var(--text)' }}>Input:</b> {getInputLabel(model)}</div>
            <div><b style={{ color: 'var(--text)' }}>Output:</b> {getOutputLabel(model)}</div>
            <div><b style={{ color: 'var(--text)' }}>Context:</b> {model.context}</div>
            <div><b style={{ color: 'var(--text)' }}>Max output:</b> 4,096 tokens</div>
            <div><b style={{ color: 'var(--text)' }}>Latency:</b> ~{model.latency} avg</div>
          </div>
        </InfoBox>
      </div>

      <InfoBox label="Use Cases">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.55rem' }}>
          {useCases.map(uc => (
            <div key={uc.label} style={{
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.75rem',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <span style={{ fontSize: '1rem' }}>{uc.icon}</span>
              <span style={{ fontSize: '0.79rem', fontWeight: 600, color: 'var(--text2)' }}>{uc.label}</span>
            </div>
          ))}
        </div>
      </InfoBox>

      <InfoBox label="Example Prompt → Output">
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>USER</div>
        <div style={{
          background: 'var(--white)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: '0.7rem 0.85rem',
          fontSize: '0.84rem', color: 'var(--text)', fontStyle: 'italic', marginBottom: '0.75rem',
        }}>
          &ldquo;{getExamplePrompt(model)}&rdquo;
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
          {model.name.toUpperCase()}
        </div>
        <div style={{
          background: 'var(--accent-lt)', border: '1px solid var(--accent-border)',
          borderRadius: 'var(--radius-sm)', padding: '0.7rem 0.85rem',
          fontSize: '0.84rem', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.3rem',
        }}>
          <div>· {b1}</div>
          <div>· {b2}</div>
        </div>
      </InfoBox>
    </div>
  );
}

/* ──────────────────────────── How to Use ──────────────────────────────── */

function HowToUseTab({ model }: { model: AIModel }) {
  const code = `import nexusai
client = nexusai.Client(api_key="YOUR_KEY")
response = client.chat(
    model="${model.id}",
    messages=[{"role":"user","content":"Hello!"}]
)
print(response.content)`;

  const steps = [
    {
      title: 'Get API Access',
      body: 'Sign up for a NexusAI account (free). Navigate to Settings → API Keys and create a new key. Your key grants access to all models in the marketplace — no separate accounts needed.',
    },
    {
      title: 'Choose your integration method',
      body: 'Options: (a) NexusAI REST API — simple HTTP requests from any language, (b) Official SDK — Python, Node.js, Go packages available, (c) No-code — use the built-in Playground or connect via Zapier / Make.',
      code,
    },
    {
      title: 'Understand input and output formats',
      body: `This model accepts ${getInputLabel(model)} as input. Outputs are ${getOutputLabel(model)}. The context window is ${model.context}. For long documents, consider chunking content into sections.`,
    },
    {
      title: 'Set parameters for your use case',
      body: 'Key parameters: temperature (0 = deterministic, 1 = creative), max_tokens (controls output length), system (sets model persona and behaviour). Start with temperature 0.3–0.7 for most applications.',
    },
    {
      title: 'Test in the Playground first',
      body: 'Use the NexusAI Playground to experiment before coding. Try edge cases and verify output format. The Playground shows token usage, latency metrics, and lets you compare models side by side.',
    },
    {
      title: 'Deploy and monitor',
      body: 'Go live using the NexusAI dashboard. Monitor latency, token spend, and error rates in real time. Set up alerts for quota usage and use the logging API for full request/response traceability.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <p style={{ fontSize: '0.88rem', color: 'var(--text2)', margin: 0 }}>
        Follow these steps to integrate and start getting value from this model in minutes.
      </p>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 999,
            background: 'var(--gradient)',
            color: 'white', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800,
            flexShrink: 0, marginTop: 2,
          }}>
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{step.title}</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.65 }}>{step.body}</div>
            {step.code && (
              <div style={{ marginTop: '0.7rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                  Quick Start (Python)
                </div>
                <pre style={{ fontFamily: 'monospace', fontSize: '0.79rem', color: 'var(--accent2)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {step.code}
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────── Pricing ──────────────────────────────── */

function PricingTab({ model }: { model: AIModel }) {
  const isFree = model.price === 'Free' || model.price_start === 0;
  const base = model.price_start;

  const tiers = [
    {
      label: 'PAY-PER-USE',
      price: isFree ? 'Free' : `$${base}`,
      sub: isFree ? '' : 'per 1M input tokens',
      features: isFree
        ? ['No rate limits', 'Standard support', `${model.context} context`, 'Community access']
        : [`$${(base * 3).toFixed(2)}/1M output tokens`, `${model.context} context`, 'Rate: 500 RPM', 'Standard support'],
      highlighted: false,
    },
    {
      label: 'PRO SUBSCRIPTION',
      price: isFree ? '$9' : `$${Math.max(Math.round(base * 6), 29)}`,
      sub: 'per month',
      features: isFree
        ? ['Everything in Free', '10,000 RPM', 'Priority support', 'Usage dashboard']
        : [
            `$${(base * 0.6).toFixed(2)}/1M input tokens`,
            `$${(base * 1.8).toFixed(2)}/1M output tokens`,
            `${model.context} context`,
            'Rate: 3,000 RPM',
            'Priority support',
            'Usage dashboard',
          ],
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      label: 'ENTERPRISE',
      price: 'Custom',
      sub: 'negotiated pricing',
      features: ['Volume discounts', 'Dedicated capacity', 'Fine-tuning access', 'Unlimited RPM', 'SLA & compliance', 'Dedicated CSM'],
      highlighted: false,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      <p style={{ fontSize: '0.88rem', color: 'var(--text2)', margin: 0 }}>
        Choose the plan that fits your usage. All plans include API access, documentation, and community support.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.9rem' }}>
        {tiers.map(tier => (
          <div
            key={tier.label}
            style={{
              border: tier.highlighted ? '2px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.2rem',
              position: 'relative',
              background: tier.highlighted
                ? 'linear-gradient(180deg, rgba(22,122,139,0.03), rgba(22,122,139,0.07))'
                : 'var(--white)',
            }}
          >
            {tier.badge && (
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--accent)', color: 'white',
                fontSize: '0.65rem', fontWeight: 800, padding: '0.18rem 0.65rem',
                borderRadius: 999, letterSpacing: '0.04em', whiteSpace: 'nowrap',
              }}>
                {tier.badge}
              </div>
            )}
            <div style={{ fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {tier.label}
            </div>
            <div style={{ fontSize: tier.price === 'Custom' ? '1.6rem' : '2rem', fontWeight: 800, fontFamily: "'Syne', sans-serif", color: 'var(--text)', lineHeight: 1.1 }}>
              {tier.price}
            </div>
            {tier.sub && <div style={{ fontSize: '0.74rem', color: 'var(--text3)', marginBottom: '1rem', marginTop: '0.15rem' }}>{tier.sub}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.38rem', marginTop: tier.sub ? 0 : '1rem' }}>
              {tier.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.79rem', color: 'var(--text2)' }}>
                  <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        background: 'var(--blue-lt)', border: '1px solid var(--blue-border)',
        borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
        fontSize: '0.83rem', color: 'var(--text2)',
      }}>
        <b style={{ color: 'var(--blue)' }}>Free tier available:</b> Get 100K tokens/month at no cost. Perfect for prototyping and exploration. No credit card required to get started.
      </div>
    </div>
  );
}

/* ─────────────────────────── Prompt Guide ─────────────────────────────── */

const PRINCIPLES = [
  {
    title: 'PRINCIPLE 1 — BE EXPLICIT ABOUT FORMAT',
    code: 'Summarize the following text in exactly 3 bullet points.\nEach bullet should be one sentence, under 20 words.\nText: {your_text_here}',
  },
  {
    title: 'PRINCIPLE 2 — ASSIGN A ROLE',
    code: 'You are a senior software engineer specializing in Python.\nReview the following code for bugs, performance issues,\nand style violations. Be concise and actionable.\n\nCode: {your_code_here}',
  },
  {
    title: 'PRINCIPLE 3 — CHAIN-OF-THOUGHT FOR COMPLEX TASKS',
    code: 'Solve this step by step, showing your reasoning at each stage.\nProblem: {your_problem_here}\n\nThink through: assumptions → approach → calculation → answer',
  },
  {
    title: 'PRINCIPLE 4 — FEW-SHOT EXAMPLES',
    code: 'Classify customer sentiment. Examples:\nInput: "Shipping was fast!" → Output: positive\nInput: "Product broke after a day." → Output: negative\nInput: "It\'s okay, nothing special." → Output: neutral',
  },
];

function PromptGuideTab({
  copyText, copiedIndex,
}: {
  copyText: (text: string, idx: number) => void;
  copiedIndex: number | null;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.3rem' }}>
          Prompt Engineering
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text2)', margin: 0 }}>
          Well-crafted prompts dramatically improve model output quality. Follow these principles to get the best results every time.
        </p>
      </div>
      {PRINCIPLES.map((p, i) => (
        <div key={i} style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '0.9rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.07em', color: 'var(--text3)', textTransform: 'uppercase' }}>
              {p.title}
            </span>
            <button
              onClick={() => copyText(p.code, i)}
              style={{
                padding: '0.2rem 0.65rem', background: 'var(--white)',
                border: '1px solid var(--border)', borderRadius: 6,
                cursor: 'pointer', fontSize: '0.74rem',
                color: copiedIndex === i ? 'var(--green)' : 'var(--text2)',
                fontFamily: 'inherit', fontWeight: 600, flexShrink: 0,
              }}
            >
              {copiedIndex === i ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ fontFamily: 'monospace', fontSize: '0.79rem', color: 'var(--accent2)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {p.code}
          </pre>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Agent Creation ─────────────────────────────── */

const AGENT_STEPS = [
  {
    title: "Define your agent's purpose",
    body: 'Clearly state what your agent should do. Example: "A customer support agent that answers product questions, escalates billing issues, and creates Jira tickets for bugs."',
  },
  {
    title: 'Write the system prompt',
    body: "The system prompt defines the agent's persona, scope, and behaviour. Be explicit about what the agent should and shouldn't do. Include tone, response length, and escalation rules.",
  },
  {
    title: 'Connect tools & APIs',
    body: 'Equip your agent with tools: web search, database lookup, email sender, calendar API, Slack webhook. This model supports function calling — define your tools in JSON schema format.',
  },
  {
    title: 'Set up memory',
    body: 'Configure short-term (conversation history) and long-term memory (vector store). This lets the agent remember user preferences and important context across sessions.',
  },
  {
    title: 'Test & iterate',
    body: 'Run the agent through 20+ test scenarios covering edge cases. Refine the system prompt based on failures. Use our Agent Playground to debug and tune before deployment.',
  },
  {
    title: 'Deploy & monitor',
    body: 'Get a shareable endpoint or embed widget. Monitor performance in the NexusAI dashboard — track response quality, latency, token usage, and user satisfaction scores in real time.',
  },
];

function AgentCreationTab({ model, onOpenAgentBuilder }: { model: AIModel; onOpenAgentBuilder: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.3rem' }}>
          Create an Agent with {model.name}
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text2)', margin: 0 }}>
          Follow these steps to build a powerful AI agent in under 10 minutes.
        </p>
      </div>
      {AGENT_STEPS.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 999,
            background: 'linear-gradient(135deg, #e8771a 0%, #c95b0a 100%)',
            color: 'white', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800,
            flexShrink: 0, marginTop: 2,
          }}>
            {i + 1}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{step.title}</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.65 }}>{step.body}</div>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem', flexWrap: 'wrap' }}>
        <button
          onClick={onOpenAgentBuilder}
          style={{
            padding: '0.68rem 1.4rem',
            background: 'linear-gradient(135deg, #e8771a 0%, #c95b0a 100%)',
            color: 'white', border: 'none',
            borderRadius: 'var(--radius)', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 700,
          }}
        >
          Open Agent Builder →
        </button>
        <button
          style={{
            padding: '0.68rem 1.4rem',
            background: 'var(--white)', color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600,
          }}
        >
          Ask the Hub
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Reviews ──────────────────────────────── */

const SAMPLE_REVIEWS = [
  {
    name: 'Sarah K.', role: 'ML Engineer at Stripe', date: 'Mar 2025', rating: 5,
    text: 'The vision capabilities are remarkably accurate — it handles complex financial statements and extracts structured data with minimal post-processing. Latency is excellent for our use case.',
  },
  {
    name: 'Tariq M.', role: 'Founder, EdTech Startup', date: 'Feb 2025', rating: 4,
    text: "Impressive reasoning and creative capabilities. We use it for personalised learning content and student feedback. The main downside is cost at scale — the Pro subscription helps but enterprise pricing is where it becomes truly cost-effective.",
  },
  {
    name: 'Priya N.', role: 'Senior Developer at Shopify', date: 'Feb 2025', rating: 5,
    text: "Best coding model we've used. Code review, refactoring suggestions, and debugging explanations are outstanding. The function calling is reliable and JSON mode outputs are always well-structured. Highly recommend for developer tooling.",
  },
];

function ReviewsTab({ model }: { model: AIModel }) {
  const r = model.rating;
  const fivePct  = Math.min(95, Math.round((r - 4) * 70 + 50));
  const fourPct  = Math.min(40, Math.round((5 - r) * 25 + 15));
  const threePct = Math.max(2, Math.round((5 - r) * 8));
  const restPct  = Math.max(2, 100 - fivePct - fourPct - threePct);

  const bars = [
    { label: '5', pct: fivePct },
    { label: '4', pct: fourPct },
    { label: '3', pct: threePct },
    { label: '1-2', pct: restPct },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Summary */}
      <div style={{
        background: 'var(--bg)', borderRadius: 'var(--radius)',
        padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '2rem',
      }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: "'Syne', sans-serif", color: 'var(--text)', lineHeight: 1 }}>
            {r}
          </div>
          <div style={{ color: '#cf9b32', fontSize: '1.1rem', margin: '0.3rem 0' }}>
            {'★'.repeat(Math.round(r))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
            {model.reviews.toLocaleString()} reviews
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
          {bars.map(b => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.73rem', color: 'var(--text3)', width: 22, textAlign: 'right', flexShrink: 0 }}>{b.label}</span>
              <div style={{ flex: 1, height: 8, background: 'rgba(71,99,119,0.12)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${b.pct}%`, background: '#cf9b32', borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text3)', width: 30, flexShrink: 0 }}>{b.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      {SAMPLE_REVIEWS.map((rv, i) => (
        <div
          key={i}
          style={{
            borderBottom: i < SAMPLE_REVIEWS.length - 1 ? '1px solid var(--border)' : 'none',
            paddingBottom: i < SAMPLE_REVIEWS.length - 1 ? '1.25rem' : 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{rv.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{rv.role}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ color: '#cf9b32', fontSize: '0.85rem' }}>{'★'.repeat(rv.rating)}</span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text3)' }}>{rv.date}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text2)', lineHeight: 1.65, margin: '0.6rem 0 0' }}>
            {rv.text}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────── shared primitive ─────────────────────────────── */

function InfoBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '1rem 1.1rem' }}>
      <div style={{ fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
        {label}
      </div>
      {children}
    </div>
  );
}
