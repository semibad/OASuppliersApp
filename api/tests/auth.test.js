import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../db/client.js', async () => {
  const { default: db } = await import('./dbMock.js');
  return { default: db };
});

import app from '../app.js';
import { seedNoOverlap } from './dbMock.js';

beforeEach(() => seedNoOverlap());

describe('authentication', () => {
  it('returns 401 when Authorization header is missing', async () => {
    const res = await request(app).get('/suppliers');
    expect(res.status).toBe(401);
  });

  it('returns 401 when secret is incorrect', async () => {
    const res = await request(app)
      .get('/suppliers')
      .set('Authorization', 'Bearer wrong-secret');
    expect(res.status).toBe(401);
  });

  it('returns 401 when Authorization header is malformed', async () => {
    const res = await request(app)
      .get('/suppliers')
      .set('Authorization', 'test-secret');
    expect(res.status).toBe(401);
  });

  it('passes through with correct secret', async () => {
    const res = await request(app)
      .get('/suppliers')
      .set('Authorization', `Bearer ${process.env.SHARED_SECRET}`);
    expect(res.status).toBe(200);
  });
});
