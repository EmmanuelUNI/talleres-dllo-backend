import mongoose, { Schema } from 'mongoose';
import { IBookDocument } from '../types/book.types';

const bookSchema = new Schema<IBookDocument>({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  autor: {
    type: String,
    required: true,
    trim: true
  },
  genero: {
    type: String,
    required: true,
    trim: true
  },
  fechaPublicacion: {
    type: Date,
    required: true
  },
  casaEditorial: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

bookSchema.index({ genero: 1, fechaPublicacion: -1, casaEditorial: 1, autor: 1 });

export default mongoose.model<IBookDocument>('Book', bookSchema);