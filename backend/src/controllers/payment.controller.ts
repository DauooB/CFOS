import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth.middleware';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export class PaymentController {
  async createOrder(req: AuthRequest, res: Response) {
    const { amount } = req.body; // Amount in INR

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.error('Razorpay Order Error:', error);
      res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
  }

  async verifyPayment(req: AuthRequest, res: Response) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Here you would normally update the order status in your database
      res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
    }
  }
}

export const paymentController = new PaymentController();
