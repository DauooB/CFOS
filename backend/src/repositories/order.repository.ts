import db from '../config/db';
import { PoolClient } from 'pg';
import { Order, OrderStatus } from '../models/order.model';

export class OrderRepository {
  async createOrderWithItems(
    customerId: number, 
    totalAmount: number, 
    items: { item_id: number; quantity: number; subtotal: number }[]
  ): Promise<Order> {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const orderQuery = `
        INSERT INTO orders (customer_id, total_amount, status)
        VALUES ($1, $2, 'Queued')
        RETURNING *
      `;
      const orderResult = await client.query(orderQuery, [customerId, totalAmount]);
      const order = orderResult.rows[0];

      const itemQuery = `
        INSERT INTO order_items (order_id, item_id, quantity, subtotal)
        VALUES ($1, $2, $3, $4)
      `;

      for (const item of items) {
        await client.query(itemQuery, [order.id, item.item_id, item.quantity, item.subtotal]);
      }

      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findByCustomerId(customerId: number): Promise<Order[]> {
    const query = 'SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC';
    const result = await db.query(query, [customerId]);
    return result.rows;
  }

  async findById(id: number): Promise<Order | null> {
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order | null> {
    const query = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await db.query(query, [status, id]);
    return result.rows[0] || null;
  }
}

export const orderRepository = new OrderRepository();
