import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { orderService } from '../services/order.service';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(z.object({
    item_id: z.number(),
    quantity: z.number().int().min(1).max(20)
  })).min(1)
});

export class OrderController {
  async placeOrder(req: AuthRequest, res: Response) {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = req.user!.userId;
    
    const order = await orderService.placeOrder(userId, validatedData);
    res.status(201).json(order);
  }

  async getMyOrders(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json(orders);
  }

  async updateStatus(req: AuthRequest, res: Response) {
    const orderId = parseInt(req.params.id as string);
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json(order);
  }

  async getAllOrders(req: AuthRequest, res: Response) {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  }

  async getSalesData(req: AuthRequest, res: Response) {
    const sales = await orderService.getSalesData();
    res.status(200).json(sales);
  }
}

export const orderController = new OrderController();
