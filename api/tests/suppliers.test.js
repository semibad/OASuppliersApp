import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../db/client.js', async () => {
  const { default: db } = await import('./dbMock.js');
  return { default: db };
});

import app from '../app.js';
import { seedNoOverlap, SUPPLIERS, RATES_NO_OVERLAP } from './dbMock.js';

const AUTH = { Authorization: `Bearer ${process.env.SHARED_SECRET}` };

beforeEach(() => seedNoOverlap());

describe('GET /suppliers', () => {
  it('returns all suppliers', async () => {
    const res = await request(app).get('/suppliers').set(AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(SUPPLIERS.length);
  });

  it('each supplier has the correct fields', async () => {
    const res = await request(app).get('/suppliers').set(AUTH);
    const supplier = res.body[0];
    expect(supplier).toHaveProperty('SupplierId');
    expect(supplier).toHaveProperty('Name');
    expect(supplier).toHaveProperty('rates');
    expect(Array.isArray(supplier.rates)).toBe(true);
  });

  it('attaches correct rates to each supplier', async () => {
    const res = await request(app).get('/suppliers').set(AUTH);
    const supplier1 = res.body.find(s => s.SupplierId === 1);
    const expectedRates = RATES_NO_OVERLAP.filter(r => r.SupplierId === 1);
    expect(supplier1.rates).toHaveLength(expectedRates.length);
  });

  it('rates are sorted by RateStartDate ascending', async () => {
    const res = await request(app).get('/suppliers').set(AUTH);
    const supplier1 = res.body.find(s => s.SupplierId === 1);
    const dates = supplier1.rates.map(r => r.RateStartDate);
    expect(dates).toEqual([...dates].sort());
  });
});

describe('GET /suppliers/:id', () => {
  it('returns the correct supplier with rates', async () => {
    const res = await request(app).get('/suppliers/1').set(AUTH);
    expect(res.status).toBe(200);
    expect(res.body.SupplierId).toBe(1);
    expect(res.body.Name).toBe('Supplier One');
    expect(Array.isArray(res.body.rates)).toBe(true);
  });

  it('returns 404 for a non-existent supplier', async () => {
    const res = await request(app).get('/suppliers/999').set(AUTH);
    expect(res.status).toBe(404);
  });
});
