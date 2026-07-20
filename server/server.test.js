import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from './server.js';
import { auth } from './firebaseAdmin.js';

// Mock the firebase admin auth
vi.mock('./firebaseAdmin.js', () => {
  return {
    auth: {
      verifyIdToken: vi.fn(),
    }
  };
});

// We need to mock the fetch function globally
global.fetch = vi.fn();

describe('Server API Security Tests', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Mocked AI Response' } }]
      })
    });
  });

  describe('Rate Limiting', () => {
    it('should limit requests if calling /api/chat too rapidly', async () => {
      // The limit is 10 per minute. Let's fire 11.
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/chat')
          .set('X-Forwarded-For', '1.1.1.1')
          .send({ messages: [{ role: 'user', content: 'hello' }] });
      }
      
      const res = await request(app)
        .post('/api/chat')
        .set('X-Forwarded-For', '1.1.1.1')
        .send({ messages: [{ role: 'user', content: 'hello' }] });
      
      expect(res.status).toBe(429);
      expect(res.text).toContain('Too many chat requests from this IP');
    });
  });

  describe('Input Validation & Injection Protection (Zod)', () => {
    it('should reject malformed data (missing messages array)', async () => {
      const res = await request(app)
        .post('/api/chat')
        .set('X-Forwarded-For', '2.2.2.2')
        .send({ wrongField: 'inject this' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid input format');
    });

    it('should reject extremely long strings (buffer overflow/DoS protection)', async () => {
      const longString = 'a'.repeat(3000);
      const res = await request(app)
        .post('/api/chat')
        .set('X-Forwarded-For', '3.3.3.3')
        .send({ messages: [{ role: 'user', content: longString }] });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid input format');
    });
  });

  describe('Prompt Caching', () => {
    it('should return cached response on identical requests', async () => {
      // First call (cache miss)
      const res1 = await request(app)
        .post('/api/chat')
        .set('X-Forwarded-For', '4.4.4.4')
        .send({ messages: [{ role: 'user', content: 'unique cache test' }] });
      
      expect(res1.status).toBe(200);
      expect(res1.body.choices[0].message.content).toBe('Mocked AI Response');
      expect(res1.body.cached).toBeUndefined();
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call (cache hit)
      const res2 = await request(app)
        .post('/api/chat')
        .set('X-Forwarded-For', '4.4.4.4')
        .send({ messages: [{ role: 'user', content: 'unique cache test' }] });
      
      expect(res2.status).toBe(200);
      expect(res2.body.choices[0].message.content).toBe('Mocked AI Response');
      expect(res2.body.cached).toBe(true);
      // Fetch should still be called only 1 time
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Authentication & Authorization', () => {
    it('should block access to /api/admin/data without token', async () => {
      const res = await request(app).get('/api/admin/data');
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Unauthorized');
    });

    it('should allow access with valid token', async () => {
      auth.verifyIdToken.mockResolvedValue({ uid: 'test-admin-uid' });
      
      const res = await request(app)
        .get('/api/admin/data')
        .set('Authorization', 'Bearer valid-token');
      
      expect(res.status).toBe(200);
      expect(res.body.user).toBe('test-admin-uid');
    });
  });
});
