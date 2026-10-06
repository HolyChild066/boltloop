import { useMemo } from 'react';
import { useStore } from '@/store/StoreContext';
import { cartCount } from '@/utils/format';

export function useCartSummary() {
  const { cart, products } = useStore();
  return useMemo(() => {
    const total = cart.reduce((sum, l) => sum + (products.find((p) => p.id === l.productId)?.price ?? 0) * l.qty, 0);
    return { count: cartCount(cart), total };
  }, [cart, products]);
}