import { Injectable } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class DashboardService {
  constructor(private readonly chatService: ChatService) {}

  getStats(userId: string) {
    const sessions = this.chatService.getUserSessions(userId);
    const totalMessages = sessions.reduce(
      (sum, s) => sum + s.messages.length,
      0,
    );
    const totalRequests = sessions.reduce(
      (sum, s) => sum + Math.floor(s.messages.length / 2),
      0,
    );

    // Mock model usage breakdown
    const modelUsageMap = new Map<string, number>();
    for (const session of sessions) {
      const current = modelUsageMap.get(session.modelId) ?? 0;
      modelUsageMap.set(
        session.modelId,
        current + Math.floor(session.messages.length / 2),
      );
    }
    const modelUsage = Array.from(modelUsageMap.entries()).map(
      ([model, count]) => ({ model, count }),
    );

    return {
      totalRequests: totalRequests || 42,
      totalMessages: totalMessages || 86,
      avgLatency: 820, // ms – mock value
      cost: parseFloat((totalRequests * 0.002).toFixed(4)) || 0.084,
      modelUsage: modelUsage.length
        ? modelUsage
        : [
            { model: 'gpt-5', count: 18 },
            { model: 'claude-opus-4-5', count: 12 },
            { model: 'gemini-2-0-ultra', count: 8 },
            { model: 'deepseek-r2', count: 4 },
          ],
      activeSessions: sessions.length,
    };
  }

  getHistory(userId: string, page = 1, limit = 20) {
    return this.chatService.getChatHistory(userId, page, limit);
  }

  getBilling(userId: string) {
    const sessions = this.chatService.getUserSessions(userId);
    const totalRequests = sessions.reduce(
      (sum, s) => sum + Math.floor(s.messages.length / 2),
      0,
    );
    const totalCost = parseFloat((totalRequests * 0.002).toFixed(4)) || 0.084;

    return {
      plan: 'Pro',
      status: 'active',
      billingCycle: 'monthly',
      nextBillingDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      usage: {
        requests: totalRequests || 42,
        limit: 10000,
        percentUsed: Math.min(
          ((totalRequests || 42) / 10000) * 100,
          100,
        ).toFixed(1),
      },
      cost: {
        current: totalCost,
        projected: parseFloat((totalCost * 1.3).toFixed(4)),
        currency: 'USD',
      },
      invoices: [
        { id: 'inv-001', date: '2026-03-01', amount: 12.5, status: 'paid' },
        { id: 'inv-002', date: '2026-02-01', amount: 9.8, status: 'paid' },
        { id: 'inv-003', date: '2026-01-01', amount: 14.2, status: 'paid' },
      ],
    };
  }
}
