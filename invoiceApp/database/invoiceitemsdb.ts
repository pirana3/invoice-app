import { db } from '@/database/db';

export type InvoiceItem = {
  id: number;
  invoiceId: number;
  productId?: number | null;
  name: string;
  quantity: number;
  unitPrice: number;
  manualAmount?: number | null;
  useManual: number;
};

export const getInvoiceItemsByInvoiceId = async (invoiceId: number): Promise<InvoiceItem[]> => {
  return db.getAllSync<InvoiceItem>(
    `SELECT id, invoiceId, productId, name, quantity, unitPrice, manualAmount, useManual
     FROM invoice_items WHERE invoiceId = ? ORDER BY id ASC`,
    invoiceId
  );
};

export const deleteInvoiceItemsByInvoiceId = async (invoiceId: number): Promise<boolean> => {
  const result = db.runSync(`DELETE FROM invoice_items WHERE invoiceId = ?`, invoiceId);
  return result.changes > 0;
};

export const createInvoiceItem = async (
  invoiceId: number,
  productId: number | null,
  name: string,
  quantity: number,
  unitPrice: number,
  manualAmount: number | null,
  useManual: number
): Promise<number> => {
  const result = db.runSync(
    `INSERT INTO invoice_items (invoiceId, productId, name, quantity, unitPrice, manualAmount, useManual)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    invoiceId,
    productId,
    name,
    quantity,
    unitPrice,
    manualAmount,
    useManual
  );
  return result.lastInsertRowId;
};
