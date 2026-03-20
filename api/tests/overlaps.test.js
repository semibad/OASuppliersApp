import { vi, describe, it, expect } from 'vitest';
import request from 'supertest';

vi.mock('../db/client.js', async () => {
  const { default: db } = await import('./dbMock.js');
  return { default: db };
});

import app from '../app.js';
import { seedNoOverlap, seedWithOverlap } from './dbMock.js';

const AUTH = { Authorization: `Bearer ${process.env.SHARED_SECRET}` };

describe('GET /overlaps', () => {
  it('returns empty array when no rates overlap', async () => {
    seedNoOverlap();
    const res = await request(app).get('/overlaps').set(AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns suppliers with overlapping rates', async () => {
    seedWithOverlap();
    const res = await request(app).get('/overlaps').set(AUTH);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each returned supplier has a rates array', async () => {
    seedWithOverlap();
    const res = await request(app).get('/overlaps').set(AUTH);
    for (const supplier of res.body) {
      expect(supplier).toHaveProperty('rates');
      expect(Array.isArray(supplier.rates)).toBe(true);
      expect(supplier.rates.length).toBeGreaterThan(0);
    }
  });

  it('does not include suppliers with no overlapping rates', async () => {
    seedWithOverlap();
    const res = await request(app).get('/overlaps').set(AUTH);
    // Supplier 3 has a rate from 2019 only, doesn't overlap with suppliers 1 or 2
    const supplier3 = res.body.find(s => s.SupplierId === 3);
    expect(supplier3).toBeUndefined();
  });
});

describe('GET /overlaps/:id', () => {
  it('returns other suppliers whose rates overlap with the given supplier', async () => {
    seedWithOverlap();
    const res = await request(app).get('/overlaps/1').set(AUTH);
    expect(res.status).toBe(200);
    // Supplier 1 (open-ended from 2020) overlaps with Supplier 2 (open-ended from 2021)
    expect(res.body.some(s => s.SupplierId === 2)).toBe(true);
  });

  it('does not include the requested supplier in the results', async () => {
    seedWithOverlap();
    const res = await request(app).get('/overlaps/1').set(AUTH);
    expect(res.body.every(s => s.SupplierId !== 1)).toBe(true);
  });

  it('returns empty array when the supplier has no overlapping rates', async () => {
    seedWithOverlap();
    const res = await request(app).get('/overlaps/3').set(AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 404 for a non-existent supplier', async () => {
    seedNoOverlap();
    const res = await request(app).get('/overlaps/999').set(AUTH);
    expect(res.status).toBe(404);
  });
});
