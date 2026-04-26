import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', orderController.placeOrder);
router.get('/my-orders', orderController.getMyOrders);
router.patch('/:id/status', authorize('Admin', 'Kitchen'), orderController.updateStatus);

export default router;
