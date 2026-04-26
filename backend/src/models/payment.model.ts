export type PaymentStatus = 'Pending' | 'Success' | 'Failed';

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  transaction_status: PaymentStatus;
  transaction_id: string;
  created_at: Date;
}
