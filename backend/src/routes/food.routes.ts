import { Router } from 'express';
import { foodController } from '../controllers/food.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', foodController.getMenu);
router.post('/', authenticate, authorize('Admin', 'Kitchen'), foodController.createItem);
router.patch('/:id/availability', authenticate, authorize('Admin', 'Kitchen'), foodController.toggleStatus);

export default router;
