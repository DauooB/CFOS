import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:itemId', cartController.updateQuantity);
router.delete('/:itemId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
