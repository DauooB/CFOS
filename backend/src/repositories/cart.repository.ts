import db from '../config/db';

export class CartRepository {
    async findByUserId(userId: number) {
        const query = `
            SELECT ci.*, fi.name, fi.price, fi.image, fi.description, fi.category
            FROM cart_items ci
            JOIN food_items fi ON ci.item_id = fi.id
            WHERE ci.user_id = $1
            ORDER BY ci.created_at ASC
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    }

    async addItem(userId: number, itemId: number, quantity: number = 1) {
        const query = `
            INSERT INTO cart_items (user_id, item_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, item_id)
            DO UPDATE SET 
                quantity = cart_items.quantity + EXCLUDED.quantity,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;
        const result = await db.query(query, [userId, itemId, quantity]);
        return result.rows[0];
    }

    async updateQuantity(userId: number, itemId: number, quantity: number) {
        const query = `
            UPDATE cart_items
            SET quantity = $3, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND item_id = $2
            RETURNING *
        `;
        const result = await db.query(query, [userId, itemId, quantity]);
        return result.rows[0];
    }

    async removeItem(userId: number, itemId: number) {
        const query = 'DELETE FROM cart_items WHERE user_id = $1 AND item_id = $2';
        await db.query(query, [userId, itemId]);
    }

    async clearCart(userId: number) {
        const query = 'DELETE FROM cart_items WHERE user_id = $1';
        await db.query(query, [userId]);
    }
}

export const cartRepository = new CartRepository();
