import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SendMessageDto } from './dto/send-message.dto';

const MOCK_RESPONSES = [
  "That's a great question! Based on your requirements, I'd recommend exploring the latest models available in the marketplace. Each model has unique strengths — GPT-5 excels at reasoning, Claude Opus at analysis, and Gemini at multimodal tasks.",
  "I can help you with that! Here's a structured approach:\n\n1. **Define your requirements** clearly\n2. **Select the right model** based on your use case\n3. **Optimize your prompts** for best results\n4. **Monitor and iterate** based on outputs",
  'Excellent choice! This model is well-suited for your task. Would you like me to walk you through the best prompting strategies for optimal results?',
  "Here's what I found: The AI landscape is evolving rapidly. The key models to watch are GPT-5, Claude Opus 4.5, and Gemini 2.0 Ultra — each offering unique capabilities for different use cases.",
];

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId?: string;
  modelId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  isGuest: boolean;
}

@Injectable()
export class ChatService {
  private readonly sessions = new Map<string, ChatSession>();

  constructor(private configService: ConfigService) {
    // Periodically clean expired guest sessions every 15 minutes
    setInterval(() => this.cleanExpiredSessions(), 15 * 60 * 1000);
  }

  // ─── Session Management ───────────────────────────────────────────────────

  createSession(
    userId?: string,
    modelId = 'gpt-5',
    title = 'New Chat',
  ): ChatSession {
    const isGuest = !userId;
    const session: ChatSession = {
      id: uuidv4(),
      userId,
      modelId,
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isGuest,
      expiresAt: isGuest
        ? new Date(Date.now() + 3 * 60 * 60 * 1000)
        : undefined,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): ChatSession | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    // Check expiry for guest sessions
    if (
      session.isGuest &&
      session.expiresAt &&
      session.expiresAt < new Date()
    ) {
      this.sessions.delete(sessionId);
      return undefined;
    }
    return session;
  }

  getUserSessions(userId: string): ChatSession[] {
    const results: ChatSession[] = [];
    for (const session of this.sessions.values()) {
      if (session.userId === userId) results.push(session);
    }
    return results.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }

  deleteSession(sessionId: string, userId?: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    if (userId && session.userId !== userId) return false;
    this.sessions.delete(sessionId);
    return true;
  }

  // ─── Send Message ─────────────────────────────────────────────────────────

  async sendMessage(
    dto: SendMessageDto,
    userId?: string,
    guestSessionId?: string,
  ) {
    const isMock = this.configService.get<string>('MOCK_AI', 'true') === 'true';

    // Resolve or create session
    let session: ChatSession | undefined;
    const incomingSessionId = dto.sessionId || guestSessionId;

    if (incomingSessionId) {
      session = this.getSession(incomingSessionId);
    }

    if (!session) {
      session = this.createSession(userId, dto.modelId);
    }

    // Add user message to session
    const userMsg: ChatMessage = {
      role: 'user',
      content: dto.message,
      timestamp: new Date(),
    };
    session.messages.push(userMsg);
    session.updatedAt = new Date();

    // Build history for request (from dto or session)
    const history =
      dto.history ??
      session.messages
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content }));

    // Get AI reply
    const reply = isMock
      ? this.getMockReply(dto.message)
      : await this.callKimiApi(dto.message, dto.modelId, history);

    // Add assistant message to session
    const assistantMsg: ChatMessage = {
      role: 'assistant',
      content: reply,
      timestamp: new Date(),
    };
    session.messages.push(assistantMsg);
    session.updatedAt = new Date();

    // Update title if first message
    if (session.messages.length === 2) {
      session.title =
        dto.message.slice(0, 60) + (dto.message.length > 60 ? '...' : '');
    }

    return {
      reply,
      modelId: dto.modelId,
      sessionId: session.id,
      timestamp: assistantMsg.timestamp,
    };
  }

  // ─── Mock AI ──────────────────────────────────────────────────────────────

  private getMockReply(message: string): string {
    // Simulate slight variability based on message hash
    const idx = message.length % MOCK_RESPONSES.length;
    return MOCK_RESPONSES[idx];
  }

  // ─── Kimi API ─────────────────────────────────────────────────────────────

  private async callKimiApi(
    message: string,
    modelId: string,
    history: { role: string; content: string }[],
  ): Promise<string> {
    const apiKey = this.configService.get<string>('KIMI_API_KEY', '');
    const baseUrl = this.configService.get<string>(
      'KIMI_BASE_URL',
      'https://api.moonshot.cn/v1',
    );

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant in an AI Model Hub platform.',
      },
      ...history.slice(-20),
      { role: 'user', content: message },
    ];

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:
          modelId === 'kimi-moonshot' ? 'moonshot-v1-128k' : 'moonshot-v1-8k',
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Kimi API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    return data.choices?.[0]?.message?.content ?? 'No response from model.';
  }

  // ─── History ──────────────────────────────────────────────────────────────

  getChatHistory(userId: string, page = 1, limit = 20) {
    const sessions = this.getUserSessions(userId);
    const total = sessions.length;
    const start = (page - 1) * limit;
    const data = sessions.slice(start, start + limit);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  private cleanExpiredSessions() {
    const now = new Date();
    for (const [id, session] of this.sessions.entries()) {
      if (session.isGuest && session.expiresAt && session.expiresAt < now) {
        this.sessions.delete(id);
      }
    }
  }
}
