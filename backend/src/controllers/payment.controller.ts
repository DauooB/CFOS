import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { paymentService } from '../services/payment.service';
import { z } from 'zod';

const processPaymentSchema = z.object({
  order_id: z.number(),
  payment_method: z.string()
});

export class PaymentController {
  async pay(req: AuthRequest, res: Response) {
    const { order_id, payment_method } = processPaymentSchema.parse(req.body);
    const payment = await paymentService.processPayment(order_id, payment_method);
    res.status(200).json(payment);
  }
}

export const paymentController = new PaymentController();
