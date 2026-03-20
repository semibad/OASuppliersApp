import Database from 'better-sqlite3';

const db = new Database(':memory:');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE Supplier (
    SupplierId    INTEGER PRIMARY KEY AUTOINCREMENT,
    Name          TEXT    NOT NULL,
    Address       TEXT,
    CreatedByUser TEXT    NOT NULL,
    CreatedOn     TEXT    NOT NULL
  );
  CREATE TABLE SupplierRate (
    SupplierRateId  INTEGER PRIMARY KEY AUTOINCREMENT,
    SupplierId      INTEGER NOT NULL REFERENCES Supplier(SupplierId),
    Rate            REAL    NOT NULL,
    RateStartDate   TEXT    NOT NULL,
    RateEndDate     TEXT,
    CreatedByUser   TEXT    NOT NULL,
    CreatedOn       TEXT    NOT NULL
  );
`);

const insertSupplier = db.prepare(
  'INSERT INTO Supplier (SupplierId, Name, CreatedByUser, CreatedOn) VALUES (@SupplierId, @Name, @CreatedByUser, @CreatedOn)'
);
const insertRate = db.prepare(
  'INSERT INTO SupplierRate (SupplierId, Rate, RateStartDate, RateEndDate, CreatedByUser, CreatedOn) VALUES (@SupplierId, @Rate, @RateStartDate, @RateEndDate, @CreatedByUser, @CreatedOn)'
);

export const SUPPLIERS = [
  { SupplierId: 1, Name: 'Supplier One',   CreatedByUser: 'test', CreatedOn: '2026-01-01' },
  { SupplierId: 2, Name: 'Supplier Two',   CreatedByUser: 'test', CreatedOn: '2026-01-01' },
  { SupplierId: 3, Name: 'Supplier Three', CreatedByUser: 'test', CreatedOn: '2026-01-01' },
];

// Non-overlapping rates for suppliers 1 and 2
export const RATES_NO_OVERLAP = [
  { SupplierId: 1, Rate: 10, RateStartDate: '2020-01-01', RateEndDate: '2020-06-30', CreatedByUser: 'test', CreatedOn: '2026-01-01' },
  { SupplierId: 1, Rate: 20, RateStartDate: '2020-07-01', RateEndDate: null,         CreatedByUser: 'test', CreatedOn: '2026-01-01' },
  { SupplierId: 2, Rate: 50, RateStartDate: '2019-01-01', RateEndDate: '2019-12-31', CreatedByUser: 'test', CreatedOn: '2026-01-01' },
];

// Overlapping: Supplier 1 open-ended rate overlaps with Supplier 2 open-ended rate
export const RATES_WITH_OVERLAP = [
  { SupplierId: 1, Rate: 10, RateStartDate: '2020-01-01', RateEndDate: null, CreatedByUser: 'test', CreatedOn: '2026-01-01' },
  { SupplierId: 2, Rate: 50, RateStartDate: '2021-01-01', RateEndDate: null, CreatedByUser: 'test', CreatedOn: '2026-01-01' },
  { SupplierId: 3, Rate: 30, RateStartDate: '2019-01-01', RateEndDate: '2019-12-31', CreatedByUser: 'test', CreatedOn: '2026-01-01' },
];

const seed = db.transaction((rates) => {
  db.exec('DELETE FROM SupplierRate; DELETE FROM Supplier;');
  for (const s of SUPPLIERS) insertSupplier.run(s);
  for (const r of rates) insertRate.run(r);
});

export function seedNoOverlap() { seed(RATES_NO_OVERLAP); }
export function seedWithOverlap() { seed(RATES_WITH_OVERLAP); }

export default db;
