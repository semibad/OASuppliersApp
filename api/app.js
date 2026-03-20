import express from 'express';
import { authenticate } from './auth.js';
import { getSuppliers, getSupplierById } from './db/suppliers.js';
import { getRates, getOverlappingRates, getOverlappingRatesBySupplier } from './db/supplierRates.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'OASupplierAPI' });
});

app.get('/suppliers{/:id}', authenticate, (req, res) => {
  if (req.params.id) {
    const supplier = getSupplierById.get(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    return res.json({ ...supplier, rates: getRates.all(supplier.SupplierId) });
  }

  const suppliers = getSuppliers.all().map(supplier => ({
    ...supplier,
    rates: getRates.all(supplier.SupplierId),
  }));
  res.json(suppliers);
});

app.get('/overlaps{/:id}', authenticate, (req, res) => {
  if (req.params.id) {
    const supplier = getSupplierById.get(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

    const overlappingRates = getOverlappingRatesBySupplier.all(req.params.id);
    const bySupplier = new Map();
    for (const rate of overlappingRates) {
      if (!bySupplier.has(rate.SupplierId)) bySupplier.set(rate.SupplierId, []);
      bySupplier.get(rate.SupplierId).push(rate);
    }

    const result = [];
    for (const [supplierId, rates] of bySupplier) {
      result.push({ ...getSupplierById.get(supplierId), rates });
    }
    return res.json(result);
  }

  const overlappingRates = getOverlappingRates.all();
  const bySupplier = new Map();
  for (const rate of overlappingRates) {
    if (!bySupplier.has(rate.SupplierId)) bySupplier.set(rate.SupplierId, []);
    bySupplier.get(rate.SupplierId).push(rate);
  }

  const result = [];
  for (const [supplierId, rates] of bySupplier) {
    result.push({ ...getSupplierById.get(supplierId), rates });
  }
  res.json(result);
});

export default app;
