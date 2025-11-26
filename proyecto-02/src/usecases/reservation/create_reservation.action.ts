import Reservation from '../../models/reservation.model';
import Book from '../../models/book.model';
import User from '../../models/user.model';
import { IReservationDocument } from '../../types/reservation.types';

const createReservation = async (userId: string, bookId: string): Promise<IReservationDocument> => {
  const usuario = await User.findOne({ _id: userId, activo: true });
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const libro = await Book.findOne({ _id: bookId, activo: true });
  if (!libro) {
    throw new Error('Libro no encontrado');
  }

  if (!libro.disponible) {
    throw new Error('El libro no está disponible para reserva');
  }

  const nuevaReserva = new Reservation({
    usuario: userId,
    libro: bookId,
    nombreUsuario: usuario.nombre,
    nombreLibro: libro.nombre
  });

  await nuevaReserva.save();

  libro.disponible = false;
  await libro.save();

  return nuevaReserva;
};

export default createReservation;