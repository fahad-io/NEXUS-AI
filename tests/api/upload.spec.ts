import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

test.describe('upload', () => {

  // ─── TC-056: Upload valid image ───────────────────────────────────────────
  test('Upload valid image file returns file info', async ({ request }) => {
    const imageBuffer = Buffer.from(
      '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=',
      'base64'
    );

    const response = await request.post(`${BASE_URL}/api/upload`, {
      multipart: {
        file: {
          name: 'test.jpg',
          mimeType: 'image/jpeg',
          buffer: imageBuffer,
        },
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('url');
    expect(body).toHaveProperty('filename');
    expect(body).toHaveProperty('size');
    expect(body).toHaveProperty('type');
  });

  // ─── TC-057: Upload without file ─────────────────────────────────────────
  test('Upload without file returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/upload`, {
      multipart: {},
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toMatch(/no file provided/i);
  });

  // ─── TC-058: Upload with disallowed MIME type ─────────────────────────────
  test('Upload with disallowed MIME type returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/upload`, {
      multipart: {
        file: {
          name: 'malware.exe',
          mimeType: 'application/octet-stream',
          buffer: Buffer.from('MZ fake exe'),
        },
      },
    });
    expect(response.status()).toBe(400);
  });

});
