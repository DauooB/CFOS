import db from '../config/db';
import { PaymentStatus } from '../models/payment.model';
import { orderRepository } from '../repositories/order.repository';
import { NotFoundError } from '../utils/errors';

export class PaymentService {
  async processPayment(orderId: number, paymentMethod: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Mocking an external payment gateway call
    const isSuccess = Math.random() > 0.1; // 90% success rate
    const transactionId = `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const status: PaymentStatus = isSuccess ? 'Success' : 'Failed';

    const query = `
      INSERT INTO payments (order_id, amount, payment_method, transaction_status, transaction_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(query, [orderId, order.total_amount, paymentMethod, status, transactionId]);

    // If success, we could automatically update order status to 'Preparing'
    if (isSuccess) {
      await orderRepository.updateStatus(orderId, 'Preparing');
    }

    return result.rows[0];
  }
}

export const paymentService = new PaymentService();
