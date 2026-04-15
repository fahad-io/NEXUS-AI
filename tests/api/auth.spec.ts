import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const RUN_ID = Date.now();

test.describe('auth', () => {

  // ─── TC-001: Signup positive ───────────────────────────────────────────────
  test('Signup with valid credentials returns access token and user', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: {
        email: `newuser_${RUN_ID}@example.com`,
        name: 'New User',
        password: 'SecurePass123',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(typeof body.access_token).toBe('string');
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('email');
    expect(body.user).toHaveProperty('name');
    expect(body.user).toHaveProperty('role');
  });

  // ─── TC-002: Signup duplicate email ───────────────────────────────────────
  test('Signup with duplicate email returns 409 Conflict', async ({ request }) => {
    const email = `dup_${RUN_ID}@example.com`;
    await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email, name: 'First User', password: 'SecurePass123' },
    });
    const response = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email, name: 'Duplicate User', password: 'SecurePass123' },
    });
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.message).toMatch(/email already in use/i);
  });

  // ─── TC-003: Signup missing fields ────────────────────────────────────────
  test('Signup with missing required fields returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: {},
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  // ─── TC-004: Signup invalid email format ──────────────────────────────────
  test('Signup with invalid email format returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email: 'not-an-email', name: 'Test User', password: 'SecurePass123' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-005: Signup password too short ────────────────────────────────────
  test('Signup with password shorter than 6 chars returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email: `short_${RUN_ID}@example.com`, name: 'Test User', password: '12345' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-006: Signup name too short ────────────────────────────────────────
  test('Signup with name shorter than 2 chars returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email: `shortname_${RUN_ID}@example.com`, name: 'A', password: 'SecurePass123' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-007: Login positive ────────────────────────────────────────────────
  test('Login with valid credentials returns access token', async ({ request }) => {
    const email = `logintest_${RUN_ID}@example.com`;
    await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email, name: 'Login Test', password: 'ValidPass123' },
    });
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { email, password: 'ValidPass123' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('refresh_token');
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('email');
    expect(body.user).toHaveProperty('name');
    expect(body.user).toHaveProperty('role');
  });

  // ─── TC-008: Login wrong password ─────────────────────────────────────────
  test('Login with wrong password returns 401', async ({ request }) => {
    const email = `wrongpwd_${RUN_ID}@example.com`;
    await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email, name: 'Wrong Pwd User', password: 'ValidPass123' },
    });
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { email, password: 'WrongPassword' },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toMatch(/invalid credentials/i);
  });

  // ─── TC-009: Login non-existent email ─────────────────────────────────────
  test('Login with non-existent email returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { email: `nonexistent_${RUN_ID}@example.com`, password: 'SomePassword123' },
    });
    expect(response.status()).toBe(401);
  });

  // ─── TC-010: Login invalid email format ───────────────────────────────────
  test('Login with invalid email format returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { email: 'invalid-email', password: 'ValidPass123' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-011: Login empty body ─────────────────────────────────────────────
  test('Login with empty body returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {},
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-012: GET /auth/me with valid JWT ──────────────────────────────────
  test('GET /auth/me with valid JWT returns authenticated user', async ({ request }) => {
    const email = `metest_${RUN_ID}@example.com`;
    const signupRes = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email, name: 'Me Test', password: 'SecurePass123' },
    });
    const { access_token } = await signupRes.json();

    const response = await request.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('email', email);
  });

  // ─── TC-013: GET /auth/me without JWT ────────────────────────────────────
  test('GET /auth/me without JWT returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`);
    expect(response.status()).toBe(401);
  });

  // ─── TC-014: GET /auth/me with malformed JWT ─────────────────────────────
  test('GET /auth/me with malformed JWT returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: 'Bearer not-a-real-token' },
    });
    expect(response.status()).toBe(401);
  });

  // ─── TC-015: Refresh with valid cookie ───────────────────────────────────
  test('Token refresh with valid refresh cookie returns new access token', async ({ request }) => {
    const email = `refresh_${RUN_ID}@example.com`;
    const signupRes = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email, name: 'Refresh Test', password: 'SecurePass123' },
    });
    expect(signupRes.status()).toBe(201);

    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { email, password: 'SecurePass123' },
    });
    const loginBody = await loginRes.json();
    const refreshToken = loginBody.refresh_token;

    const response = await request.post(`${BASE_URL}/api/auth/refresh`, {
      headers: { Cookie: `refresh_token=${refreshToken}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('user');
  });

  // ─── TC-016: Refresh without cookie ──────────────────────────────────────
  test('Token refresh without cookie returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/refresh`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toMatch(/refresh token is missing/i);
  });

  // ─── TC-017: Refresh with tampered token ─────────────────────────────────
  test('Token refresh with tampered token returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/refresh`, {
      headers: { Cookie: 'refresh_token=tampered_invalid_token' },
    });
    expect(response.status()).toBe(401);
  });

  // ─── TC-018: Logout with valid cookie ────────────────────────────────────
  test('Logout with valid refresh cookie clears session', async ({ request }) => {
    const email = `logout_${RUN_ID}@example.com`;
    await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email, name: 'Logout Test', password: 'SecurePass123' },
    });
    const loginRes = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { email, password: 'SecurePass123' },
    });
    const { refresh_token } = await loginRes.json();

    const response = await request.post(`${BASE_URL}/api/auth/logout`, {
      headers: { Cookie: `refresh_token=${refresh_token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  // ─── TC-019: Logout without cookie ───────────────────────────────────────
  test('Logout without cookie still returns 200 (graceful degradation)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/logout`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  // ─── TC-065: Signup response schema no password exposure ─────────────────
  test('Signup response schema must not expose password hash', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: {
        email: `schema_${RUN_ID}@example.com`,
        name: 'Schema Test',
        password: 'SecurePass123',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('user');
    expect(body.user).not.toHaveProperty('password');
    expect(body.user).not.toHaveProperty('passwordHash');
    expect(body.user).not.toHaveProperty('refreshTokenHash');
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('email');
    expect(body.user).toHaveProperty('name');
    expect(body.user).toHaveProperty('role');
  });

  // ─── TC-066: Login response schema no sensitive data leakage ─────────────
  test('Login response schema and no sensitive data leakage', async ({ request }) => {
    const email = `schema2_${RUN_ID}@example.com`;
    await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email, name: 'Schema2 Test', password: 'SecurePass123' },
    });
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: { email, password: 'SecurePass123' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('refresh_token');
    expect(body).toHaveProperty('user');
    expect(body.user).not.toHaveProperty('password');
    expect(body.user).not.toHaveProperty('refreshTokenHash');
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

});
