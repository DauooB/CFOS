export type OrderStatus = 'Queued' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface Order {
  id: number;
  customer_id: number;
  total_amount: number;
  status: OrderStatus;
  order_date: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  item_id: number;
  quantity: number;
  subtotal: number;
}

export interface CreateOrderDTO {
  items: {
    item_id: number;
    quantity: number;
  }[];
}
