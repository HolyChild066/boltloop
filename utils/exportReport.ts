import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { Product, Sale } from '@/types';

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function buildSalesCsv(sales: Sale[], products: Product[]): string {
  const header = ['Sale ID', 'Date', 'Method', 'Items', 'Units', 'Total'];
  const rows = sales.map((sale) => {
    const units = sale.lines.reduce((sum, line) => sum + line.qty, 0);
    const items = sale.lines
      .map((line) => `${products.find((p) => p.id === line.productId)?.name ?? 'Removed item'} x${line.qty}`)
      .join('; ');
    return [
      sale.id,
      new Date(sale.createdAt).toISOString(),
      sale.method,
      items,
      String(units),
      sale.total.toFixed(2),
    ];
  });
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
}

export async function shareSalesCsv(sales: Sale[], products: Product[]): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }
  const file = new File(Paths.cache, 'boltloop-sales-report.csv');
  if (file.exists) file.delete();
  file.create();
  file.write(buildSalesCsv(sales, products));
  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv',
    UTI: 'public.comma-separated-values-text',
    dialogTitle: 'BOLTLOOP sales report',
  });
}