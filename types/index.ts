export type Category = 'Fasteners' | 'Tools' | 'Electrical' | 'Plumbing' | 'Paint' | 'Others';

export interface Product {
  id: string;
  name: string;
  category: Category;
  variant: string;
  price: number;
  stock: number;
}

export interface CartLine {
  productId: string;
  qty: number;
}

export type PaymentMethodId = 'cash' | 'card' | 'qr' | 'bank' | 'later';

export interface Sale {
  id: string;
  lines: CartLine[];
  total: number;
  method: PaymentMethodId;
  createdAt: string;
}

export interface StoreState {
  products: Product[];
  cart: CartLine[];
  sales: Sale[];
}
