'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Camera,
  Circle,
  FileUp,
  ImagePlus,
  Mic,
  Square,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useModels } from '@/hooks/useModels';
import { FALLBACK_MODELS } from '@/lib/models-fallback';
import { chatApi, resolveBackendUrl, uploadApi } from '@/lib/api';
import {
  ChatMessage,
  ChatSession,
  CPANEL_DATA,
  QUICK_ACTIONS,
  AIModel,
  MessageAttachment,
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
const CAMERA_VIDEO_MAX_MS = 30_000;

interface VoiceDraft {
  audioUrl: string;
  durationMs: number;
}

interface ComposerAttachment extends MessageAttachment {
  id: string;
}

type CameraMode = 'photo' | 'video';

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

function getAttachmentKind(mimeType: string): MessageAttachment['kind'] {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'file';
}

function getComposerPlaceholderMessage(
  text: string,
  draft?: VoiceDraft | null,
  attachments: MessageAttachment[] = [],
) {
  const trimmedText = text.trim();
  if (trimmedText) return trimmedText;
  if (draft) return 'Voice message';
  if (attachments.some(attachment => attachment.kind === 'video')) return 'Shared a video';
  if (attachments.some(attachment => attachment.kind === 'image')) return 'Shared a photo';
  if (attachments.length > 0) return 'Shared attachments';
  return '';
}

function shouldRenderMessageText(message: ChatMessage) {
  const trimmedContent = message.content.trim();
  const attachmentPlaceholderMessages = new Set([
    'Shared a video',
    'Shared a photo',
    'Shared attachments',
  ]);

  if (message.type === 'voice' && trimmedContent === 'Voice message') {
    return false;
  }

  if ((message.attachments?.length ?? 0) > 0 && attachmentPlaceholderMessages.has(trimmedContent)) {
    return false;
  }

  return Boolean(trimmedContent);
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
    attachments: raw.attachments ?? [],
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
  const sessionParamId = searchParams.get('session');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [browserGuestSessionId, setBrowserGuestSessionId] = useState<string | null>(null);
  const [cpanelTab, setCpanelTab] = useState<(typeof CPANEL_TABS)[number]>('use_cases');
  const [searchModel, setSearchModel] = useState('');
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceNoteRecording, setIsVoiceNoteRecording] = useState(false);
  const [voiceDraft, setVoiceDraft] = useState<VoiceDraft | null>(null);
  const [voiceDurationMs, setVoiceDurationMs] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('video');
  const [cameraDurationMs, setCameraDurationMs] = useState(0);
  const [isCameraRecording, setIsCameraRecording] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [cameraUploading, setCameraUploading] = useState(false);
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
  const cameraRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const cameraChunksRef = useRef<Blob[]>([]);
  const cameraTimerRef = useRef<number | null>(null);
  const cameraStartedAtRef = useRef<number | null>(null);
  const discardCameraDraftRef = useRef(false);
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

  const clearCameraTimer = useCallback(() => {
    if (cameraTimerRef.current) {
      window.clearInterval(cameraTimerRef.current);
      cameraTimerRef.current = null;
    }
  }, []);

  const clearCameraStream = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach(track => track.stop());
    cameraStreamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const resetCameraRecorder = useCallback(() => {
    clearCameraTimer();
    cameraRecorderRef.current = null;
    cameraChunksRef.current = [];
    cameraStartedAtRef.current = null;
    discardCameraDraftRef.current = false;
    setIsCameraRecording(false);
    setCameraDurationMs(0);
  }, [clearCameraTimer]);

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
      .then(async response => {
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
        const preferredId = sessionParamId ?? activeSessionIdRef.current ?? cachedActiveSessionId;
        let nextActive =
          mergedSessions.find(session => session.id === preferredId) ??
          mergedSessions[0] ??
          null;

        // If URL param points to a session not in the list, fetch it directly
        if (sessionParamId && !nextActive) {
          try {
            const res = await chatApi.getSession(sessionParamId);
            if (res.data) {
              const fetched = normalizeSession(res.data as BackendChatSession);
              mergedSessions.unshift(fetched);
              setChatSessions([...mergedSessions]);
              nextActive = fetched;
            }
          } catch { /* session not found or no access */ }
        }

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
  }, [auth.isAuthenticated, auth.user?.id, sessionParamId]);

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
      if (
        cameraRecorderRef.current?.state &&
        cameraRecorderRef.current.state !== 'inactive'
      ) {
        discardCameraDraftRef.current = true;
        cameraRecorderRef.current.stop();
      }
      clearVoiceTimer();
      clearVoiceStream();
      clearCameraTimer();
      clearCameraStream();
      (recognitionRef.current as { stop?: () => void } | null)?.stop?.();
    };
  }, [clearCameraStream, clearCameraTimer, clearVoiceStream, clearVoiceTimer]);

  const submitMessage = useCallback(
    async (
      text: string,
      draft?: VoiceDraft | null,
      messageAttachments: ComposerAttachment[] = [],
    ) => {
      const normalizedAttachments = messageAttachments.map(attachment => ({
        name: attachment.name,
        url: attachment.url,
        mimeType: attachment.mimeType,
        kind: attachment.kind,
        size: attachment.size,
      }));
      const messageContent = getComposerPlaceholderMessage(
        text,
        draft,
        normalizedAttachments,
      );
      if ((!messageContent && !draft && !normalizedAttachments.length) || isTyping) return;

      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: messageContent,
        timestamp: new Date().toISOString(),
        modelId: activeModelId,
        type: draft ? 'voice' : 'text',
        audioUrl: draft?.audioUrl,
        audioDurationMs: draft?.durationMs,
        attachments: normalizedAttachments,
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
          message: messageContent,
          modelId: activeModelId,
          sessionId: activeSessionId ?? undefined,
          type: draft ? 'voice' : 'text',
          audioUrl: draft?.audioUrl,
          audioDurationMs: draft?.durationMs,
          attachments: normalizedAttachments,
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
          : normalizedAttachments.length
            ? 'I saved your attachment, but chat sync is unavailable right now.'
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
    if (isVoiceNoteRecording || isCameraRecording) {
      toast('Stop recording before sending your message.', 'info');
      return;
    }
    if (isUploadingAttachment || cameraUploading) {
      toast('Wait for the attachment upload to finish before sending.', 'info');
      return;
    }
    void submitMessage(inputText, voiceDraft, attachments);
  }, [
    attachments,
    cameraUploading,
    inputText,
    isCameraRecording,
    isUploadingAttachment,
    isVoiceNoteRecording,
    submitMessage,
    voiceDraft,
  ]);

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

  const uploadAttachmentFile = useCallback(async (file: File) => {
    setIsUploadingAttachment(true);

    try {
      const response = await uploadApi.upload(file);
      const upload = response.data as {
        url?: string;
        originalName?: string;
        size?: number;
        type?: string;
      };
      const mimeType = String(upload.type ?? file.type ?? 'application/octet-stream');
      const url = String(upload.url ?? '');

      if (!url) {
        throw new Error('Upload response was missing a file URL');
      }

      setAttachments(previous => [
        ...previous,
        {
          id: uuidv4(),
          name: String(upload.originalName ?? file.name),
          url,
          mimeType,
          kind: getAttachmentKind(mimeType),
          size: typeof upload.size === 'number' ? upload.size : file.size,
        },
      ]);
    } catch (error) {
      toast(`Could not upload ${file.name}.`, 'error');
      throw error;
    } finally {
      setIsUploadingAttachment(false);
    }
  }, []);

  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments(previous =>
      previous.filter(attachment => attachment.id !== attachmentId),
    );
  }, []);

  const closeCameraModal = useCallback(
    (discard = true) => {
      discardCameraDraftRef.current = discard;

      if (
        cameraRecorderRef.current?.state &&
        cameraRecorderRef.current.state !== 'inactive'
      ) {
        cameraRecorderRef.current.stop();
        return;
      }

      resetCameraRecorder();
      clearCameraStream();
      setCameraUploading(false);
      setShowCamera(false);
    },
    [clearCameraStream, resetCameraRecorder],
  );

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

  const startCameraStream = useCallback(async (nextMode: CameraMode) => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      toast('Camera capture is not supported in this browser.', 'error');
      return false;
    }

    if (isCameraRecording) {
      toast('Stop the current recording before switching modes.', 'info');
      return false;
    }

    clearCameraStream();
    setCameraMode(nextMode);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: nextMode === 'video',
      });
      cameraStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }

      return true;
    } catch {
      toast(
        nextMode === 'video'
          ? 'Camera and microphone access are required to record video.'
          : 'Camera access is required to take a photo.',
        'error',
      );
      setShowCamera(false);
      return false;
    }
  }, [clearCameraStream, isCameraRecording]);

  const handleCamera = useCallback(() => {
    setShowCamera(true);
    void startCameraStream('video');
  }, [startCameraStream]);

  const snapPhoto = useCallback(async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', 0.92),
    );

    if (!blob) {
      toast('Could not capture the photo. Please try again.', 'error');
      return;
    }

    setCameraUploading(true);

    try {
      const file = new File([blob], `camera-photo-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });
      await uploadAttachmentFile(file);
      closeCameraModal();
    } catch {
      // Upload errors are surfaced by uploadAttachmentFile.
    } finally {
      setCameraUploading(false);
    }
  }, [closeCameraModal, uploadAttachmentFile]);

  const stopCameraRecording = useCallback(
    (discard = false) => {
      const recorder = cameraRecorderRef.current;
      discardCameraDraftRef.current = discard;
      clearCameraTimer();
      setIsCameraRecording(false);

      if (recorder && recorder.state !== 'inactive') {
        recorder.stop();
        return;
      }

      if (discard) {
        closeCameraModal(true);
      } else {
        resetCameraRecorder();
      }
    },
    [clearCameraTimer, closeCameraModal, resetCameraRecorder],
  );

  const startCameraRecording = useCallback(async () => {
    if (cameraUploading || isUploadingAttachment) {
      toast('Wait for the current upload to finish first.', 'info');
      return;
    }

    if (cameraMode !== 'video') {
      const switched = await startCameraStream('video');
      if (!switched) return;
    }

    const existingStream = cameraStreamRef.current;
    if (!existingStream) {
      const started = await startCameraStream('video');
      if (!started || !cameraStreamRef.current) return;
    }

    if (typeof MediaRecorder === 'undefined') {
      toast('Video recording is not supported in this browser.', 'error');
      return;
    }

    const stream = cameraStreamRef.current;
    if (!stream) return;

    cameraChunksRef.current = [];
    cameraStartedAtRef.current = Date.now();
    discardCameraDraftRef.current = false;

    const preferredMimeType = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ].find(type => MediaRecorder.isTypeSupported(type));

    const recorder = preferredMimeType
      ? new MediaRecorder(stream, { mimeType: preferredMimeType })
      : new MediaRecorder(stream);

    cameraRecorderRef.current = recorder;
    recorder.ondataavailable = event => {
      if (event.data.size > 0) cameraChunksRef.current.push(event.data);
    };

    recorder.onstop = async () => {
      const durationMs = cameraStartedAtRef.current
        ? Date.now() - cameraStartedAtRef.current
        : cameraDurationMs;
      const shouldDiscard = discardCameraDraftRef.current;
      const chunks = [...cameraChunksRef.current];

      resetCameraRecorder();

      if (shouldDiscard) {
        closeCameraModal(true);
        return;
      }

      if (!chunks.length) {
        toast('No video was captured. Try again.', 'error');
        closeCameraModal(true);
        return;
      }

      const blob = new Blob(chunks, {
        type: recorder.mimeType || 'video/webm',
      });
      const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
      const file = new File(
        [blob],
        `camera-clip-${Date.now()}-${durationMs}.${extension}`,
        { type: blob.type || 'video/webm' },
      );

      setCameraUploading(true);
      try {
        await uploadAttachmentFile(file);
        closeCameraModal(false);
      } catch {
        closeCameraModal(true);
      } finally {
        setCameraUploading(false);
      }
    };

    recorder.start();
    setIsCameraRecording(true);
    cameraTimerRef.current = window.setInterval(() => {
      if (!cameraStartedAtRef.current) return;

      const elapsed = Date.now() - cameraStartedAtRef.current;
      setCameraDurationMs(elapsed);

      if (elapsed >= CAMERA_VIDEO_MAX_MS) {
        toast('Video clips are limited to 30 seconds.', 'info');
        stopCameraRecording(false);
      }
    }, 200);
  }, [
    cameraDurationMs,
    cameraMode,
    cameraUploading,
    closeCameraModal,
    isUploadingAttachment,
    resetCameraRecorder,
    startCameraStream,
    stopCameraRecording,
    uploadAttachmentFile,
  ]);

  const handleNewChat = () => {
    if (isVoiceNoteRecording) stopVoiceNoteRecording(true);
    if (isCameraRecording) stopCameraRecording(true);
    setMessages([]);
    setInputText('');
    setAttachments([]);
    setVoiceDraft(null);
    setVoiceDurationMs(0);
    closeCameraModal(true);
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
                                shouldRenderMessageText(message) ||
                                (message.attachments?.length ?? 0) > 0
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
                        {(message.attachments?.length ?? 0) > 0 && (
                          <div
                            style={{
                              display: 'grid',
                              gap: 10,
                              marginBottom: shouldRenderMessageText(message) ? '0.7rem' : 0,
                            }}
                          >
                            {message.attachments?.map((attachment, index) => {
                              const mediaUrl = resolveBackendUrl(attachment.url);
                              const attachmentKey = `${attachment.url}-${index}`;
                              const frameStyle = {
                                padding: '0.6rem 0.7rem',
                                background:
                                  message.role === 'user'
                                    ? 'rgba(255,255,255,0.14)'
                                    : 'var(--bg)',
                                borderRadius: 14,
                                border:
                                  message.role === 'user'
                                    ? '1px solid rgba(255,255,255,0.16)'
                                    : '1px solid var(--border)',
                              } as const;

                              if (attachment.kind === 'image') {
                                return (
                                  <div key={attachmentKey} style={frameStyle}>
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
                                      Photo attachment
                                    </div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      alt={attachment.name}
                                      src={mediaUrl}
                                      style={{
                                        width: '100%',
                                        maxWidth: 320,
                                        borderRadius: 12,
                                        display: 'block',
                                      }}
                                    />
                                  </div>
                                );
                              }

                              if (attachment.kind === 'video') {
                                return (
                                  <div key={attachmentKey} style={frameStyle}>
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
                                      Video attachment
                                    </div>
                                    <video
                                      controls
                                      preload="metadata"
                                      src={mediaUrl}
                                      style={{
                                        width: '100%',
                                        minWidth: 220,
                                        maxWidth: 320,
                                        borderRadius: 12,
                                      }}
                                    />
                                  </div>
                                );
                              }

                              return (
                                <div key={attachmentKey} style={frameStyle}>
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
                                    File attachment
                                  </div>
                                  <a
                                    href={mediaUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      color:
                                        message.role === 'user'
                                          ? 'white'
                                          : 'var(--accent)',
                                      textDecoration: 'underline',
                                      fontWeight: 600,
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    {attachment.name}
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {shouldRenderMessageText(message) &&
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
                {attachments.map(attachment => (
                  <div
                    key={attachment.id}
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
                    {attachment.kind === 'image'
                      ? `Photo: ${attachment.name}`
                      : attachment.kind === 'video'
                        ? `Video: ${attachment.name}`
                        : attachment.name}
                    <button
                      onClick={() => removeAttachment(attachment.id)}
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

            {(isUploadingAttachment || cameraUploading) && (
              <div style={{ padding: '0 1rem 0.6rem' }}>
                <div
                  style={{
                    padding: '0.7rem 0.85rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: '0.78rem',
                    color: 'var(--text2)',
                  }}
                >
                  Uploading attachment...
                </div>
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
                    aria-label="Voice typing"
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
                    <Mic size={16} strokeWidth={2.1} />
                  </button>
                  <button
                    onClick={() =>
                      isVoiceNoteRecording
                        ? stopVoiceNoteRecording(false)
                        : void startVoiceNoteRecording()
                    }
                    aria-label={isVoiceNoteRecording ? 'Stop voice note' : 'Record voice note'}
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
                    {isVoiceNoteRecording ? (
                      <Square size={15} fill="currentColor" strokeWidth={2.1} />
                    ) : (
                      <Circle size={16} strokeWidth={2.1} />
                    )}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach file"
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
                    <FileUp size={16} strokeWidth={2.1} />
                  </button>
                  <button
                    onClick={() => imgInputRef.current?.click()}
                    aria-label="Attach image"
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
                    <ImagePlus size={16} strokeWidth={2.1} />
                  </button>
                  <button
                    onClick={handleCamera}
                    aria-label="Camera / video"
                    title="Camera / video"
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
                    <Camera size={16} strokeWidth={2.1} />
                  </button>
                </div>
                <button
                  onClick={handleSendCurrentMessage}
                  disabled={
                    isVoiceNoteRecording ||
                    isCameraRecording ||
                    isUploadingAttachment ||
                    cameraUploading ||
                    (!inputText.trim() && !attachments.length && !voiceDraft)
                  }
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
                      isCameraRecording ||
                      isUploadingAttachment ||
                      cameraUploading ||
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
                  void uploadAttachmentFile(e.target.files[0]);
                }
                e.target.value = '';
              }}
            />
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files?.[0]) {
                  void uploadAttachmentFile(e.target.files[0]);
                }
                e.target.value = '';
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
              Camera capture
            </h3>
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: '1rem',
              }}
            >
              {(['photo', 'video'] as CameraMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    if (mode !== cameraMode) {
                      void startCameraStream(mode);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: 999,
                    border:
                      cameraMode === mode
                        ? '1px solid var(--accent-border)'
                        : '1px solid var(--border)',
                    background:
                      cameraMode === mode ? 'var(--accent-lt)' : 'var(--bg)',
                    color: cameraMode === mode ? 'var(--accent)' : 'var(--text2)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                  }}
                >
                  {mode === 'photo' ? 'Photo' : 'Video'}
                </button>
              ))}
            </div>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                borderRadius: 'var(--radius)',
                marginBottom: '1rem',
                background: '#0f172a',
              }}
            />
            {cameraMode === 'video' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  marginBottom: '1rem',
                  padding: '0.65rem 0.8rem',
                  borderRadius: 12,
                  background: isCameraRecording ? '#fff2f2' : 'var(--bg)',
                  border:
                    isCameraRecording
                      ? '1px solid rgba(220, 38, 38, 0.18)'
                      : '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: isCameraRecording ? '#dc2626' : 'var(--text3)',
                      display: 'inline-block',
                      animation: isCameraRecording ? 'pulse 1.3s infinite' : 'none',
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--text)',
                      }}
                    >
                      {isCameraRecording ? 'Recording clip' : 'Ready to record'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
                      {formatDuration(cameraDurationMs)} / 0:30 max
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    isCameraRecording
                      ? stopCameraRecording(false)
                      : void startCameraRecording()
                  }
                  disabled={cameraUploading}
                  style={{
                    padding: '0.42rem 0.8rem',
                    background: isCameraRecording ? '#dc2626' : 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: cameraUploading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    opacity: cameraUploading ? 0.6 : 1,
                  }}
                >
                  {isCameraRecording ? 'Stop' : 'Record'}
                </button>
              </div>
            )}
            {cameraUploading && (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.65rem 0.8rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  fontSize: '0.76rem',
                  color: 'var(--text2)',
                }}
              >
                Uploading camera attachment...
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              {cameraMode === 'photo' ? (
                <button
                  onClick={() => void snapPhoto()}
                  disabled={cameraUploading}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: cameraUploading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    opacity: cameraUploading ? 0.6 : 1,
                  }}
                >
                  Snap
                </button>
              ) : (
                <button
                  onClick={() => stopCameraRecording(true)}
                  disabled={!isCameraRecording && !cameraUploading}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    background: 'var(--white)',
                    border: '1px solid rgba(220, 38, 38, 0.15)',
                    borderRadius: 8,
                    cursor:
                      !isCameraRecording && !cameraUploading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    color: '#991b1b',
                    opacity: !isCameraRecording && !cameraUploading ? 0.5 : 1,
                  }}
                >
                  Discard
                </button>
              )}
              <button
                onClick={() => closeCameraModal(true)}
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
                {cameraMode === 'photo' ? 'Cancel' : 'Close'}
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
