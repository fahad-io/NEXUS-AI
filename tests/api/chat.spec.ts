import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const RUN_ID = Date.now();

async function createAuthUser(request: any, suffix: string) {
  const email = `chatuser_${suffix}_${RUN_ID}@example.com`;
  const res = await request.post(`${BASE_URL}/api/auth/signup`, {
    data: { email, name: 'Chat User', password: 'SecurePass123' },
  });
  const body = await res.json();
  return { email, token: body.access_token, userId: body.user?.id };
}

test.describe('chat', () => {

  // ─── TC-026: Guest user sends message ────────────────────────────────────
  test('Guest user sends message and receives AI reply', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat/send`, {
      headers: { 'x-session-id': `550e8400-e29b-41d4-a716-${RUN_ID}` },
      data: { message: 'Hello, how are you?', modelId: 'gpt-4o-mini' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('reply');
    expect(typeof body.reply).toBe('string');
    expect(body).toHaveProperty('modelId', 'gpt-4o-mini');
    expect(body).toHaveProperty('sessionId');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('session');
  });

  // ─── TC-027: Authenticated user sends message ─────────────────────────────
  test('Authenticated user sends message and receives AI reply', async ({ request }) => {
    const { token } = await createAuthUser(request, 'send');
    const response = await request.post(`${BASE_URL}/api/chat/send`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { message: 'Explain NLP to me', modelId: 'gpt-4o-mini' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('reply');
    expect(body).toHaveProperty('sessionId');
    expect(body.session).toHaveProperty('isGuest', false);
  });

  // ─── TC-028: Chat send empty message ─────────────────────────────────────
  test('Chat send with empty message returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat/send`, {
      data: { message: '', modelId: 'gpt-4o-mini' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-029: Chat send missing modelId ───────────────────────────────────
  test('Chat send without modelId returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat/send`, {
      data: { message: 'Hello world' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-030: Chat send message too long ──────────────────────────────────
  test('Chat send with message exceeding 10000 chars returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat/send`, {
      data: { message: 'A'.repeat(10001), modelId: 'gpt-4o-mini' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-031: Chat send continues existing session ─────────────────────────
  test('Chat send with sessionId continues existing guest session', async ({ request }) => {
    const firstRes = await request.post(`${BASE_URL}/api/chat/send`, {
      data: { message: 'First message', modelId: 'gpt-4o-mini' },
    });
    const firstBody = await firstRes.json();
    const sessionId = firstBody.sessionId;

    const secondRes = await request.post(`${BASE_URL}/api/chat/send`, {
      data: { message: 'Follow up question', modelId: 'gpt-4o-mini', sessionId },
    });
    expect(secondRes.status()).toBe(200);
    const secondBody = await secondRes.json();
    expect(secondBody.sessionId).toBe(sessionId);
    expect(secondBody.session.messages.length).toBeGreaterThanOrEqual(4);
  });

  // ─── TC-032: Chat send invalid type enum ─────────────────────────────────
  test('Chat send with invalid type enum value returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat/send`, {
      data: { message: 'Hello', modelId: 'gpt-4o-mini', type: 'invalid_type' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-033: Create session authenticated ─────────────────────────────────
  test('Authenticated user creates a new chat session', async ({ request }) => {
    const { token } = await createAuthUser(request, 'session');
    const response = await request.post(`${BASE_URL}/api/chat/session`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { modelId: 'gpt-4o-mini', title: 'Test Session' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('sessionId');
    expect(body).toHaveProperty('session');
  });

  // ─── TC-034: Create session without JWT ──────────────────────────────────
  test('Create session without JWT returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat/session`, {
      data: { modelId: 'gpt-4o-mini' },
    });
    expect(response.status()).toBe(401);
  });

  // ─── TC-035: GET session - owner access ───────────────────────────────────
  test('Authenticated user retrieves their own session', async ({ request }) => {
    const { token } = await createAuthUser(request, 'getsession');
    const createRes = await request.post(`${BASE_URL}/api/chat/session`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { modelId: 'gpt-4o-mini', title: 'My Session' },
    });
    const { sessionId } = await createRes.json();

    const response = await request.get(`${BASE_URL}/api/chat/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('messages');
  });

  // ─── TC-036: GET session - cross-user access denied ──────────────────────
  test('GET session owned by another user returns 404', async ({ request }) => {
    const userA = await createAuthUser(request, 'A');
    const userB = await createAuthUser(request, 'B');

    const createRes = await request.post(`${BASE_URL}/api/chat/session`, {
      headers: { Authorization: `Bearer ${userA.token}` },
      data: { modelId: 'gpt-4o-mini' },
    });
    const { sessionId } = await createRes.json();

    const response = await request.get(`${BASE_URL}/api/chat/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${userB.token}` },
    });
    expect(response.status()).toBe(404);
  });

  // ─── TC-037: GET session without JWT ─────────────────────────────────────
  test('GET session without JWT returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/chat/session/some-fake-id`);
    expect(response.status()).toBe(401);
  });

  // ─── TC-038: DELETE session - owner ───────────────────────────────────────
  test('Authenticated user deletes their own session', async ({ request }) => {
    const { token } = await createAuthUser(request, 'delete');
    const createRes = await request.post(`${BASE_URL}/api/chat/session`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { modelId: 'gpt-4o-mini' },
    });
    const { sessionId } = await createRes.json();

    const deleteRes = await request.delete(`${BASE_URL}/api/chat/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(deleteRes.status()).toBe(200);
    const body = await deleteRes.json();
    expect(body.success).toBe(true);

    const getRes = await request.get(`${BASE_URL}/api/chat/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(getRes.status()).toBe(404);
  });

  // ─── TC-039: DELETE session - cross-user denied ───────────────────────────
  test('DELETE session owned by another user returns 404', async ({ request }) => {
    const userA = await createAuthUser(request, 'delA');
    const userB = await createAuthUser(request, 'delB');

    const createRes = await request.post(`${BASE_URL}/api/chat/session`, {
      headers: { Authorization: `Bearer ${userA.token}` },
      data: { modelId: 'gpt-4o-mini' },
    });
    const { sessionId } = await createRes.json();

    const response = await request.delete(`${BASE_URL}/api/chat/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${userB.token}` },
    });
    expect(response.status()).toBe(404);
  });

  // ─── TC-040: DELETE session without JWT ──────────────────────────────────
  test('DELETE session without JWT returns 401', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/api/chat/session/some-fake-id`);
    expect(response.status()).toBe(401);
  });

  // ─── TC-041: Chat history authenticated ──────────────────────────────────
  test('Authenticated user retrieves paginated chat history', async ({ request }) => {
    const { token } = await createAuthUser(request, 'history');
    const response = await request.get(`${BASE_URL}/api/chat/history?page=1&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('limit');
    expect(body).toHaveProperty('totalPages');
  });

  // ─── TC-042: Chat history without JWT ────────────────────────────────────
  test('Chat history without JWT returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/chat/history`);
    expect(response.status()).toBe(401);
  });

  // ─── TC-067: Chat send response schema ───────────────────────────────────
  test('Chat send response schema contains all required fields', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat/send`, {
      data: { message: 'Schema check message', modelId: 'gpt-4o-mini' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.reply).toBe('string');
    expect(typeof body.modelId).toBe('string');
    expect(typeof body.sessionId).toBe('string');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('session');
    expect(body.session).toHaveProperty('id');
    expect(body.session).toHaveProperty('modelId');
    expect(body.session).toHaveProperty('title');
    expect(body.session).toHaveProperty('isGuest');
    expect(Array.isArray(body.session.messages)).toBe(true);
  });

  // ─── TC-069: Guest auto-session creation ─────────────────────────────────
  test('Guest user sends message without session ID — session auto-created', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat/send`, {
      data: { message: 'Hello without session', modelId: 'gpt-4o-mini' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.sessionId).toBe('string');
    expect(body.sessionId.length).toBeGreaterThan(0);
    expect(body.session.isGuest).toBe(true);
  });

  // ─── TC-070: Authenticated user session isolation ─────────────────────────
  test('Authenticated user cannot hijack another user session via send', async ({ request }) => {
    const userA = await createAuthUser(request, 'isolateA');
    const userB = await createAuthUser(request, 'isolateB');

    const userARes = await request.post(`${BASE_URL}/api/chat/send`, {
      headers: { Authorization: `Bearer ${userA.token}` },
      data: { message: 'User A message', modelId: 'gpt-4o-mini' },
    });
    const userABody = await userARes.json();
    const userASessionId = userABody.sessionId;

    const response = await request.post(`${BASE_URL}/api/chat/send`, {
      headers: { Authorization: `Bearer ${userB.token}` },
      data: { message: 'Cross session hijack attempt', modelId: 'gpt-4o-mini', sessionId: userASessionId },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.sessionId).not.toBe(userASessionId);
  });

});
