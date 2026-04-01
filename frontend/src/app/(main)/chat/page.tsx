'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useModels } from '@/hooks/useModels';
import { FALLBACK_MODELS } from '@/lib/models-fallback';
import { chatApi } from '@/lib/api';
import {
  ChatMessage,
  ChatSession,
  CPANEL_DATA,
  QUICK_ACTIONS,
  AIModel,
} from '@/types';
import GuestBanner from '@/components/chat/GuestBanner';
import { toast } from '@/components/ui/Toast';
import {
  clearCachedGuestChatSession,
  getCachedActiveGuestSessionId,
  getCachedActiveUserSessionId,
  getCachedGuestChatSession,
  getCachedUserChatSessions,
  setCachedActiveGuestSessionId,
  setCachedActiveUserSessionId,
  setCachedGuestChatSession,
  setCachedUserChatSessions,
  upsertChatSession,
} from '@/lib/chat-cache';
import { v4 as uuidv4 } from 'uuid';

const MOCK_RESPONSES = [
  "That's a great question! Based on your requirements, I'd recommend exploring the latest models. GPT-5 excels at reasoning, Claude Opus at analysis, and Gemini at multimodal tasks.",
  "Here's a structured approach:\n\n**1. Define your requirements** clearly\n**2. Select the right model** based on your use case\n**3. Optimize your prompts** for best results\n**4. Monitor and iterate** based on outputs",
  "Excellent choice! This model is well-suited for your task. Would you like me to walk you through the best prompting strategies?",
  "Here's what I found: The AI landscape is evolving rapidly. The key models to watch are GPT-5, Claude Opus, and Gemini Ultra - each offering unique capabilities.",
];

const CPANEL_TABS = [
  'use_cases',
  'monitor',
  'prototype',
  'business',
  'create',
  'analyze',
  'learn',
] as const;

const TAB_LABELS: Record<string, string> = {
  use_cases: 'Use Cases',
  monitor: 'Monitor',
  prototype: 'Prototype',
  business: 'Business',
  create: 'Create',
  analyze: 'Analyze',
  learn: 'Learn',
};

const GUEST_CHAT_TTL_MS = 3 * 60 * 60 * 1000;
const USER_HISTORY_LIMIT = 20;
const VOICE_NOTE_MAX_MS = 60_000;

interface VoiceDraft {
  audioUrl: string;
  durationMs: number;
}

interface BackendChatSession {
  id?: string;
  _id?: string;
  title?: string;
  modelId?: string;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
  isGuest?: boolean;
  messages?: Array<Partial<ChatMessage> & { role: 'user' | 'assistant'; content: string }>;
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={i} style={{ margin: '0.2rem 0' }}>
          <strong>{line.slice(2, -2)}</strong>
        </p>
      );
    }

    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} style={{ margin: '0.15rem 0' }}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

function buildSessionTitle(messages: ChatMessage[]) {
  const firstUserMessage = messages.find(message => message.role === 'user');
  const base = (firstUserMessage?.content || 'New Chat').trim();
  return base.length > 60 ? `${base.slice(0, 60)}...` : base;
}

function normalizeMessage(
  raw: Partial<ChatMessage> & { role: 'user' | 'assistant'; content: string },
  sessionId: string,
  modelId: string,
  index: number,
): ChatMessage {
  const timestamp = raw.timestamp
    ? new Date(raw.timestamp).toISOString()
    : new Date().toISOString();

  return {
    id: raw.id ?? `${sessionId}-${raw.role}-${timestamp}-${index}`,
    role: raw.role,
    content: raw.content,
    timestamp,
    modelId: raw.modelId ?? modelId,
    type: raw.type ?? (raw.audioUrl ? 'voice' : 'text'),
    audioUrl: raw.audioUrl,
    audioDurationMs: raw.audioDurationMs,
  };
}

function normalizeSession(raw: BackendChatSession): ChatSession {
  const id = String(raw.id ?? raw._id ?? uuidv4());
  const modelId = raw.modelId ?? 'gpt-5';
  const messages = Array.isArray(raw.messages)
    ? raw.messages.map((message, index) =>
        normalizeMessage(
          message as Partial<ChatMessage> & {
            role: 'user' | 'assistant';
            content: string;
          },
          id,
          modelId,
          index,
        ),
      )
    : [];
  const createdAt = raw.createdAt
    ? new Date(raw.createdAt).toISOString()
    : messages[0]?.timestamp ?? new Date().toISOString();
  const updatedAt = raw.updatedAt
    ? new Date(raw.updatedAt).toISOString()
    : messages[messages.length - 1]?.timestamp ?? createdAt;

  return {
    id,
    title: raw.title ?? buildSessionTitle(messages),
    messages,
    modelId,
    createdAt,
    updatedAt,
    expiresAt: raw.expiresAt ? new Date(raw.expiresAt).toISOString() : undefined,
    isGuest: Boolean(raw.isGuest),
  };
}

