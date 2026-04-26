import { Request, Response } from 'express';
import { foodService } from '../services/food.service';
import { z } from 'zod';

const createFoodSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().optional(),
  is_available: z.boolean().optional(),
  image: z.string().optional()
});

export class FoodController {
  async getMenu(req: Request, res: Response) {
    const menu = await foodService.getAllMenu();
    res.status(200).json(menu);
  }

  async createItem(req: Request, res: Response) {
    const validatedData = createFoodSchema.parse(req.body);
    const item = await foodService.addMenuItem(validatedData);
    res.status(201).json(item);
  }

  async toggleStatus(req: Request, res: Response) {
    const id = parseInt(req.params.id as string);
    const { is_available } = req.body;
    const item = await foodService.toggleAvailability(id, is_available);
    res.status(200).json(item);
  }

  async updatePrice(req: Request, res: Response) {
    const id = parseInt(req.params.id as string);
    const { price } = req.body;
    const item = await foodService.updatePrice(id, price);
    res.status(200).json(item);
  }
}

export const foodController = new FoodController();
