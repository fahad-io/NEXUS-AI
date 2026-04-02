import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ChatSession, ChatSessionDocument } from '../schemas/chat-session.schema';
import { SendMessageDto } from './dto/send-message.dto';

const MOCK_RESPONSES = [
  "That's a great question! Based on your requirements, I'd recommend exploring the latest models. GPT-5 excels at reasoning, Claude Opus at analysis, and Gemini at multimodal tasks.",
  "I can help with that! Here's a structured approach:\n\n1. **Define your requirements** clearly\n2. **Select the right model** based on your use case\n3. **Optimize your prompts** for best results\n4. **Monitor and iterate** based on outputs",
  'Excellent choice! This model is well-suited for your task. Would you like me to walk you through the best prompting strategies?',
  "Here's what I found: The AI landscape is evolving rapidly. The top models to watch are GPT-5, Claude Opus 4.5, and Gemini 2.0 Ultra — each offering unique capabilities.",
];

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatSession.name) private sessionModel: Model<ChatSessionDocument>,
    private configService: ConfigService,
  ) {}

  async createSession(userId?: string, modelId = 'gpt-5', title = 'New Chat'): Promise<ChatSessionDocument> {
    const isGuest = !userId;
    const session = new this.sessionModel({
      userId: userId ? new Types.ObjectId(userId) : undefined,
      modelId,
      title,
      messages: [],
      isGuest,
      expiresAt: isGuest ? new Date(Date.now() + 3 * 60 * 60 * 1000) : undefined,
    });
    return session.save();
  }

  async getSession(sessionId: string): Promise<ChatSessionDocument | null> {
    return this.sessionModel.findById(sessionId).exec();
  }

  async getUserSessions(userId: string): Promise<ChatSessionDocument[]> {
    return this.sessionModel
      .find({ userId: new Types.ObjectId(userId), isGuest: false })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async deleteSession(sessionId: string, userId?: string): Promise<boolean> {
    const query: any = { _id: sessionId };
    if (userId) query.userId = new Types.ObjectId(userId);
    const result = await this.sessionModel.deleteOne(query).exec();
    return result.deletedCount > 0;
  }

  private serializeSession(session: ChatSessionDocument) {
    return {
      id: (session._id as Types.ObjectId).toString(),
      modelId: session.modelId,
      title: session.title,
      isGuest: session.isGuest,
      createdAt: (session as any).createdAt?.toISOString?.() ?? null,
      updatedAt: (session as any).updatedAt?.toISOString?.() ?? null,
      expiresAt: session.expiresAt?.toISOString?.() ?? null,
      messages: session.messages.map(message => ({
        role: message.role,
        content: message.content,
        type: message.type ?? 'text',
        audioUrl: message.audioUrl,
        audioDurationMs: message.audioDurationMs,
        attachments: message.attachments ?? [],
        timestamp: message.timestamp instanceof Date
          ? message.timestamp.toISOString()
          : new Date(message.timestamp).toISOString(),
      })),
    };
  }

  async sendMessage(dto: SendMessageDto, userId?: string, guestSessionId?: string) {
    const isMock = this.configService.get<string>('MOCK_AI', 'true') === 'true';
    const incomingSessionId = dto.sessionId || guestSessionId;

    let session: ChatSessionDocument | null = null;
    if (incomingSessionId) {
      try { session = await this.getSession(incomingSessionId); } catch { /* invalid id */ }
    }
    if (!session) {
      session = await this.createSession(userId, dto.modelId);
    }

    session.messages.push({
      role: 'user',
      content: dto.message,
      type: dto.type ?? 'text',
      audioUrl: dto.audioUrl,
      audioDurationMs: dto.audioDurationMs,
      attachments: dto.attachments ?? [],
      timestamp: new Date(),
    });

    const history = dto.history ?? session.messages.slice(-20).map(m => ({ role: m.role, content: m.content }));

    const reply = isMock
      ? this.getMockReply(dto.message)
      : await this.callKimiApi(dto.message, dto.modelId, history);

    const ts = new Date();
    session.messages.push({
      role: 'assistant',
      content: reply,
      type: 'text',
      timestamp: ts,
    });

    if (session.messages.length === 2) {
      session.title = dto.message.slice(0, 60) + (dto.message.length > 60 ? '...' : '');
    }

    // Mark messages as modified (Mongoose nested array)
    session.markModified('messages');
    (session as any).updatedAt = ts;
    await session.save();

    return {
      reply,
      modelId: dto.modelId,
      sessionId: (session._id as any).toString(),
      timestamp: ts,
      session: this.serializeSession(session),
    };
  }

  private getMockReply(message: string): string {
    return MOCK_RESPONSES[message.length % MOCK_RESPONSES.length];
  }

  private async callKimiApi(
    message: string,
    modelId: string,
    history: { role: string; content: string }[],
  ): Promise<string> {
    const apiKey = this.configService.get<string>('AI_API_KEY', '');
    const baseUrl = this.configService.get<string>('AI_BASE_URL', 'https://api.moonshot.cn/v1');

    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant in an AI Model Hub platform.' },
      ...history.slice(-20),
      { role: 'user', content: message },
    ];

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: modelId === 'kimi-moonshot' ? 'moonshot-v1-128k' : 'moonshot-v1-8k',
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) throw new Error(`Kimi API error: ${response.status}`);
    const data = (await response.json()) as { choices: { message: { content: string } }[] };
    return data.choices?.[0]?.message?.content ?? 'No response from model.';
  }

  async getChatHistory(userId: string, page = 1, limit = 20) {
    const total = await this.sessionModel.countDocuments({ userId: new Types.ObjectId(userId), isGuest: false });
    const data = await this.sessionModel
      .find({ userId: new Types.ObjectId(userId), isGuest: false })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return {
      data: data.map(session => this.serializeSession(session)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
