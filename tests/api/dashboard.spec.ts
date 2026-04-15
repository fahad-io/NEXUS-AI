import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const RUN_ID = Date.now();

async function createAuthUser(request: any) {
  const email = `dashuser_${RUN_ID}@example.com`;
  const res = await request.post(`${BASE_URL}/api/auth/signup`, {
    data: { email, name: 'Dash User', password: 'SecurePass123' },
  });
  const body = await res.json();
  return { email, token: body.access_token };
}

test.describe('dashboard', () => {

  // ─── TC-043: Dashboard stats authenticated ────────────────────────────────
  test('Authenticated user retrieves dashboard stats', async ({ request }) => {
    const { token } = await createAuthUser(request);
    const response = await request.get(`${BASE_URL}/api/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('totalRequests');
    expect(body).toHaveProperty('totalMessages');
    expect(body).toHaveProperty('avgLatency');
    expect(body).toHaveProperty('cost');
    expect(body).toHaveProperty('modelUsage');
    expect(body).toHaveProperty('activeSessions');
    expect(Array.isArray(body.modelUsage)).toBe(true);
  });

  // ─── TC-044: Dashboard stats without JWT ─────────────────────────────────
  test('Dashboard stats without JWT returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboard/stats`);
    expect(response.status()).toBe(401);
  });

  // ─── TC-045: Dashboard history authenticated ──────────────────────────────
  test('Authenticated user retrieves dashboard history with pagination', async ({ request }) => {
    const { token } = await createAuthUser(request);
    const response = await request.get(`${BASE_URL}/api/dashboard/history?page=1&limit=10`, {
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

  // ─── TC-046: Billing authenticated ───────────────────────────────────────
  test('Authenticated user retrieves billing information', async ({ request }) => {
    const { token } = await createAuthUser(request);
    const response = await request.get(`${BASE_URL}/api/dashboard/billing`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('plan');
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('billingCycle');
    expect(body).toHaveProperty('nextBillingDate');
    expect(body).toHaveProperty('usage');
    expect(body).toHaveProperty('cost');
    expect(body).toHaveProperty('invoices');
    expect(Array.isArray(body.invoices)).toBe(true);
  });

  // ─── TC-047: Billing without JWT ─────────────────────────────────────────
  test('Billing without JWT returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboard/billing`);
    expect(response.status()).toBe(401);
  });

});
