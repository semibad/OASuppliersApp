import db from './client.js';

export const getRates = db.prepare(
  'SELECT * FROM SupplierRate WHERE SupplierId = ? ORDER BY RateStartDate ASC'
);

export const getOverlappingRates = db.prepare(`
  SELECT DISTINCT a.*
  FROM SupplierRate a
  JOIN SupplierRate b
    ON a.SupplierRateId != b.SupplierRateId
    AND (a.RateEndDate IS NULL OR a.RateEndDate >= b.RateStartDate)
    AND (b.RateEndDate IS NULL OR b.RateEndDate >= a.RateStartDate)
  ORDER BY a.SupplierId, a.RateStartDate ASC
`);

export const getOverlappingRatesBySupplier = db.prepare(`
  SELECT DISTINCT b.*
  FROM SupplierRate a
  JOIN SupplierRate b
    ON a.SupplierId != b.SupplierId
    AND (a.RateEndDate IS NULL OR a.RateEndDate >= b.RateStartDate)
    AND (b.RateEndDate IS NULL OR b.RateEndDate >= a.RateStartDate)
  WHERE a.SupplierId = ?
  ORDER BY b.SupplierId, b.RateStartDate ASC
`);
