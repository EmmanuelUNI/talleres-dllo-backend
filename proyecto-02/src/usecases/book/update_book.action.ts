import Book from '../../models/book.model';
import { IBookDocument, IUpdateBookDTO } from '../../types/book.types';
import { IUserDocument } from '../../types/user.types';

const updateBook = async (
  bookId: string, 
  updateData: IUpdateBookDTO, 
  requestingUser: IUserDocument
): Promise<IBookDocument> => {
  const libroAModificar = await Book.findOne({ _id: bookId, activo: true });
  
  if (!libroAModificar) {
    throw new Error('Libro no encontrado');
  }

  const camposInformacion: Array<keyof IUpdateBookDTO> = [
    'nombre', 'autor', 'genero', 'fechaPublicacion', 'casaEditorial', 'descripcion', 'isbn'
  ];
  const modificaInformacion = camposInformacion.some(campo => updateData[campo] !== undefined);

  if (modificaInformacion && !requestingUser.permisos.modificarLibros) {
    throw new Error('No tienes permisos para modificar la información del libro');
  }

  if (updateData.disponible !== undefined) {
    libroAModificar.disponible = updateData.disponible;
  }

  if (modificaInformacion) {
    for (const campo of camposInformacion) {
      if (updateData[campo] !== undefined) {
        (libroAModificar as any)[campo] = updateData[campo];
      }
    }

    if (updateData.isbn && updateData.isbn !== libroAModificar.isbn) {
      const isbnExistente = await Book.findOne({ isbn: updateData.isbn });
      if (isbnExistente) {
        throw new Error('Ya existe un libro con ese ISBN');
      }
    }
  }

  await libroAModificar.save();
  return libroAModificar;
};

export default updateBook;