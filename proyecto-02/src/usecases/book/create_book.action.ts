import Book from '../../models/book.model';
import { ICreateBookDTO, IBookDocument } from '../../types/book.types';

const createBook = async (bookData: ICreateBookDTO): Promise<IBookDocument> => {
  const { nombre, autor, genero, fechaPublicacion, casaEditorial, descripcion, isbn } = bookData;

  if (!nombre || !autor || !genero || !fechaPublicacion || !casaEditorial) {
    throw new Error('Nombre, autor, género, fecha de publicación y casa editorial son requeridos');
  }

  if (isbn) {
    const libroExistente = await Book.findOne({ isbn });
    if (libroExistente) {
      throw new Error('Ya existe un libro con ese ISBN');
    }
  }

  const nuevoLibro = new Book({
    nombre,
    autor,
    genero,
    fechaPublicacion,
    casaEditorial,
    descripcion,
    isbn
  });

  await nuevoLibro.save();
  return nuevoLibro;
};

export default createBook;