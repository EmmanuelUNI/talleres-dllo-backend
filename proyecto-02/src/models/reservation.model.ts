import mongoose, { Schema } from 'mongoose';
import { IReservationDocument } from '../types/reservation.types';

const reservationSchema = new Schema<IReservationDocument>({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  libro: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  nombreUsuario: {
    type: String,
    required: true
  },
  nombreLibro: {
    type: String,
    required: true
  },
  fechaReserva: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaEntrega: {
    type: Date,
    default: null
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

reservationSchema.index({ usuario: 1, libro: 1 });

export default mongoose.model<IReservationDocument>('Reservation', reservationSchema);