import { cartRepository } from '../repositories/cart.repository';

export class CartService {
    async getCart(userId: number) {
        const items = await cartRepository.findByUserId(userId);
        // Format to match frontend Product structure
        return items.map(item => ({
            product: {
                id: item.item_id.toString(),
                name: item.name,
                description: item.description,
                price: Number(item.price),
                category: item.category,
                image: item.image
            },
            quantity: item.quantity
        }));
    }

    async addToCart(userId: number, itemId: number, quantity: number = 1) {
        return await cartRepository.addItem(userId, itemId, quantity);
    }

    async updateQuantity(userId: number, itemId: number, quantity: number) {
        if (quantity <= 0) {
            return await cartRepository.removeItem(userId, itemId);
        }
        return await cartRepository.updateQuantity(userId, itemId, quantity);
    }

    async removeFromCart(userId: number, itemId: number) {
        return await cartRepository.removeItem(userId, itemId);
    }

    async clearCart(userId: number) {
        return await cartRepository.clearCart(userId);
    }
}

export const cartService = new CartService();
