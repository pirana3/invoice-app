import { db } from '@/database/db';

export type DocumentAnnotation = {
  id: number;
  documentId: number;
  type: 'logo' | 'signature' | 'text';
  x: number;
  y: number;
  data?: string | null;
  kind?: 'drawn' | 'typed' | null;
  createdAt: string;
};

export const getAnnotationsByDocumentId = async (
  documentId: number
): Promise<DocumentAnnotation[]> => {
  return db.getAllSync<DocumentAnnotation>(
    `SELECT id, documentId, type, x, y, data, kind, createdAt FROM document_annotations WHERE documentId = ? ORDER BY id ASC`,
    documentId
  );
};

export const createAnnotation = async (
  documentId: number,
  type: DocumentAnnotation['type'],
  x: number,
  y: number,
  data?: string | null,
  kind?: DocumentAnnotation['kind']
): Promise<number> => {
  const result = db.runSync(
    `INSERT INTO document_annotations (documentId, type, x, y, data, kind, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    documentId,
    type,
    x,
    y,
    data ?? null,
    kind ?? null,
    new Date().toISOString()
  );

  return result.lastInsertRowId;
};

export const updateAnnotationPosition = async (
  id: number,
  x: number,
  y: number
): Promise<boolean> => {
  const result = db.runSync(
    `UPDATE document_annotations SET x = ?, y = ? WHERE id = ?`,
    x,
    y,
    id
  );
  return result.changes > 0;
};

export const deleteAnnotation = async (id: number): Promise<boolean> => {
  const result = db.runSync(`DELETE FROM document_annotations WHERE id = ?`, id);
  return result.changes > 0;
};

export const deleteAnnotationsForDocument = async (documentId: number): Promise<boolean> => {
  const result = db.runSync(`DELETE FROM document_annotations WHERE documentId = ?`, documentId);
  return result.changes > 0;
};
