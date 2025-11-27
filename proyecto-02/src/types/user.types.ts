import { Document } from 'mongoose';

export interface IPermisos {
  crearLibros: boolean;
  modificarLibros: boolean;
  inhabilitarLibros: boolean;
  modificarUsuarios: boolean;
  inhabilitarUsuarios: boolean;
}

export interface IUser {
  nombre: string;
  correo: string;
  password: string;
  permisos: IPermisos;
  activo: boolean;
}

export interface IUserDocument extends IUser, Document {
  compararPassword(passwordIngresado: string): Promise<boolean>;
}

export interface IUserResponse {
  _id: string;
  nombre: string;
  correo: string;
  permisos: IPermisos;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserDTO {
  nombre: string;
  correo: string;
  password: string;
  permisos?: Partial<IPermisos>;
}

export interface IUpdateUserDTO {
  nombre?: string;
  correo?: string;
  password?: string;
  permisos?: Partial<IPermisos>;
}

export interface ILoginDTO {
  correo: string;
  password: string;
}

export interface ILoginResponse {
  usuario: IUserResponse;
  token: string;
}