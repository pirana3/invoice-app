import { db } from '@/database/db';

export type Product = {
  id: number;
  name: string;
  details: string;
  price: number;
};

export const createProduct = async (
  name: string,
  details: string,
  price: number
): Promise<number> => {
  const result = db.runSync(
    `INSERT INTO products (name, details, price) VALUES (?, ?, ?)`,
    name,
    details,
    price
  );

  return result.lastInsertRowId;
};

export const getProducts = async (): Promise<Product[]> => {
  return db.getAllSync<Product>(
    `SELECT id, name, details, price FROM products ORDER BY id DESC`
  );
};

export const getProductById = async (id: number): Promise<Product | null> => {
  return db.getFirstSync<Product>(
    `SELECT id, name, details, price FROM products WHERE id = ?`,
    id
  );
};
