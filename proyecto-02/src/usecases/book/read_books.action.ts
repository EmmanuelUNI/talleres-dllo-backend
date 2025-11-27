import Book from '../../models/book.model';
import { IBookFilters, IPaginacion, IBookListResponse } from '../../types/book.types';

const readBooks = async (filtros: IBookFilters = {}, paginacion: IPaginacion = {}): Promise<IBookListResponse> => {
  const { genero, fechaPublicacion, casaEditorial, autor, nombre, disponible, incluirInactivos } = filtros;
  const { pagina = 1, limite = 10 } = paginacion;

  const query: any = {};

  if (!incluirInactivos) {
    query.activo = true;
  }

  if (genero) {
    // Usar búsqueda insensible a mayúsculas y caracteres especiales
    query.genero = { $regex: new RegExp(genero, 'i') };
  }

  if (autor) {
    query.autor = { $regex: new RegExp(autor, 'i') };
  }

  if (nombre) {
    query.nombre = { $regex: new RegExp(nombre, 'i') };
  }

  if (casaEditorial) {
    query.casaEditorial = { $regex: new RegExp(casaEditorial, 'i') };
  }

  if (fechaPublicacion) {
    query.fechaPublicacion = new Date(fechaPublicacion);
  }

  if (disponible !== undefined) {
    query.disponible = disponible === 'true' || disponible === true;
  }

  const skip = (pagina - 1) * limite;
  const totalLibros = await Book.countDocuments(query);
  const libros = await Book.find(query)
    .select('nombre')
    .skip(skip)
    .limit(Number(limite));

  const paginaMax = Math.ceil(totalLibros / limite);

  return {
    libros: libros.map(libro => ({ _id: libro._id.toString(), nombre: libro.nombre })),
    paginacion: {
      paginaActual: Number(pagina),
      paginaMax,
      librosPorPagina: Number(limite),
      totalLibros
    }
  };
};

export default readBooks;