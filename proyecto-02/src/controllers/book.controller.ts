import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import createBook from '../usecases/book/create_book.action';
import readBook from '../usecases/book/read_book.action';
import readBooks from '../usecases/book/read_books.action';
import updateBook from '../usecases/book/update_book.action';
import deleteBook from '../usecases/book/delete_book.action';
import createReservation from '../usecases/reservation/create_reservation.action';
import getBookReservations from '../usecases/reservation/get_book_reservations.action';

export const createBookController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const libro = await createBook(req.body);
    res.status(201).json({
      mensaje: 'Libro creado exitosamente',
      libro
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const incluirInactivos = req.query.incluirInactivos === 'true';
    const libro = await readBook(req.params.id, incluirInactivos);
    res.status(200).json({ libro });
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const getBooks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filtros = {
      genero: req.query.genero as string,
      fechaPublicacion: req.query.fechaPublicacion as string,
      casaEditorial: req.query.casaEditorial as string,
      autor: req.query.autor as string,
      nombre: req.query.nombre as string,
      disponible: req.query.disponible as string,
      incluirInactivos: req.query.incluirInactivos === 'true'
    };

    const paginacion = {
      pagina: req.query.pagina ? Number(req.query.pagina) : 1,
      limite: req.query.limite ? Number(req.query.limite) : 10
    };

    const resultado = await readBooks(filtros, paginacion);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateBookController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    const libro = await updateBook(req.params.id, req.body, req.user);
    res.status(200).json({
      mensaje: 'Libro actualizado exitosamente',
      libro
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteBookController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    const libro = await deleteBook(req.params.id, req.user);
    res.status(200).json({
      mensaje: 'Libro inhabilitado exitosamente',
      libro
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const reserveBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    const reserva = await createReservation(req.userId, req.params.id);
    res.status(201).json({
      mensaje: 'Libro reservado exitosamente',
      reserva
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getBookReservationsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservas = await getBookReservations(req.params.id);
    res.status(200).json({ reservas });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};