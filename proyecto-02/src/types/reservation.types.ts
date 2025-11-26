import { Document, Types } from 'mongoose';

export interface IReservation {
  usuario: Types.ObjectId;
  libro: Types.ObjectId;
  nombreUsuario: string;
  nombreLibro: string;
  fechaReserva: Date;
  fechaEntrega: Date | null;
  activo: boolean;
}

export interface IReservationDocument extends IReservation, Document {}

export interface ICreateReservationDTO {
  usuario: string;
  libro: string;
}