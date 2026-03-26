import { db } from '@/database/db';

export type SignatureRecord = {
  id: number;
  kind: 'drawn' | 'typed';
  data: string;
  createdAt: string;
};

export const getSignature = async (): Promise<SignatureRecord | null> => {
  return db.getFirstSync<SignatureRecord>(
    `SELECT id, kind, data, createdAt FROM signatures WHERE id = 1`
  );
};

export const saveSignature = async (kind: SignatureRecord['kind'], data: string): Promise<void> => {
  db.runSync(
    `INSERT OR REPLACE INTO signatures (id, kind, data, createdAt) VALUES (1, ?, ?, ?)`,
    kind,
    data,
    new Date().toISOString()
  );
};

export const deleteSignature = async (): Promise<boolean> => {
  const result = db.runSync(`DELETE FROM signatures WHERE id = 1`);
  return result.changes > 0;
};
