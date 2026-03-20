import db from './client.js';

// Clear
db.exec(`
  DROP TABLE IF EXISTS SupplierRate;
  DROP TABLE IF EXISTS Supplier;
`);
console.log('Tables dropped'); // eslint-disable-line no-console

// Migrate
db.exec(`
  CREATE TABLE Supplier (
    SupplierId    INTEGER PRIMARY KEY AUTOINCREMENT,
    Name          TEXT    NOT NULL,
    Address       TEXT,
    CreatedByUser TEXT    NOT NULL,
    CreatedOn     TEXT    NOT NULL
  )
`);

db.exec(`
  CREATE TABLE SupplierRate (
    SupplierRateId  INTEGER PRIMARY KEY AUTOINCREMENT,
    SupplierId      INTEGER NOT NULL REFERENCES Supplier(SupplierId),
    Rate            REAL    NOT NULL,
    RateStartDate   TEXT    NOT NULL,
    RateEndDate     TEXT,
    CreatedByUser   TEXT    NOT NULL,
    CreatedOn       TEXT    NOT NULL
  )
`);
console.log('Tables created'); // eslint-disable-line no-console

// Seed
const insertSupplier = db.prepare(`
  INSERT INTO Supplier (SupplierId, Name, CreatedByUser, CreatedOn)
  VALUES (@SupplierId, @Name, @CreatedByUser, @CreatedOn)
`);

const insertRate = db.prepare(`
  INSERT INTO SupplierRate (SupplierId, Rate, RateStartDate, RateEndDate, CreatedByUser, CreatedOn)
  VALUES (@SupplierId, @Rate, @RateStartDate, @RateEndDate, @CreatedByUser, @CreatedOn)
`);

const suppliers = [
  { SupplierId: 1, Name: 'One Industries',   CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-01' },
  { SupplierId: 2, Name: 'Two.com',   CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-05' },
  { SupplierId: 3, Name: 'Three Inc.', CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-10' },
];

const rates = [
  { SupplierId: 1, Rate: 10,  RateStartDate: '2015-01-01', RateEndDate: '2015-03-31', CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-01' },
  { SupplierId: 1, Rate: 20,  RateStartDate: '2015-04-01', RateEndDate: '2015-05-01', CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-05' },
  { SupplierId: 1, Rate: 10,  RateStartDate: '2015-05-30', RateEndDate: '2015-07-25', CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-08' },
  { SupplierId: 1, Rate: 25,  RateStartDate: '2015-10-01', RateEndDate: null,         CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-10' },
  { SupplierId: 2, Rate: 100, RateStartDate: '2016-11-01', RateEndDate: null,         CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-12' },
  { SupplierId: 3, Rate: 30,  RateStartDate: '2016-12-01', RateEndDate: '2017-01-01', CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-15' },
  { SupplierId: 3, Rate: 30,  RateStartDate: '2017-01-02', RateEndDate: null,         CreatedByUser: 'Johnny.test', CreatedOn: '2026-03-17' },
];

db.transaction(() => {
  for (const s of suppliers) insertSupplier.run(s);
  for (const r of rates) insertRate.run(r);
})();

console.log(`Seeded ${suppliers.length} suppliers and ${rates.length} rates`); // eslint-disable-line no-console
