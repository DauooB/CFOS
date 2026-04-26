import { orderRepository } from '../repositories/order.repository';
import { foodRepository } from '../repositories/food.repository';
import { CreateOrderDTO, OrderStatus } from '../models/order.model';
import { ValidationError, NotFoundError } from '../utils/errors';

export class OrderService {
  async placeOrder(customerId: number, orderData: CreateOrderDTO) {
    // this.validateOperatingHours(); // Disabled for testing

    let totalAmount = 0;
    const orderItemsWithPricing = [];

    for (const item of orderData.items) {
      if (item.quantity < 1 || item.quantity > 20) {
        throw new ValidationError(`Quantity for item ${item.item_id} must be between 1 and 20`);
      }

      const foodItem = await foodRepository.findById(item.item_id);
      if (!foodItem) {
        throw new NotFoundError(`Food item ${item.item_id} not found`);
      }
      if (!foodItem.is_available) {
        throw new ValidationError(`Food item ${foodItem.name} is currently unavailable`);
      }

      const subtotal = Number(foodItem.price) * item.quantity;
      totalAmount += subtotal;
      
      orderItemsWithPricing.push({
        item_id: item.item_id,
        quantity: item.quantity,
        subtotal
      });
    }

    return await orderRepository.createOrderWithItems(customerId, totalAmount, orderItemsWithPricing);
  }

  async getUserOrders(customerId: number) {
    return await orderRepository.findByCustomerId(customerId);
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = await orderRepository.updateStatus(orderId, status);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  private validateOperatingHours() {
    const now = new Date();
    // Convert to Indian Standard Time (IST) if needed, but for now we'll use local server time
    // Operating hours: 08:00 AM to 06:00 PM
    const hour = now.getHours();
    if (hour < 8 || hour >= 18) {
      throw new ValidationError('Orders can only be placed between 08:00 AM and 06:00 PM');
    }
  }
}

export const orderService = new OrderService();
