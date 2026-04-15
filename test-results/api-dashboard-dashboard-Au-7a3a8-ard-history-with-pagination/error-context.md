# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\dashboard.spec.ts >> dashboard >> Authenticated user retrieves dashboard history with pagination
- Location: tests\api\dashboard.spec.ts:41:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
  4  | const RUN_ID = Date.now();
  5  | 
  6  | async function createAuthUser(request: any) {
  7  |   const email = `dashuser_${RUN_ID}@example.com`;
  8  |   const res = await request.post(`${BASE_URL}/api/auth/signup`, {
  9  |     data: { email, name: 'Dash User', password: 'SecurePass123' },
  10 |   });
  11 |   const body = await res.json();
  12 |   return { email, token: body.access_token };
  13 | }
  14 | 
  15 | test.describe('dashboard', () => {
  16 | 
  17 |   // ─── TC-043: Dashboard stats authenticated ────────────────────────────────
  18 |   test('Authenticated user retrieves dashboard stats', async ({ request }) => {
  19 |     const { token } = await createAuthUser(request);
  20 |     const response = await request.get(`${BASE_URL}/api/dashboard/stats`, {
  21 |       headers: { Authorization: `Bearer ${token}` },
  22 |     });
  23 |     expect(response.status()).toBe(200);
  24 |     const body = await response.json();
  25 |     expect(body).toHaveProperty('totalRequests');
  26 |     expect(body).toHaveProperty('totalMessages');
  27 |     expect(body).toHaveProperty('avgLatency');
  28 |     expect(body).toHaveProperty('cost');
  29 |     expect(body).toHaveProperty('modelUsage');
  30 |     expect(body).toHaveProperty('activeSessions');
  31 |     expect(Array.isArray(body.modelUsage)).toBe(true);
  32 |   });
  33 | 
  34 |   // ─── TC-044: Dashboard stats without JWT ─────────────────────────────────
  35 |   test('Dashboard stats without JWT returns 401', async ({ request }) => {
  36 |     const response = await request.get(`${BASE_URL}/api/dashboard/stats`);
  37 |     expect(response.status()).toBe(401);
  38 |   });
  39 | 
  40 |   // ─── TC-045: Dashboard history authenticated ──────────────────────────────
  41 |   test('Authenticated user retrieves dashboard history with pagination', async ({ request }) => {
  42 |     const { token } = await createAuthUser(request);
  43 |     const response = await request.get(`${BASE_URL}/api/dashboard/history?page=1&limit=10`, {
  44 |       headers: { Authorization: `Bearer ${token}` },
  45 |     });
> 46 |     expect(response.status()).toBe(200);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  47 |     const body = await response.json();
  48 |     expect(body).toHaveProperty('data');
  49 |     expect(Array.isArray(body.data)).toBe(true);
  50 |     expect(body).toHaveProperty('total');
  51 |     expect(body).toHaveProperty('page');
  52 |     expect(body).toHaveProperty('limit');
  53 |     expect(body).toHaveProperty('totalPages');
  54 |   });
  55 | 
  56 |   // ─── TC-046: Billing authenticated ───────────────────────────────────────
  57 |   test('Authenticated user retrieves billing information', async ({ request }) => {
  58 |     const { token } = await createAuthUser(request);
  59 |     const response = await request.get(`${BASE_URL}/api/dashboard/billing`, {
  60 |       headers: { Authorization: `Bearer ${token}` },
  61 |     });
  62 |     expect(response.status()).toBe(200);
  63 |     const body = await response.json();
  64 |     expect(body).toHaveProperty('plan');
  65 |     expect(body).toHaveProperty('status');
  66 |     expect(body).toHaveProperty('billingCycle');
  67 |     expect(body).toHaveProperty('nextBillingDate');
  68 |     expect(body).toHaveProperty('usage');
  69 |     expect(body).toHaveProperty('cost');
  70 |     expect(body).toHaveProperty('invoices');
  71 |     expect(Array.isArray(body.invoices)).toBe(true);
  72 |   });
  73 | 
  74 |   // ─── TC-047: Billing without JWT ─────────────────────────────────────────
  75 |   test('Billing without JWT returns 401', async ({ request }) => {
  76 |     const response = await request.get(`${BASE_URL}/api/dashboard/billing`);
  77 |     expect(response.status()).toBe(401);
  78 |   });
  79 | 
  80 | });
  81 | 
```