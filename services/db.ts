import * as SQLite from 'expo-sqlite';
import type { Category, Product } from '@/types';

export type ProductRow = {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  variant?: string | null;
};

const DB_NAME = 'boltloop.db';

function openDb() {
  return SQLite.openDatabaseSync(DB_NAME);
}

export function initDatabase() {
  const db = openDb();
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      variant TEXT
    );
  `);

  const count = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM products');
  if (!count || count.count === 0) {
    db.runSync(
      'INSERT INTO products (id, name, category, price, stock, variant) VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)',
      [
        'p-hex-bolt-m8',
        'Hex Bolt M8 x 50mm',
        'Fasteners',
        12.5,
        24,
        'Box of 50',
        'p-claw-hammer',
        'Claw Hammer 16oz',
        'Tools',
        18.99,
        36,
        '450 g',
        'p-drill-bit-set',
        'HSS Drill Bit Set 13pc',
        'Tools',
        24.99,
        18,
        'Metal case',
        'p-wire-nut-pack',
        'Wire Nut Assortment',
        'Electrical',
        6.75,
        72,
        '100-pack',
      ],
    );
  }
}

export function getAllProducts(): Product[] {
  const db = openDb();
  const rows = db.getAllSync<ProductRow>('SELECT id, name, category, price, stock, variant FROM products ORDER BY name ASC');
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    stock: row.stock,
    variant: row.variant ?? '',
  }));
}

export function searchProducts(query: string): Product[] {
  const db = openDb();
  const q = `%${query.trim()}%`;
  const rows = db.getAllSync<ProductRow>(
    'SELECT id, name, category, price, stock, variant FROM products WHERE name LIKE ? OR variant LIKE ? OR category LIKE ? ORDER BY name ASC',
    [q, q, q],
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    stock: row.stock,
    variant: row.variant ?? '',
  }));
}

export function addProduct(p: Omit<Product, 'id'>): Product {
  const db = openDb();
  const id = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  db.runSync(
    'INSERT INTO products (id, name, category, price, stock, variant) VALUES (?, ?, ?, ?, ?, ?)',
    [id, p.name, p.category, p.price, Math.max(0, Math.floor(p.stock)), p.variant ?? ''],
  );
  return { ...p, id, stock: Math.max(0, Math.floor(p.stock)) };
}

export function updateProduct(id: string, patch: Partial<Product>): void {
  const db = openDb();
  const updates: string[] = [];
  const params: (string | number)[] = [];
  if (patch.name !== undefined) {
    updates.push('name = ?');
    params.push(patch.name);
  }
  if (patch.category !== undefined) {
    updates.push('category = ?');
    params.push(patch.category as string);
  }
  if (patch.variant !== undefined) {
    updates.push('variant = ?');
    params.push(patch.variant);
  }
  if (patch.price !== undefined) {
    updates.push('price = ?');
    params.push(patch.price);
  }
  if (patch.stock !== undefined) {
    updates.push('stock = ?');
    params.push(Math.max(0, Math.floor(patch.stock)));
  }
  if (updates.length === 0) return;
  params.push(id);
  db.runSync(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, ...params);
}

export function deleteProduct(id: string): void {
  const db = openDb();
  db.runSync('DELETE FROM products WHERE id = ?', id);
}

export function decrementStock(id: string, qty: number): void {
  if (qty <= 0) return;
  const db = openDb();
  db.runSync('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?', qty, id);
}
