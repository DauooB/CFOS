import db from '../config/db';
import { FoodItem, CreateFoodItemDTO } from '../models/food.model';

export class FoodRepository {
  async findAll(): Promise<FoodItem[]> {
    const query = 'SELECT * FROM food_items ORDER BY category, name';
    const result = await db.query(query);
    return result.rows;
  }

  async findById(id: number): Promise<FoodItem | null> {
    const query = 'SELECT * FROM food_items WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(item: CreateFoodItemDTO): Promise<FoodItem> {
    const query = `
      INSERT INTO food_items (name, description, price, category, is_available, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [item.name, item.description, item.price, item.category, item.is_available ?? true, item.image || null];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async updateAvailability(id: number, isAvailable: boolean): Promise<FoodItem | null> {
    const query = 'UPDATE food_items SET is_available = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await db.query(query, [isAvailable, id]);
    return result.rows[0] || null;
  }

  async updatePrice(id: number, price: number): Promise<FoodItem | null> {
    const query = 'UPDATE food_items SET price = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await db.query(query, [price, id]);
    return result.rows[0] || null;
  }
}

export const foodRepository = new FoodRepository();