function createSessionSnapshot(params: {
  sessionId: string;
  modelId: string;
  messages: ChatMessage[];
  isGuest: boolean;
  expiresAt?: string;
  existing?: ChatSession | null;
}) {
  const createdAt =
    params.existing?.createdAt ??
    params.messages[0]?.timestamp ??
    new Date().toISOString();
  const updatedAt =
    params.messages[params.messages.length - 1]?.timestamp ?? createdAt;

  return {
    id: params.sessionId,
    title: buildSessionTitle(params.messages),
    messages: params.messages,
    modelId: params.modelId,
    createdAt,
    updatedAt,
    expiresAt: params.expiresAt ?? params.existing?.expiresAt,
    isGuest: params.isGuest,
  } satisfies ChatSession;
}

function ChatPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { auth, startGuestSession, loading: authLoading } = useAuth();
  const { models } = useModels();
  const allModels = models.length ? models : FALLBACK_MODELS;

  const [activeModelId, setActiveModelId] = useState(
    searchParams.get('model') || allModels[0]?.id || 'gpt-5',
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [browserGuestSessionId, setBrowserGuestSessionId] = useState<string | null>(null);
  const [cpanelTab, setCpanelTab] = useState<(typeof CPANEL_TABS)[number]>('use_cases');
  const [searchModel, setSearchModel] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceNoteRecording, setIsVoiceNoteRecording] = useState(false);
  const [voiceDraft, setVoiceDraft] = useState<VoiceDraft | null>(null);
  const [voiceDurationMs, setVoiceDurationMs] = useState(0);
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<number | null>(null);
  const voiceStartedAtRef = useRef<number | null>(null);
  const discardVoiceDraftRef = useRef(false);
  const chatSessionsRef = useRef<ChatSession[]>([]);
  const activeSessionIdRef = useRef<string | null>(null);

  const activeModel: AIModel =
    allModels.find(model => model.id === activeModelId) || allModels[0];

  const guestCacheTtlMs = Math.max(
    (auth.sessionExpiry ?? Date.now() + GUEST_CHAT_TTL_MS) - Date.now(),
    1_000,
  );

  useEffect(() => {
    chatSessionsRef.current = chatSessions;
  }, [chatSessions]);

  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  const clearVoiceTimer = useCallback(() => {
    if (voiceTimerRef.current) {
      window.clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
  }, []);

  const clearVoiceStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const resetVoiceRecorder = useCallback(() => {
    clearVoiceTimer();
    clearVoiceStream();
    mediaRecorderRef.current = null;
    voiceChunksRef.current = [];
    voiceStartedAtRef.current = null;
    discardVoiceDraftRef.current = false;
    setIsVoiceNoteRecording(false);
  }, [clearVoiceStream, clearVoiceTimer]);

  const selectSession = useCallback((session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setActiveModelId(session.modelId);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (auth.isAuthenticated) {
      setBrowserGuestSessionId(null);
      return;
    }

    if (auth.sessionId) {
      setBrowserGuestSessionId(auth.sessionId);
      return;
    }

    const id = startGuestSession();
    setBrowserGuestSessionId(id);
  }, [auth.isAuthenticated, auth.sessionId, authLoading, startGuestSession]);

  useEffect(() => {
    if (authLoading) return;
    const userId = auth.user?.id;

    if (auth.isAuthenticated && userId) {
      const cachedSessions = getCachedUserChatSessions(userId);
      const cachedActiveSessionId = getCachedActiveUserSessionId(userId);
      const nextActive =
        cachedSessions.find(session => session.id === cachedActiveSessionId) ??
        cachedSessions[0] ??
        null;

      setChatSessions(cachedSessions);
      setActiveSessionId(nextActive?.id ?? null);
      setMessages(nextActive?.messages ?? []);
      if (nextActive?.modelId) setActiveModelId(nextActive.modelId);
      return;
    }

    if (browserGuestSessionId) {
      const cachedGuestSession = getCachedGuestChatSession(browserGuestSessionId);
      const cachedGuestActiveId =
        getCachedActiveGuestSessionId(browserGuestSessionId) ??
        cachedGuestSession?.id ??
        null;

      if (cachedGuestSession) {
        setChatSessions([cachedGuestSession]);
        setActiveSessionId(cachedGuestActiveId);
        setMessages(cachedGuestSession.messages);
        setActiveModelId(cachedGuestSession.modelId);
      } else {
        setChatSessions([]);
        setActiveSessionId(null);
        setMessages([]);
      }
      return;
    }

    setChatSessions([]);
    setActiveSessionId(null);
    setMessages([]);
  }, [auth.isAuthenticated, auth.user?.id, authLoading, browserGuestSessionId]);

  useEffect(() => {
    const userId = auth.user?.id;
    if (!auth.isAuthenticated || !userId) return;

    let cancelled = false;
    setHistoryLoading(true);

    chatApi
      .getHistory(1, USER_HISTORY_LIMIT)
      .then(response => {
        if (cancelled) return;

        const remoteSessions: ChatSession[] = Array.isArray(response.data?.data)
          ? response.data.data.map((session: BackendChatSession) =>
              normalizeSession(session),
            )
          : [];

        const mergedSessions = remoteSessions.reduce<ChatSession[]>(
          (accumulator: ChatSession[], session: ChatSession) =>
            upsertChatSession(accumulator, session),
          chatSessionsRef.current,
        );

        setChatSessions(mergedSessions);

        const cachedActiveSessionId = getCachedActiveUserSessionId(userId);
        const nextActive =
          mergedSessions.find(
            session =>
              session.id === activeSessionIdRef.current ||
              session.id === cachedActiveSessionId,
          ) ??
          mergedSessions[0] ??
          null;

        setActiveSessionId(nextActive?.id ?? null);
        setMessages(nextActive?.messages ?? []);
        if (nextActive?.modelId) setActiveModelId(nextActive.modelId);
      })
      .catch(() => {
        if (!cancelled && !chatSessionsRef.current.length) {
          toast('Could not refresh chat history right now. Showing cached data.', 'info');
        }
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, auth.user?.id]);

  useEffect(() => {
    const userId = auth.user?.id;
    if (auth.isAuthenticated && userId) {
      setCachedUserChatSessions(userId, chatSessions);
      setCachedActiveUserSessionId(userId, activeSessionId);
    }
  }, [activeSessionId, auth.isAuthenticated, auth.user?.id, chatSessions]);

  useEffect(() => {
    if (auth.isAuthenticated || !browserGuestSessionId) return;

    if (!messages.length && !activeSessionId) {
      clearCachedGuestChatSession(browserGuestSessionId);
      return;
    }

    const existingSession =
      chatSessions.find(session => session.id === activeSessionId) ?? null;
    const effectiveSessionId =
      existingSession?.id ?? activeSessionId ?? browserGuestSessionId;
    const guestSession =
      existingSession ??
      createSessionSnapshot({
        sessionId: effectiveSessionId,
        modelId: activeModelId,
        messages,
        isGuest: true,
        expiresAt: new Date(Date.now() + guestCacheTtlMs).toISOString(),
      });

    setCachedGuestChatSession(browserGuestSessionId, guestSession, guestCacheTtlMs);
    setCachedActiveGuestSessionId(
      browserGuestSessionId,
      effectiveSessionId,
      guestCacheTtlMs,
    );
  }, [
    activeModelId,
    activeSessionId,
    auth.isAuthenticated,
    browserGuestSessionId,
    chatSessions,
    guestCacheTtlMs,
    messages,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current?.state &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        discardVoiceDraftRef.current = true;
        mediaRecorderRef.current.stop();
      }
      clearVoiceTimer();
      clearVoiceStream();
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach(track => track.stop());
      (recognitionRef.current as { stop?: () => void } | null)?.stop?.();
    };
  }, [clearVoiceStream, clearVoiceTimer]);

  const submitMessage = useCallback(
    async (text: string, draft?: VoiceDraft | null) => {
      const trimmedText = text.trim();
      if ((!trimmedText && !draft) || isTyping) return;

      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: trimmedText || 'Voice message',
        timestamp: new Date().toISOString(),
        modelId: activeModelId,
        type: draft ? 'voice' : 'text',
        audioUrl: draft?.audioUrl,
        audioDurationMs: draft?.durationMs,
      };

      const optimisticMessages = [...messages, userMessage];
      setMessages(optimisticMessages);
      setInputText('');
      setAttachments([]);
      setVoiceDraft(null);
      setVoiceDurationMs(0);
      setIsTyping(true);

      try {
        const response = await chatApi.send({
          message: trimmedText || 'Voice message',
          modelId: activeModelId,
          sessionId: activeSessionId ?? undefined,
          type: draft ? 'voice' : 'text',
          audioUrl: draft?.audioUrl,
          audioDurationMs: draft?.durationMs,
        });

        const normalizedSession = response.data?.session
          ? normalizeSession(response.data.session as BackendChatSession)
          : createSessionSnapshot({
              sessionId: response.data?.sessionId ?? activeSessionId ?? uuidv4(),
              modelId: activeModelId,
              messages: [
                ...optimisticMessages,
                {
                  id: uuidv4(),
                  role: 'assistant',
                  content: response.data?.reply ?? 'No response received.',
                  timestamp: new Date(
                    response.data?.timestamp ?? Date.now(),
                  ).toISOString(),
                  modelId: activeModelId,
                  type: 'text',
                },
              ],
              isGuest: !auth.isAuthenticated,
              expiresAt: auth.isAuthenticated
                ? undefined
                : new Date(Date.now() + guestCacheTtlMs).toISOString(),
            });

        setActiveSessionId(normalizedSession.id);
        setMessages(normalizedSession.messages);
        setChatSessions(previousSessions =>
          auth.isAuthenticated
            ? upsertChatSession(previousSessions, normalizedSession)
            : [normalizedSession],
        );
      } catch {
        const replyText = draft
          ? 'I received your voice message. It was stored locally because chat sync is unavailable right now.'
          : MOCK_RESPONSES[mockIdx % MOCK_RESPONSES.length];
        const fallbackSessionId = activeSessionId ?? `local-${uuidv4()}`;
        const fallbackSession = createSessionSnapshot({
          sessionId: fallbackSessionId,
          modelId: activeModelId,
          messages: [
            ...optimisticMessages,
            {
              id: uuidv4(),
              role: 'assistant',
              content: replyText,
              timestamp: new Date().toISOString(),
              modelId: activeModelId,
              type: 'text',
            },
          ],
          isGuest: !auth.isAuthenticated,
          expiresAt: auth.isAuthenticated
            ? undefined
            : new Date(Date.now() + guestCacheTtlMs).toISOString(),
          existing:
            chatSessionsRef.current.find(
              session => session.id === activeSessionIdRef.current,
            ) ?? null,
        });

        toast('Chat sync failed. Your conversation was cached locally.', 'info');
        setMockIdx(previous => previous + 1);
        setActiveSessionId(fallbackSession.id);
        setMessages(fallbackSession.messages);
        setChatSessions(previousSessions =>
          auth.isAuthenticated
            ? upsertChatSession(previousSessions, fallbackSession)
            : [fallbackSession],
        );
      } finally {
        setIsTyping(false);
      }
    },
    [
      activeModelId,
      activeSessionId,
      auth.isAuthenticated,
      guestCacheTtlMs,
      isTyping,
      messages,
      mockIdx,
    ],
  );

  const handleSendCurrentMessage = useCallback(() => {
    if (isVoiceNoteRecording) {
      toast('Stop recording before sending your message.', 'info');
      return;
    }
    void submitMessage(inputText, voiceDraft);
  }, [inputText, isVoiceNoteRecording, submitMessage, voiceDraft]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCurrentMessage();
    }
  };

  const handleVoiceTyping = () => {
    if (isVoiceNoteRecording) {
      toast('Finish or cancel the voice note before using voice typing.', 'info');
      return;
    }

    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast('Voice typing is not supported in this browser.', 'error');
      return;
    }

    if (isRecording) {
      (recognitionRef.current as { stop: () => void } | null)?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new (
      SpeechRecognition as new () => {
        lang: string;
        continuous: boolean;
        onresult: (e: {
          results: { [key: number]: { [key: number]: { transcript: string } } };
        }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      }
    )();

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.onresult = e => {
      setInputText(previous => previous + e.results[0][0].transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopVoiceNoteRecording = useCallback(
    (discard = false) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        if (discard) setVoiceDraft(null);
        setVoiceDurationMs(0);
        return;
      }

      discardVoiceDraftRef.current = discard;
      clearVoiceTimer();
      setIsVoiceNoteRecording(false);

      if (recorder.state !== 'inactive') {
        recorder.stop();
        return;
      }

      resetVoiceRecorder();
    },
    [clearVoiceTimer, resetVoiceRecorder],
  );

  const startVoiceNoteRecording = useCallback(async () => {
    if (typeof window === 'undefined') return;

    if (isRecording) {
      (recognitionRef.current as { stop?: () => void } | null)?.stop?.();
      setIsRecording(false);
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      toast('Voice notes are not supported in this browser.', 'error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      voiceChunksRef.current = [];
      voiceStartedAtRef.current = Date.now();
      setVoiceDraft(null);
      setVoiceDurationMs(0);

      const preferredMimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
      ].find(type => MediaRecorder.isTypeSupported(type));

      const recorder = preferredMimeType
        ? new MediaRecorder(stream, { mimeType: preferredMimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = event => {
        if (event.data.size > 0) voiceChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const durationMs = voiceStartedAtRef.current
          ? Date.now() - voiceStartedAtRef.current
          : voiceDurationMs;
        const shouldDiscard = discardVoiceDraftRef.current;
        const chunks = [...voiceChunksRef.current];

        resetVoiceRecorder();
        setVoiceDurationMs(0);

        if (shouldDiscard) return;
        if (!chunks.length) {
          toast('No audio was captured. Try recording again.', 'error');
          return;
        }

        try {
          const audioBlob = new Blob(chunks, {
            type: recorder.mimeType || 'audio/webm',
          });
          const audioUrl = await readBlobAsDataUrl(audioBlob);
          setVoiceDraft({ audioUrl, durationMs });
        } catch {
          toast('Could not prepare the voice message.', 'error');
        }
      };

      recorder.start();
      setIsVoiceNoteRecording(true);
      voiceTimerRef.current = window.setInterval(() => {
        if (!voiceStartedAtRef.current) return;
        const elapsed = Date.now() - voiceStartedAtRef.current;
        setVoiceDurationMs(elapsed);
        if (elapsed >= VOICE_NOTE_MAX_MS) {
          toast('Voice notes are limited to 60 seconds.', 'info');
          stopVoiceNoteRecording(false);
        }
      }, 200);
    } catch {
      clearVoiceStream();
      setIsVoiceNoteRecording(false);
      toast('Microphone access is required to record a voice message.', 'error');
    }
  }, [
    clearVoiceStream,
    isRecording,
    resetVoiceRecorder,
    stopVoiceNoteRecording,
    voiceDurationMs,
  ]);

  const handleTTS = (text: string) => {
    if (!window.speechSynthesis) return;
    if (ttsActive) {
      window.speechSynthesis.cancel();
      setTtsActive(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setTtsActive(false);
    window.speechSynthesis.speak(utterance);
    setTtsActive(true);
  };

  const handleCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setShowCamera(false);
    }
  };

  const snapPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setAttachments(previous => [...previous, dataUrl]);
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);
  };

  const handleNewChat = () => {
    if (isVoiceNoteRecording) stopVoiceNoteRecording(true);
    setMessages([]);
    setInputText('');
    setAttachments([]);
    setVoiceDraft(null);
    setVoiceDurationMs(0);
    setActiveSessionId(null);
    setIsTyping(false);

    if (!auth.isAuthenticated && browserGuestSessionId) {
      clearCachedGuestChatSession(browserGuestSessionId);
      setChatSessions([]);
    }
  };

  const filteredModels = allModels.filter(
    model =>
      model.name.toLowerCase().includes(searchModel.toLowerCase()) ||
      model.org.toLowerCase().includes(searchModel.toLowerCase()),
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 65px)',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {auth.isGuest && auth.sessionExpiry && !guestBannerDismissed && (
        <GuestBanner
          sessionExpiry={auth.sessionExpiry}
          onDismiss={() => setGuestBannerDismissed(true)}
        />
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside
          style={{
            width: 252,
            flexShrink: 0,
            background: 'var(--white)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <input
              placeholder="Search models..."
              value={searchModel}
              onChange={e => setSearchModel(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--border2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                outline: 'none',
                fontFamily: 'inherit',
                background: 'var(--bg)',
                color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
            {filteredModels.map(model => (
              <button
                key={model.id}
                onClick={() => setActiveModelId(model.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  background:
                    activeModelId === model.id ? 'var(--accent-lt)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: 'background 0.12s',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: model.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  {model.icon}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color:
                        activeModelId === model.id
                          ? 'var(--accent)'
                          : 'var(--text)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {model.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
                    {model.org}
                  </div>
                </div>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background:
                      model.badge === 'beta' ? '#F59E0B' : '#22c55e',
                    flexShrink: 0,
                  }}
                />
              </button>
            ))}
          </div>
        </aside>

        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <div
            style={{
              padding: '0.6rem 1rem',
              borderBottom: '1px solid var(--border)',
              background: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.3rem 0.75rem',
                background: 'var(--accent-lt)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--accent-border)',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{activeModel?.icon}</span>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}
              >
                {activeModel?.name}
              </span>
            </div>
            {historyLoading && auth.isAuthenticated && (
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.74rem',
                  color: 'var(--text3)',
                }}
              >
                Syncing history...
              </span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {messages.length === 0 ? (
              <div style={{ maxWidth: 520, margin: '2rem auto', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Hi</div>
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text)',
                  }}
                >
                  Hello! I&apos;m your AI guide.
                </h2>
                <p
                  style={{
                    color: 'var(--text2)',
                    fontSize: '0.88rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  How can I help you today? Choose a topic or type your message below.
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                  }}
                >
                  {CPANEL_DATA.use_cases.map(useCase => (
                    <button
                      key={useCase}
                      onClick={() => void submitMessage(useCase)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        background: 'var(--white)',
                        border: '1px solid var(--border2)',
                        borderRadius: '2rem',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        color: 'var(--text2)',
                        fontFamily: 'inherit',
                        fontWeight: 500,
                        transition: 'all 0.15s',
                      }}
                    >
                      {useCase}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        message.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '1rem',
                    }}
                  >
                    {message.role === 'assistant' && (
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: activeModel?.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          flexShrink: 0,
                          marginRight: 8,
                          marginTop: 4,
                        }}
                      >
                        {activeModel?.icon}
                      </div>
                    )}
                    <div style={{ maxWidth: '70%' }}>
                      <div
                        style={{
                          padding: '0.75rem 1rem',
                          background:
                            message.role === 'user'
                              ? 'var(--accent)'
                              : 'var(--white)',
                          color:
                            message.role === 'user' ? 'white' : 'var(--text)',
                          borderRadius:
                            message.role === 'user'
                              ? '18px 18px 4px 18px'
                              : '18px 18px 18px 4px',
                          border:
                            message.role === 'assistant'
                              ? '1px solid var(--border)'
                              : 'none',
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          boxShadow: 'var(--shadow)',
                        }}
                      >
                        {message.type === 'voice' && message.audioUrl && (
                          <div
                            style={{
                              padding: '0.6rem 0.7rem',
                              marginBottom:
                                message.content.trim() &&
                                message.content !== 'Voice message'
                                  ? '0.7rem'
                                  : 0,
                              background:
                                message.role === 'user'
                                  ? 'rgba(255,255,255,0.14)'
                                  : 'var(--bg)',
                              borderRadius: 14,
                              border:
                                message.role === 'user'
                                  ? '1px solid rgba(255,255,255,0.16)'
                                  : '1px solid var(--border)',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                marginBottom: 6,
                                color:
                                  message.role === 'user'
                                    ? 'rgba(255,255,255,0.84)'
                                    : 'var(--text2)',
                              }}
                            >
                              Voice message
                              {message.audioDurationMs
                                ? ` | ${formatDuration(message.audioDurationMs)}`
                                : ''}
                            </div>
                            <audio
                              controls
                              preload="metadata"
                              src={message.audioUrl}
                              style={{ width: '100%', minWidth: 220, maxWidth: 320 }}
                            />
                          </div>
                        )}
                        {(message.type !== 'voice' ||
                          message.content.trim() !== 'Voice message') &&
                          renderMarkdown(message.content)}
                      </div>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => handleTTS(message.content)}
                          style={{
                            marginTop: 4,
                            fontSize: '0.72rem',
                            color: 'var(--text3)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0 4px',
                          }}
                        >
                          {ttsActive ? 'Stop' : 'Listen'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: activeModel?.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                      }}
                    >
                      {activeModel?.icon}
                    </div>
                    <div
                      style={{
                        background: 'var(--white)',
                        border: '1px solid var(--border)',
                        borderRadius: '18px 18px 18px 4px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        gap: 5,
                      }}
                    >
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: 'var(--text3)',
                            display: 'block',
                            animation: `bounce 1.2s ${i * 0.2}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', background: 'var(--white)' }}>
            <div style={{ borderBottom: '1px solid var(--border)', padding: '0 1rem' }}>
              <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
                {CPANEL_TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setCpanelTab(tab)}
                    style={{
                      padding: '0.5rem 0.9rem',
                      background: 'none',
                      border: 'none',
                      borderBottom:
                        cpanelTab === tab
                          ? '2px solid var(--accent)'
                          : '2px solid transparent',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: cpanelTab === tab ? 600 : 400,
                      color: cpanelTab === tab ? 'var(--accent)' : 'var(--text2)',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.15s',
                    }}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '0.6rem 1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {CPANEL_DATA[cpanelTab].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => void submitMessage(prompt)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      color: 'var(--text2)',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      transition: 'background 0.12s',
                      lineHeight: 1.4,
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {isVoiceNoteRecording && (
              <div style={{ padding: '0 1rem 0.6rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '0.7rem 0.85rem',
                    background: '#fff2f2',
                    border: '1px solid rgba(220, 38, 38, 0.18)',
                    borderRadius: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#dc2626',
                        display: 'inline-block',
                        animation: 'pulse 1.3s infinite',
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#991b1b',
                        }}
                      >
                        Recording voice note
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#b45309' }}>
                        {formatDuration(voiceDurationMs)} / 1:00 max
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => stopVoiceNoteRecording(true)}
                      style={{
                        padding: '0.38rem 0.7rem',
                        background: 'white',
                        border: '1px solid rgba(220, 38, 38, 0.15)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.74rem',
                        fontFamily: 'inherit',
                        color: '#991b1b',
                      }}
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => stopVoiceNoteRecording(false)}
                      style={{
                        padding: '0.38rem 0.7rem',
                        background: '#dc2626',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.74rem',
                        fontFamily: 'inherit',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    >
                      Stop
                    </button>
                  </div>
                </div>
              </div>
            )}

            {voiceDraft && (
              <div style={{ padding: '0 1rem 0.6rem' }}>
                <div
                  style={{
                    padding: '0.75rem 0.85rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      marginBottom: '0.6rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--text)',
                        }}
                      >
                        Voice note ready
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
                        {formatDuration(voiceDraft.durationMs)}
                      </div>
                    </div>
                    <button
                      onClick={() => setVoiceDraft(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text3)',
                        fontSize: '0.74rem',
                        fontFamily: 'inherit',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <audio controls preload="metadata" src={voiceDraft.audioUrl} style={{ width: '100%' }} />
                </div>
              </div>
            )}

            {attachments.length > 0 && (
              <div style={{ display: 'flex', gap: 6, padding: '0 1rem 0.5rem', flexWrap: 'wrap' }}>
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '0.25rem 0.5rem',
                      background: 'var(--accent-lt)',
                      border: '1px solid var(--accent-border)',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      color: 'var(--accent)',
                    }}
                  >
                    {attachment.startsWith('data:image') ? 'Photo' : attachment}
                    <button
                      onClick={() =>
                        setAttachments(previous =>
                          previous.filter((_, attachmentIndex) => attachmentIndex !== index),
                        )
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--accent)',
                        lineHeight: 1,
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '0.5rem',
                padding: '0.5rem 1rem 0.75rem',
              }}
            >
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message or pick a prompt above..."
                rows={2}
                style={{
                  flex: 1,
                  resize: 'none',
                  border: '1px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit',
                  color: 'var(--text)',
                  background: 'var(--bg)',
                  outline: 'none',
                  lineHeight: 1.5,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button
                    onClick={handleVoiceTyping}
                    title="Voice typing"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: isRecording ? 'var(--accent-lt)' : 'var(--bg)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: isRecording ? 'micPulse 1s infinite' : 'none',
                    }}
                  >
                    Mic
                  </button>
                  <button
                    onClick={() =>
                      isVoiceNoteRecording
                        ? stopVoiceNoteRecording(false)
                        : void startVoiceNoteRecording()
                    }
                    title={isVoiceNoteRecording ? 'Stop voice note' : 'Record voice note'}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: isVoiceNoteRecording ? '#fee2e2' : 'var(--bg)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isVoiceNoteRecording ? '#b91c1c' : 'var(--text2)',
                    }}
                  >
                    {isVoiceNoteRecording ? 'Stop' : 'Rec'}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    File
                  </button>
                  <button
                    onClick={() => imgInputRef.current?.click()}
                    title="Attach image"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Img
                  </button>
                  <button
                    onClick={handleCamera}
                    title="Camera"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Cam
                  </button>
                </div>
                <button
                  onClick={handleSendCurrentMessage}
                  disabled={isVoiceNoteRecording || (!inputText.trim() && !attachments.length && !voiceDraft)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    opacity:
                      isVoiceNoteRecording ||
                      (!inputText.trim() && !attachments.length && !voiceDraft)
                        ? 0.5
                        : 1,
                  }}
                >
                  Send {'->'}
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files?.[0]) {
                  setAttachments(previous => [...previous, e.target.files![0].name]);
                }
              }}
            />
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files?.[0]) {
                  const reader = new FileReader();
                  reader.onload = event =>
                    setAttachments(previous => [
                      ...previous,
                      String(event.target?.result ?? ''),
                    ]);
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
          </div>
        </main>

        <aside
          style={{
            width: 272,
            flexShrink: 0,
            background: 'var(--white)',
            borderLeft: '1px solid var(--border)',
            overflowY: 'auto',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: activeModel?.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                }}
              >
                {activeModel?.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: 'var(--text)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {activeModel?.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
                  {activeModel?.org}
                </div>
              </div>
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  background: '#DCFCE7',
                  color: '#166534',
                  borderRadius: '2rem',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                }}
              >
                LIVE
              </span>
            </div>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text2)',
                lineHeight: 1.5,
                marginBottom: '0.75rem',
              }}
            >
              {activeModel?.desc}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 6,
                marginBottom: '0.75rem',
              }}
            >
              {[
                { label: 'Context', val: activeModel?.context },
                { label: 'Latency', val: activeModel?.latency },
                { label: 'Rating', val: String(activeModel?.rating) },
              ].map(stat => (
                <div
                  key={stat.label}
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '0.4rem 0.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                    }}
                  >
                    {stat.val}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => router.push('/marketplace')}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  background: 'var(--white)',
                  border: '1px solid var(--border2)',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: 'var(--text2)',
                }}
              >
                Browse more
              </button>
              <button
                onClick={handleNewChat}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  background: 'var(--accent-lt)',
                  border: '1px solid var(--accent-border)',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: 'var(--accent)',
                  fontWeight: 600,
                }}
              >
                New chat
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '0.5rem',
              }}
            >
              Recent Chats
            </h4>
            {chatSessions.length === 0 ? (
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '0.7rem',
                  fontSize: '0.75rem',
                  color: 'var(--text3)',
                }}
              >
                {auth.isAuthenticated
                  ? 'Your saved history will appear here after the first message.'
                  : 'Guest chat is cached in this tab for 3 hours.'}
              </div>
            ) : (
              chatSessions.slice(0, 8).map(session => (
                <button
                  key={session.id}
                  onClick={() => selectSession(session)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.6rem 0.7rem',
                    marginBottom: 6,
                    background:
                      activeSessionId === session.id
                        ? 'var(--accent-lt)'
                        : 'var(--bg)',
                    border:
                      activeSessionId === session.id
                        ? '1px solid var(--accent-border)'
                        : '1px solid var(--border)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color:
                        activeSessionId === session.id
                          ? 'var(--accent)'
                          : 'var(--text)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {session.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--text3)',
                      marginTop: 2,
                    }}
                  >
                    {session.updatedAt
                      ? new Date(session.updatedAt).toLocaleString()
                      : new Date(session.createdAt).toLocaleString()}
                  </div>
                </button>
              ))
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '0.5rem',
              }}
            >
              Usage Overview
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
                marginBottom: '0.5rem',
              }}
            >
              {[
                { label: 'Requests', val: `${messages.filter(m => m.role === 'user').length}` },
                { label: 'Avg Latency', val: activeModel?.latency },
                { label: 'Est. Cost', val: messages.length ? '$0.01' : '$0.00' },
              ].map(item => (
                <div
                  key={item.label}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                    }}
                  >
                    {item.val}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '0.6rem',
                display: 'flex',
                alignItems: 'flex-end',
                gap: 3,
                height: 48,
              }}
            >
              {[20, 45, 30, 60, 40, 80, 55, 70].map((height, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    background: 'var(--accent)',
                    borderRadius: 3,
                    opacity: index === 7 ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h4
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '0.5rem',
              }}
            >
              Quick Actions
            </h4>
            {[
              { label: 'Navigation & Tools', items: QUICK_ACTIONS.navigation },
              { label: 'Create & Generate', items: QUICK_ACTIONS.create },
              { label: 'Analyze & Write', items: QUICK_ACTIONS.analyze },
            ].map(group => (
              <div key={group.label} style={{ marginBottom: '0.75rem' }}>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: 'var(--text3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    marginBottom: '0.3rem',
                  }}
                >
                  {group.label}
                </div>
                {group.items.map(item => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.action === 'marketplace') router.push('/marketplace');
                      else if (item.action === 'agent') router.push('/agents');
                      else if (item.action.startsWith('send:')) {
                        void submitMessage(item.action.replace('send:', ''));
                      } else {
                        void submitMessage(item.label);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      width: '100%',
                      padding: '0.4rem 0.5rem',
                      background: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '0.75rem',
                      color: 'var(--text2)',
                      marginBottom: 4,
                      transition: 'background 0.12s',
                    }}
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {showCamera && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              maxWidth: 400,
              width: '90%',
            }}
          >
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              Take a photo
            </h3>
            <video
              ref={videoRef}
              autoPlay
              style={{
                width: '100%',
                borderRadius: 'var(--radius)',
                marginBottom: '1rem',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={snapPhoto}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                }}
              >
                Snap
              </button>
              <button
                onClick={() => {
                  const stream = videoRef.current?.srcObject as MediaStream;
                  stream?.getTracks().forEach(track => track.stop());
                  setShowCamera(false);
                }}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--border2)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            color: 'var(--text2)',
          }}
        >
          Loading chat...
        </div>
      }
    >
      <ChatPageInner />
    </Suspense>
  );
}
