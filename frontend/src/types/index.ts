import type { Product } from '../data/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
}
