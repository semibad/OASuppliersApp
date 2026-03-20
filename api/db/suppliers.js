import db from './client.js';

export const getSuppliers = db.prepare('SELECT * FROM Supplier');
export const getSupplierById = db.prepare('SELECT * FROM Supplier WHERE SupplierId = ?');
