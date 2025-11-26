import Reservation from '../../models/reservation.model';
import { IReservationDocument } from '../../types/reservation.types';

const getUserReservations = async (userId: string): Promise<IReservationDocument[]> => {
  const reservas = await Reservation.find({ usuario: userId })
    .populate('libro', 'nombre autor')
    .sort({ fechaReserva: -1 });

  return reservas;
};

export default getUserReservations;