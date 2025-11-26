import { Document } from 'mongoose';

export interface IBook {
  nombre: string;
  autor: string;
  genero: string;
  fechaPublicacion: Date;
  casaEditorial: string;
  descripcion?: string;
  isbn?: string;
  disponible: boolean;
  activo: boolean;
}

export interface IBookDocument extends IBook, Document {}

export interface ICreateBookDTO {
  nombre: string;
  autor: string;
  genero: string;
  fechaPublicacion: Date | string;
  casaEditorial: string;
  descripcion?: string;
  isbn?: string;
}

export interface IUpdateBookDTO {
  nombre?: string;
  autor?: string;
  genero?: string;
  fechaPublicacion?: Date | string;
  casaEditorial?: string;
  descripcion?: string;
  isbn?: string;
  disponible?: boolean;
}

export interface IBookFilters {
  genero?: string;
  fechaPublicacion?: string;
  casaEditorial?: string;
  autor?: string;
  nombre?: string;
  disponible?: string | boolean;
  incluirInactivos?: boolean;
}

export interface IPaginacion {
  pagina?: number;
  limite?: number;
}

export interface IBookListResponse {
  libros: Array<{ _id: string; nombre: string }>;
  paginacion: {
    paginaActual: number;
    paginaMax: number;
    librosPorPagina: number;
    totalLibros: number;
  };
}