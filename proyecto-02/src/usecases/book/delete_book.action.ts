import Book from '../../models/book.model';
import { IBookDocument } from '../../types/book.types';
import { IUserDocument } from '../../types/user.types';

const deleteBook = async (bookId: string, requestingUser: IUserDocument): Promise<IBookDocument> => {
  if (!requestingUser.permisos.inhabilitarLibros) {
    throw new Error('No tienes permisos para inhabilitar libros');
  }

  const libroAInhabilitar = await Book.findOne({ _id: bookId, activo: true });
  
  if (!libroAInhabilitar) {
    throw new Error('Libro no encontrado');
  }

  libroAInhabilitar.activo = false;
  await libroAInhabilitar.save();

  return libroAInhabilitar;
};

export default deleteBook;