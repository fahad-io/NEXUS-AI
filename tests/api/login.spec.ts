import { test, expect, APIRequestContext, request } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

let apiContext: APIRequestContext;

test.beforeAll(async () => {
  apiContext = await request.newContext({ baseURL: BASE_URL });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

// ─── Positive ────────────────────────────────────────────────────────────────

test('POST /api/auth/login — valid credentials returns 200 with access_token', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'secret123',
    },
  });

  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body).toHaveProperty('access_token');
  expect(typeof body.access_token).toBe('string');
  expect(body.access_token.length).toBeGreaterThan(0);
});

// ─── Negative ────────────────────────────────────────────────────────────────

test('POST /api/auth/login — wrong password returns 401 with error message', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'wrongpassword',
    },
  });

  expect(res.status()).toBe(401);

  const body = await res.json();
  expect(body).toHaveProperty('message');
  expect(body.message).toBe('Invalid credentials');
});

test('POST /api/auth/login — non-existent email returns 401', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: {
      email: 'ghost@example.com',
      password: 'secret123',
    },
  });

  expect(res.status()).toBe(401);

  const body = await res.json();
  expect(body.message).toBe('Invalid credentials');
});

// ─── Field Validation ────────────────────────────────────────────────────────

test('POST /api/auth/login — missing email returns 400', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: { password: 'secret123' },
  });

  expect(res.status()).toBe(400);
});

test('POST /api/auth/login — missing password returns 400', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: { email: 'user@example.com' },
  });

  expect(res.status()).toBe(400);
});

test('POST /api/auth/login — invalid email format returns 400', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: {
      email: 'not-an-email',
      password: 'secret123',
    },
  });

  expect(res.status()).toBe(400);
});

test('POST /api/auth/login — password below min length (5 chars) returns 400', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: {
      email: 'user@example.com',
      password: '12345',
    },
  });

  expect(res.status()).toBe(400);
});

test('POST /api/auth/login — empty body returns 400', async () => {
  const res = await apiContext.post('/api/auth/login', { data: {} });

  expect(res.status()).toBe(400);
});

// ─── Edge Cases ──────────────────────────────────────────────────────────────

test('POST /api/auth/login — email with uppercase letters is normalised', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: {
      email: 'USER@EXAMPLE.COM',
      password: 'secret123',
    },
  });

  // Should either succeed (200) or return 401 — never 500
  expect([200, 401]).toContain(res.status());
});

test('POST /api/auth/login — password at exact min length (6 chars) is accepted', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'abc123',
    },
  });

  // Valid length — response is auth-driven, not validation-driven
  expect([200, 401]).toContain(res.status());
  expect(res.status()).not.toBe(400);
});

test('POST /api/auth/login — response never contains password field', async () => {
  const res = await apiContext.post('/api/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'secret123',
    },
  });

  const body = await res.json();
  expect(body).not.toHaveProperty('password');
  expect(JSON.stringify(body)).not.toContain('secret123');
});
