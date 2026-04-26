import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { cartService } from '../services/cart.service';
import { z } from 'zod';

const addToCartSchema = z.object({
    item_id: z.number(),
    quantity: z.number().int().min(1).max(20).optional()
});

const updateQuantitySchema = z.object({
    quantity: z.number().int().min(0).max(20)
});

export class CartController {
    async getCart(req: AuthRequest, res: Response) {
        const userId = req.user!.userId;
        const cart = await cartService.getCart(userId);
        res.status(200).json(cart);
    }

    async addToCart(req: AuthRequest, res: Response) {
        const userId = req.user!.userId;
        const { item_id, quantity } = addToCartSchema.parse(req.body);
        await cartService.addToCart(userId, item_id, quantity);
        const updatedCart = await cartService.getCart(userId);
        res.status(200).json(updatedCart);
    }

    async updateQuantity(req: AuthRequest, res: Response) {
        const userId = req.user!.userId;
        const itemId = parseInt(req.params.itemId);
        const { quantity } = updateQuantitySchema.parse(req.body);
        await cartService.updateQuantity(userId, itemId, quantity);
        const updatedCart = await cartService.getCart(userId);
        res.status(200).json(updatedCart);
    }

    async removeFromCart(req: AuthRequest, res: Response) {
        const userId = req.user!.userId;
        const itemId = parseInt(req.params.itemId);
        await cartService.removeFromCart(userId, itemId);
        const updatedCart = await cartService.getCart(userId);
        res.status(200).json(updatedCart);
    }

    async clearCart(req: AuthRequest, res: Response) {
        const userId = req.user!.userId;
        await cartService.clearCart(userId);
        res.status(200).json([]);
    }
}

export const cartController = new CartController();
