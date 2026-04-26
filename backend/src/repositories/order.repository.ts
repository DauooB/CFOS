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

  async findAll(): Promise<Order[]> {
    const query = 'SELECT * FROM orders ORDER BY order_date DESC';
    const result = await db.query(query);
    return result.rows;
  }

  async getSalesData(): Promise<{ daily: number, monthly: number }> {
    const dailyQuery = `
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders
      WHERE status = 'Completed' AND DATE(order_date) = CURRENT_DATE
    `;
    const monthlyQuery = `
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders
      WHERE status = 'Completed' AND 
            EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND
            EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const dailyResult = await db.query(dailyQuery);
    const monthlyResult = await db.query(monthlyQuery);

    return {
      daily: parseFloat(dailyResult.rows[0].total),
      monthly: parseFloat(monthlyResult.rows[0].total)
    };
  }
}

export const orderRepository = new OrderRepository();
