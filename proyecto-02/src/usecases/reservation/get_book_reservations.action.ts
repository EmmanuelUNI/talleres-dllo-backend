import Reservation from '../../models/reservation.model';
import { IReservationDocument } from '../../types/reservation.types';

const getBookReservations = async (bookId: string): Promise<IReservationDocument[]> => {
  const reservas = await Reservation.find({ libro: bookId })
    .populate('usuario', 'nombre correo')
    .sort({ fechaReserva: -1 });

  return reservas;
};

export default getBookReservations;