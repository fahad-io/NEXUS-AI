'use client';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useModels } from '@/hooks/useModels';
import { FALLBACK_MODELS } from '@/lib/models-fallback';
import { ChatMessage, CPANEL_DATA, QUICK_ACTIONS, AIModel } from '@/types';
import GuestBanner from '@/components/chat/GuestBanner';
import { v4 as uuidv4 } from 'uuid';

const MOCK_RESPONSES = [
  "That's a great question! Based on your requirements, I'd recommend exploring the latest models. GPT-5 excels at reasoning, Claude Opus at analysis, and Gemini at multimodal tasks.",
  "Here's a structured approach:\n\n**1. Define your requirements** clearly\n**2. Select the right model** based on your use case\n**3. Optimize your prompts** for best results\n**4. Monitor and iterate** based on outputs",
  "Excellent choice! This model is well-suited for your task. Would you like me to walk you through the best prompting strategies?",
  "Here's what I found: The AI landscape is evolving rapidly. The key models to watch are GPT-5, Claude Opus, and Gemini Ultra — each offering unique capabilities.",
];

const CPANEL_TABS = ['use_cases', 'monitor', 'prototype', 'business', 'create', 'analyze', 'learn'] as const;
const TAB_LABELS: Record<string, string> = { use_cases: 'Use Cases', monitor: 'Monitor', prototype: 'Prototype', business: 'Business', create: 'Create', analyze: 'Analyze', learn: 'Learn' };

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} style={{ margin: '0.2rem 0' }}><strong>{line.slice(2, -2)}</strong></p>;
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} style={{ margin: '0.15rem 0' }}>
        {parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)}
      </p>
    );
  });
}

function ChatPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { auth, startGuestSession } = useAuth();
  const { models } = useModels();
  const allModels = models.length ? models : FALLBACK_MODELS;

  const initialModelId = searchParams.get('model') || allModels[0]?.id || 'gpt-5';
  const [activeModelId, setActiveModelId] = useState(initialModelId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cpanelTab, setCpanelTab] = useState<typeof CPANEL_TABS[number]>('use_cases');
  const [searchModel, setSearchModel] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [mockIdx, setMockIdx] = useState(0);
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<unknown>(null);

  const activeModel: AIModel = allModels.find(m => m.id === activeModelId) || allModels[0];

  // Guest session init
  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isGuest) {
      const id = startGuestSession();
      setSessionId(id);
    } else if (auth.sessionId) {
      setSessionId(auth.sessionId);
    }
  }, [auth.isAuthenticated, auth.isGuest, auth.sessionId, startGuestSession]);

  // Load from sessionStorage
  useEffect(() => {
    if (sessionId) {
      try {
        const saved = sessionStorage.getItem(`nexusai_chat_${sessionId}`);
        if (saved) setMessages(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, [sessionId]);

  // Save to sessionStorage
  useEffect(() => {
    if (sessionId && messages.length) {
      sessionStorage.setItem(`nexusai_chat_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: uuidv4(), role: 'user', content: text.trim(), timestamp: new Date().toISOString(), modelId: activeModelId };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachments([]);
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: ChatMessage = { id: uuidv4(), role: 'assistant', content: MOCK_RESPONSES[mockIdx % MOCK_RESPONSES.length], timestamp: new Date().toISOString(), modelId: activeModelId };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setMockIdx(p => p + 1);
    }, 1200);
  }, [activeModelId, mockIdx]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputText); }
  };

  const handleVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (isRecording) {
      (recognitionRef.current as { stop: () => void } | null)?.stop();
      setIsRecording(false);
      return;
    }
    const recognition = new (SpeechRecognition as new () => { lang: string; continuous: boolean; onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void; onerror: () => void; onend: () => void; start: () => void })();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.onresult = (e) => { setInputText(prev => prev + e.results[0][0].transcript); };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const handleTTS = (text: string) => {
    if (!window.speechSynthesis) return;
    if (ttsActive) { window.speechSynthesis.cancel(); setTtsActive(false); return; }
    const utt = new SpeechSynthesisUtterance(text);
    utt.onend = () => setTtsActive(false);
    window.speechSynthesis.speak(utt);
    setTtsActive(true);
  };

  const handleCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { setShowCamera(false); }
  };

  const snapPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setAttachments(prev => [...prev, dataUrl]);
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setShowCamera(false);
  };

  const filteredModels = allModels.filter(m => m.name.toLowerCase().includes(searchModel.toLowerCase()) || m.org.toLowerCase().includes(searchModel.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Guest Banner */}
      {(auth.isGuest && auth.sessionExpiry && !guestBannerDismissed) && (
        <GuestBanner sessionExpiry={auth.sessionExpiry} onDismiss={() => setGuestBannerDismissed(true)} />
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT SIDEBAR */}
        <aside style={{ width: 252, flexShrink: 0, background: 'var(--white)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <input
              placeholder="Search models..."
              value={searchModel}
              onChange={e => setSearchModel(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--text)' }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
            {filteredModels.map(model => (
              <button
                key={model.id}
                onClick={() => setActiveModelId(model.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.55rem 0.85rem', background: activeModelId === model.id ? 'var(--accent-lt)' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: model.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>{model.icon}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: activeModelId === model.id ? 'var(--accent)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{model.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{model.org}</div>
                </div>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: model.badge === 'beta' ? '#F59E0B' : '#22c55e', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </aside>

        {/* CENTER PANEL */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {/* Model Tabs */}
          <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--white)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.3rem 0.75rem', background: 'var(--accent-lt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-border)' }}>
              <span style={{ fontSize: '0.9rem' }}>{activeModel?.icon}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)' }}>{activeModel?.name}</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {messages.length === 0 ? (
              <div style={{ maxWidth: 520, margin: '2rem auto', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👋</div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text)' }}>Hello! I&apos;m your AI guide.</h2>
                <p style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>How can I help you today? Choose a topic or type your message below.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                  {CPANEL_DATA.use_cases.map(uc => (
                    <button key={uc} onClick={() => sendMessage(uc)} style={{ padding: '0.45rem 0.9rem', background: 'var(--white)', border: '1px solid var(--border2)', borderRadius: '2rem', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--text2)', fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.15s' }}>
                      {uc}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
                    {msg.role === 'assistant' && (
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: activeModel?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0, marginRight: 8, marginTop: 4 }}>{activeModel?.icon}</div>
                    )}
                    <div style={{ maxWidth: '70%' }}>
                      <div style={{
                        padding: '0.75rem 1rem',
                        background: msg.role === 'user' ? 'var(--accent)' : 'var(--white)',
                        color: msg.role === 'user' ? 'white' : 'var(--text)',
                        borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                        boxShadow: 'var(--shadow)',
                      }}>
                        {renderMarkdown(msg.content)}
                      </div>
                      {msg.role === 'assistant' && (
                        <button onClick={() => handleTTS(msg.content)} style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>
                          {ttsActive ? '⏹ Stop' : '🔊 Listen'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: activeModel?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{activeModel?.icon}</div>
                    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', padding: '0.75rem 1rem', display: 'flex', gap: 5 }}>
                      {[0, 1, 2].map(i => (
                        <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text3)', display: 'block', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div style={{ borderTop: '1px solid var(--border)', background: 'var(--white)' }}>
            {/* CPanel Tabs */}
            <div style={{ borderBottom: '1px solid var(--border)', padding: '0 1rem' }}>
              <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
                {CPANEL_TABS.map(tab => (
                  <button key={tab} onClick={() => setCpanelTab(tab)} style={{ padding: '0.5rem 0.9rem', background: 'none', border: 'none', borderBottom: cpanelTab === tab ? '2px solid var(--accent)' : '2px solid transparent', cursor: 'pointer', fontSize: '0.78rem', fontWeight: cpanelTab === tab ? 600 : 400, color: cpanelTab === tab ? 'var(--accent)' : 'var(--text2)', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'color 0.15s' }}>
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: '0.6rem 1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {CPANEL_DATA[cpanelTab].map(prompt => (
                  <button key={prompt} onClick={() => sendMessage(prompt)} style={{ padding: '0.4rem 0.6rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text2)', fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.12s', lineHeight: 1.4 }}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div style={{ display: 'flex', gap: 6, padding: '0 1rem 0.5rem', flexWrap: 'wrap' }}>
                {attachments.map((att, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.25rem 0.5rem', background: 'var(--accent-lt)', border: '1px solid var(--accent-border)', borderRadius: 6, fontSize: '0.75rem', color: 'var(--accent)' }}>
                    {att.startsWith('data:image') ? '🖼️' : '📎'} {att.startsWith('data:image') ? 'Photo' : att}
                    <button onClick={() => setAttachments(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', lineHeight: 1 }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '0.5rem 1rem 0.75rem' }}>
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message or pick a prompt above..."
                rows={2}
                style={{ flex: 1, resize: 'none', border: '1px solid var(--border2)', borderRadius: 'var(--radius)', padding: '0.6rem 0.85rem', fontSize: '0.88rem', fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)', outline: 'none', lineHeight: 1.5 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button onClick={handleVoice} title="Voice input" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: isRecording ? 'var(--accent-lt)' : 'var(--bg)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isRecording ? 'micPulse 1s infinite' : 'none' }}>🎙️</button>
                  <button onClick={() => fileInputRef.current?.click()} title="Attach file" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📎</button>
                  <button onClick={() => imgInputRef.current?.click()} title="Attach image" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🖼️</button>
                  <button onClick={handleCamera} title="Camera" style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</button>
                </div>
                <button onClick={() => sendMessage(inputText)} disabled={!inputText.trim() && !attachments.length} style={{ padding: '0.5rem 1rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit', opacity: (!inputText.trim() && !attachments.length) ? 0.5 : 1 }}>
                  Send →
                </button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) setAttachments(p => [...p, e.target.files![0].name]); }} />
            <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) { const r = new FileReader(); r.onload = ev => setAttachments(p => [...p, ev.target?.result as string]); r.readAsDataURL(e.target.files![0]); } }} />
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside style={{ width: 272, flexShrink: 0, background: 'var(--white)', borderLeft: '1px solid var(--border)', overflowY: 'auto', padding: '1rem' }}>
          {/* Active Model Card */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: activeModel?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{activeModel?.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeModel?.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{activeModel?.org}</div>
              </div>
              <span style={{ padding: '0.2rem 0.5rem', background: '#DCFCE7', color: '#166534', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 700 }}>LIVE</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{activeModel?.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: '0.75rem' }}>
              {[{ label: 'Context', val: activeModel?.context }, { label: 'Latency', val: activeModel?.latency }, { label: 'Rating', val: String(activeModel?.rating) }].map(s => (
                <div key={s.label} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.4rem 0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)' }}>{s.val}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => router.push('/marketplace')} style={{ flex: 1, padding: '0.4rem', background: 'var(--white)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text2)' }}>Browse more</button>
              <button onClick={() => setMessages([])} style={{ flex: 1, padding: '0.4rem', background: 'var(--accent-lt)', border: '1px solid var(--accent-border)', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--accent)', fontWeight: 600 }}>New chat</button>
            </div>
          </div>

          {/* Usage Overview */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Usage Overview</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: '0.5rem' }}>
              {[{ label: 'Requests', val: `${messages.filter(m => m.role === 'user').length}` }, { label: 'Avg Latency', val: activeModel?.latency }, { label: 'Est. Cost', val: messages.length ? '$0.01' : '$0.00' }].map(k => (
                <div key={k.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.5rem' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>{k.val}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>{k.label}</div>
                </div>
              ))}
            </div>
            {/* Sparkline */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem', display: 'flex', alignItems: 'flex-end', gap: 3, height: 48 }}>
              {[20, 45, 30, 60, 40, 80, 55, 70].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--accent)', borderRadius: 3, opacity: i === 7 ? 1 : 0.4 }} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Quick Actions</h4>
            {[
              { label: 'Navigation & Tools', items: QUICK_ACTIONS.navigation },
              { label: 'Create & Generate', items: QUICK_ACTIONS.create },
              { label: 'Analyze & Write', items: QUICK_ACTIONS.analyze },
            ].map(group => (
              <div key={group.label} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }}>{group.label}</div>
                {group.items.map(item => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.action === 'marketplace') router.push('/marketplace');
                      else if (item.action === 'agent') router.push('/agents');
                      else if (item.action.startsWith('send:')) sendMessage(item.action.replace('send:', ''));
                      else sendMessage(item.label);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '0.4rem 0.5rem', background: 'none', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 4, transition: 'background 0.12s' }}
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', maxWidth: 400, width: '90%' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: '1rem' }}>Take a photo</h3>
            <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: 'var(--radius)', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={snapPhoto} style={{ flex: 1, padding: '0.6rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>📷 Snap</button>
              <button onClick={() => { const s = videoRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t => t.stop()); setShowCamera(false); }} style={{ flex: 1, padding: '0.6rem', background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text2)' }}>Loading chat...</div>}>
      <ChatPageInner />
    </Suspense>
  );
}
