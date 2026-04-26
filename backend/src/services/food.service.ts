import { foodRepository } from '../repositories/food.repository';
import { CreateFoodItemDTO } from '../models/food.model';
import { NotFoundError } from '../utils/errors';

export class FoodService {
  async getAllMenu() {
    return await foodRepository.findAll();
  }

  async addMenuItem(item: CreateFoodItemDTO) {
    return await foodRepository.create(item);
  }

  async toggleAvailability(id: number, isAvailable: boolean) {
    const item = await foodRepository.updateAvailability(id, isAvailable);
    if (!item) {
      throw new NotFoundError('Food item not found');
    }
    return item;
  }
}

export const foodService = new FoodService();
