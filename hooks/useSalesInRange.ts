import { useMemo } from 'react';
import { useStore } from '@/store/StoreContext';
import type { Product, Sale } from '@/types';
import { endOfDay, startOfDay, startOfDaysAgo } from '@/utils/date';
import { cartCount } from '@/utils/format';

export type RangeKey = 'Today' | '7D' | '30D' | 'Custom';

export interface DateRange {
  from: Date;
  to: Date;
}

export function resolveRange(range: RangeKey, custom: DateRange): DateRange {
  const now = new Date();
  switch (range) {
    case 'Today':
      return { from: startOfDay(now), to: endOfDay(now) };
    case '7D':
      return { from: startOfDaysAgo(7), to: endOfDay(now) };
    case '30D':
      return { from: startOfDaysAgo(30), to: endOfDay(now) };
    case 'Custom':
      return { from: startOfDay(custom.from), to: endOfDay(custom.to) };
  }
}

export interface RangeResult {
  sales: Sale[];
  revenue: number;
  orders: number;
  units: number;
  top: { product: Product | undefined; qty: number }[];
}

export function useSalesInRange(range: RangeKey, custom: DateRange): RangeResult {
  const { sales, products } = useStore();

  return useMemo(() => {
    const { from, to } = resolveRange(range, custom);
    const inRange = sales.filter((s) => {
      const at = new Date(s.createdAt);
      return at >= from && at <= to;
    });

    const tally = new Map<string, number>();
    for (const sale of inRange) {
      for (const line of sale.lines) tally.set(line.productId, (tally.get(line.productId) ?? 0) + line.qty);
    }

    return {
      sales: inRange,
      revenue: inRange.reduce((sum, s) => sum + s.total, 0),
      orders: inRange.length,
      units: cartCount(inRange.flatMap((s) => s.lines)),
      top: [...tally.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty })),
    };
  }, [sales, products, range, custom]);
}