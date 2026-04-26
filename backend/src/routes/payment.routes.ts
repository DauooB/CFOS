import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);

export default router;
