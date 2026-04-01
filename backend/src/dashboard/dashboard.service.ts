import { Injectable } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class DashboardService {
  constructor(private readonly chatService: ChatService) {}

  async getStats(userId: string) {
    const sessions = await this.chatService.getUserSessions(userId);
    const totalMessages = sessions.reduce((sum, s) => sum + s.messages.length, 0);
    const totalRequests = sessions.reduce((sum, s) => sum + Math.floor(s.messages.length / 2), 0);

    const modelUsageMap = new Map<string, number>();
    for (const session of sessions) {
      const cur = modelUsageMap.get(session.modelId) ?? 0;
      modelUsageMap.set(session.modelId, cur + Math.floor(session.messages.length / 2));
    }
    const modelUsage = Array.from(modelUsageMap.entries()).map(([model, count]) => ({ model, count }));

    return {
      totalRequests: totalRequests || 0,
      totalMessages: totalMessages || 0,
      avgLatency: 820,
      cost: parseFloat((totalRequests * 0.002).toFixed(4)),
      modelUsage: modelUsage.length ? modelUsage : [],
      activeSessions: sessions.length,
    };
  }

  async getHistory(userId: string, page = 1, limit = 20) {
    return this.chatService.getChatHistory(userId, page, limit);
  }

  async getBilling(userId: string) {
    const sessions = await this.chatService.getUserSessions(userId);
    const totalRequests = sessions.reduce((sum, s) => sum + Math.floor(s.messages.length / 2), 0);
    const totalCost = parseFloat((totalRequests * 0.002).toFixed(4));

    return {
      plan: 'Free',
      status: 'active',
      billingCycle: 'monthly',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usage: { requests: totalRequests, limit: 1000, percentUsed: Math.min((totalRequests / 1000) * 100, 100).toFixed(1) },
      cost: { current: totalCost, projected: parseFloat((totalCost * 1.3).toFixed(4)), currency: 'USD' },
      invoices: [
        { id: 'inv-001', date: '2026-03-01', amount: 0, status: 'paid' },
        { id: 'inv-002', date: '2026-02-01', amount: 0, status: 'paid' },
      ],
    };
  }
}
