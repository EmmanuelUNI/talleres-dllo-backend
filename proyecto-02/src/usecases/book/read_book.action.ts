import Book from '../../models/book.model';
import { IBookDocument } from '../../types/book.types';

const readBook = async (bookId: string, incluirInactivos: boolean = false): Promise<IBookDocument> => {
  const query: any = { _id: bookId };
  if (!incluirInactivos) {
    query.activo = true;
  }

  const libro = await Book.findOne(query);
  if (!libro) {
    throw new Error('Libro no encontrado');
  }

  return libro;
};

export default readBook;