import { Router } from 'express';
import { authenticate, checkPermission } from '../middleware/auth.middleware';
import {
  register,
  login,
  getUser,
  updateUserController,
  deleteUserController,
  getUserReservationsController
} from '../controllers/user.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', getUser);
router.put('/:id', authenticate, updateUserController);
router.delete('/:id', authenticate, deleteUserController);
router.get('/:id/reservations', authenticate, getUserReservationsController);

export default router;