import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

test.describe('models', () => {

  // ─── TC-020: GET /models returns array ───────────────────────────────────
  test('GET /models returns array of model objects without auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/models`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  // ─── TC-021: GET /models with type filter ─────────────────────────────────
  test('GET /models with type filter returns filtered results', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/models?type=chat`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  // ─── TC-022: GET /models with lab filter ─────────────────────────────────
  test('GET /models with lab filter returns filtered results', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/models?lab=OpenAI`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  // ─── TC-023: GET /models with search query ────────────────────────────────
  test('GET /models with search query returns matching results', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/models?search=gpt`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  // ─── TC-024: GET /models/:id valid ────────────────────────────────────────
  test('GET /models/:id with valid ID returns single model', async ({ request }) => {
    const listRes = await request.get(`${BASE_URL}/api/models`);
    const models = await listRes.json();
    expect(models.length).toBeGreaterThan(0);

    const firstModelId = models[0]._id || models[0].id || models[0].modelId;
    const response = await request.get(`${BASE_URL}/api/models/${firstModelId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeDefined();
  });

  // ─── TC-025: GET /models/:id non-existent ─────────────────────────────────
  test('GET /models/:id with non-existent ID returns 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/models/nonexistent-model-id-xyz`);
    expect(response.status()).toBe(404);
  });

  // ─── TC-068: Models list endpoint is public ───────────────────────────────
  test('Models list endpoint is public and requires no auth', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/models`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

});
