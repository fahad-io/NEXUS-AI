import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

test.describe('forms', () => {

  // ─── TC-048: Contact form positive ────────────────────────────────────────
  test('Contact form submission with valid data returns success', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/forms/contact`, {
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'I would like to learn more about your pricing plans.',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(typeof body.message).toBe('string');
    expect(body.message.length).toBeGreaterThan(0);
  });

  // ─── TC-049: Contact form missing fields ──────────────────────────────────
  test('Contact form with missing fields returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/forms/contact`, {
      data: {},
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  // ─── TC-050: Contact form message too short ───────────────────────────────
  test('Contact form message shorter than 10 chars returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/forms/contact`, {
      data: { name: 'Jane Doe', email: 'jane@example.com', message: 'Short' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-051: Contact form message too long ────────────────────────────────
  test('Contact form message exceeding 2000 chars returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/forms/contact`, {
      data: { name: 'Jane Doe', email: 'jane@example.com', message: 'A'.repeat(2001) },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-052: Feedback form positive ──────────────────────────────────────
  test('Feedback form submission with valid data returns success', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/forms/feedback`, {
      data: { rating: 5, message: 'Great platform experience', page: '/home' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(typeof body.message).toBe('string');
  });

  // ─── TC-053: Feedback rating below 1 ─────────────────────────────────────
  test('Feedback form with rating below 1 returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/forms/feedback`, {
      data: { rating: 0, message: 'Feedback message here' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-054: Feedback rating above 5 ─────────────────────────────────────
  test('Feedback form with rating above 5 returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/forms/feedback`, {
      data: { rating: 6, message: 'Great feedback here' },
    });
    expect(response.status()).toBe(400);
  });

  // ─── TC-055: Feedback missing required fields ─────────────────────────────
  test('Feedback form with missing required fields returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/forms/feedback`, {
      data: {},
    });
    expect(response.status()).toBe(400);
  });

});
