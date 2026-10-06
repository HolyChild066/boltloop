import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as db from '@/services/db';
import type { CartLine, PaymentMethodId, Product, Sale } from '@/types';

const STORAGE_KEY = 'boltloop.store.v1';

interface StoreContextValue {
  products: Product[];
  cart: CartLine[];
  sales: Sale[];
  loaded: boolean;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  checkout: (method: PaymentMethodId) => Sale | null;
  revenue: number;
  orders: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loaded, setLoaded] = useState(false);

  const reloadProducts = useCallback(() => {
    setProducts(db.getAllProducts());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        db.initDatabase();
        reloadProducts();
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.cart)) setCart(parsed.cart);
          if (Array.isArray(parsed.sales)) setSales(parsed.sales);
        }
      } catch {
        // fresh store on parse error
      } finally {
        setLoaded(true);
      }
    })();
  }, [reloadProducts]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, sales })).catch(() => {});
  }, [cart, sales, loaded]);

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.productId === productId);
      if (found) return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { productId, qty }];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.productId !== productId) : prev.map((l) => (l.productId === productId ? { ...l, qty } : l)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const addProduct = useCallback(
    (p: Omit<Product, 'id'>) => {
      db.addProduct(p);
      reloadProducts();
    },
    [reloadProducts],
  );

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) => {
      db.updateProduct(id, patch);
      reloadProducts();
    },
    [reloadProducts],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      db.deleteProduct(id);
      setCart((prev) => prev.filter((l) => l.productId !== id));
      reloadProducts();
    },
    [reloadProducts],
  );

  const checkout = useCallback(
    (method: PaymentMethodId) => {
      if (cart.length === 0) return null;
      const total = cart.reduce((sum, l) => {
        const p = products.find((pp) => pp.id === l.productId);
        return sum + (p ? p.price * l.qty : 0);
      }, 0);
      const sale: Sale = { id: `s-${Date.now()}`, lines: cart, total, method, createdAt: new Date().toISOString() };
      setSales((prev) => [...prev, sale]);
      const stockDelta = new Map<string, number>();
      for (const l of cart) {
        stockDelta.set(l.productId, (stockDelta.get(l.productId) ?? 0) + l.qty);
      }
      for (const [pid, d] of stockDelta) {
        db.decrementStock(pid, d);
      }
      setCart([]);
      reloadProducts();
      return sale;
    },
    [cart, products, reloadProducts],
  );

  const revenue = useMemo(() => sales.reduce((s, x) => s + x.total, 0), [sales]);
  const orders = sales.length;

  const value = useMemo(
    () => ({
      products,
      cart,
      sales,
      loaded,
      addToCart,
      setQty,
      clearCart,
      addProduct,
      updateProduct,
      deleteProduct,
      checkout,
      revenue,
      orders,
    }),
    [
      products,
      cart,
      sales,
      loaded,
      addToCart,
      setQty,
      clearCart,
      addProduct,
      updateProduct,
      deleteProduct,
      checkout,
      revenue,
      orders,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
