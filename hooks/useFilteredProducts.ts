import { useMemo } from 'react';
import { useStore } from '@/store/StoreContext';
import type { Product } from '@/types';

export function useFilteredProducts(query: string, category: string | null): Product[] {
  const { products } = useStore();
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = !category || p.category === category;
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.variant.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);
}