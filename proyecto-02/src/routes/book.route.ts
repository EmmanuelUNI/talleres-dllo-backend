import { Router } from 'express';
import { authenticate, checkPermission } from '../middleware/auth.middleware';
import {
  createBookController,
  getBook,
  getBooks,
  updateBookController,
  deleteBookController,
  reserveBook,
  getBookReservationsController
} from '../controllers/book.controller';

const router = Router();

router.post('/', authenticate, checkPermission('crearLibros'), createBookController);
router.get('/', getBooks);
router.get('/:id', getBook);
router.put('/:id', authenticate, updateBookController);
router.delete('/:id', authenticate, checkPermission('inhabilitarLibros'), deleteBookController);
router.post('/:id/reserve', authenticate, reserveBook);
router.get('/:id/reservations', authenticate, getBookReservationsController);

export default router;