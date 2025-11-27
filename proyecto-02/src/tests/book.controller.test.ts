import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/user.model';
import Book from '../models/book.model';
import Reservation from '../models/reservation.model';

describe('Book Controller Tests', () => {
  let tokenConPermisos: string;
  let tokenSinPermisos: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca_test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Book.deleteMany({});
    await Reservation.deleteMany({});

    const adminUser = {
      nombre: 'Admin',
      correo: 'admin@test.com',
      contrasena: 'password123',
      permisos: {
        crearLibros: true,
        modificarLibros: true,
        inhabilitarLibros: true
      }
    };

    const normalUser = {
      nombre: 'Usuario Normal',
      correo: 'user@test.com',
      contrasena: 'password123'
    };

    await request(app).post('/api/users/register').send(adminUser);
    await request(app).post('/api/users/register').send(normalUser);

    const adminLogin = await request(app)
      .post('/api/users/login')
      .send({ correo: 'admin@test.com', contrasena: 'password123' });
    tokenConPermisos = adminLogin.body.token;

    const userLogin = await request(app)
      .post('/api/users/login')
      .send({ correo: 'user@test.com', contrasena: 'password123' });
    tokenSinPermisos = userLogin.body.token;
  });

  describe('POST /api/books', () => {
    test('Debe crear un libro exitosamente con permisos', async () => {
      const nuevoLibro = {
        nombre: 'Cien Años de Soledad',
        autor: 'Gabriel García Márquez',
        genero: 'Ficción',
        fechaPublicacion: '1967-05-30',
        casaEditorial: 'Editorial Sudamericana',
        descripcion: 'Una obra maestra de la literatura'
      };

      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${tokenConPermisos}`)
        .send(nuevoLibro)
        .expect(201);

      expect(response.body.mensaje).toBe('Libro creado exitosamente');
      expect(response.body.libro.nombre).toBe('Cien Años de Soledad');
    });

    test('Debe fallar sin permisos', async () => {
      const nuevoLibro = {
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Test',
        fechaPublicacion: '2020-01-01',
        casaEditorial: 'Test Editorial'
      };

      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${tokenSinPermisos}`)
        .send(nuevoLibro)
        .expect(403);

      expect(response.body.error).toBe('No tienes permisos para realizar esta acción');
    });

    test('Debe fallar si falta información requerida', async () => {
      const libroIncompleto = {
        nombre: 'Libro Test',
        autor: 'Autor Test'
      };

      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${tokenConPermisos}`)
        .send(libroIncompleto)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/books', () => {
    test('Debe obtener lista de libros con paginación', async () => {
      const libro1 = new Book({
        nombre: 'Libro 1',
        autor: 'Autor 1',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial 1'
      });

      const libro2 = new Book({
        nombre: 'Libro 2',
        autor: 'Autor 2',
        genero: 'No Ficción',
        fechaPublicacion: new Date('2021-01-01'),
        casaEditorial: 'Editorial 2'
      });

      await libro1.save();
      await libro2.save();

      const response = await request(app)
        .get('/api/books')
        .expect(200);

      expect(response.body.libros).toBeDefined();
      expect(response.body.paginacion).toBeDefined();
      expect(response.body.paginacion.totalLibros).toBe(2);
    });

    test('Debe filtrar libros por género', async () => {
      const libro1 = new Book({
        nombre: 'Libro Ficción',
        autor: 'Autor 1',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial 1'
      });

      const libro2 = new Book({
        nombre: 'Libro Historia',
        autor: 'Autor 2',
        genero: 'Historia',
        fechaPublicacion: new Date('2021-01-01'),
        casaEditorial: 'Editorial 2'
      });

      await libro1.save();
      await libro2.save();

      const response = await request(app)
        .get('/api/books?genero=Ficcion')
        .expect(200);

      expect(response.body.libros.length).toBe(1);
      expect(response.body.libros[0].nombre).toBe('Libro Ficción');
    });

    test('Debe excluir libros inactivos por defecto', async () => {
      const libroActivo = new Book({
        nombre: 'Libro Activo',
        autor: 'Autor 1',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial 1',
        activo: true
      });

      const libroInactivo = new Book({
        nombre: 'Libro Inactivo',
        autor: 'Autor 2',
        genero: 'Ficción',
        fechaPublicacion: new Date('2021-01-01'),
        casaEditorial: 'Editorial 2',
        activo: false
      });

      await libroActivo.save();
      await libroInactivo.save();

      const response = await request(app)
        .get('/api/books')
        .expect(200);

      expect(response.body.paginacion.totalLibros).toBe(1);
    });
  });

  describe('GET /api/books/:id', () => {
    test('Debe obtener información de un libro', async () => {
      const libro = new Book({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Test'
      });
      await libro.save();

      const response = await request(app)
        .get(`/api/books/${libro._id}`)
        .expect(200);

      expect(response.body.libro.nombre).toBe('Libro Test');
    });

    test('Debe fallar si el libro no existe', async () => {
      const idInvalido = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/books/${idInvalido}`)
        .expect(404);

      expect(response.body.error).toBe('Libro no encontrado');
    });
  });

  describe('PUT /api/books/:id', () => {
    test('Debe actualizar un libro exitosamente con permisos', async () => {
      const libro = new Book({
        nombre: 'Libro Original',
        autor: 'Autor Original',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Original'
      });
      await libro.save();

      const response = await request(app)
        .put(`/api/books/${libro._id}`)
        .set('Authorization', `Bearer ${tokenConPermisos}`)
        .send({ nombre: 'Libro Actualizado' })
        .expect(200);

      expect(response.body.libro.nombre).toBe('Libro Actualizado');
    });

    test('Debe fallar al modificar información sin permisos', async () => {
      const libro = new Book({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Test'
      });
      await libro.save();

      const response = await request(app)
        .put(`/api/books/${libro._id}`)
        .set('Authorization', `Bearer ${tokenSinPermisos}`)
        .send({ nombre: 'Nuevo Nombre' })
        .expect(400);

      expect(response.body.error).toBe('No tienes permisos para modificar la información del libro');
    });

    test('Debe permitir cambiar disponibilidad sin permisos especiales', async () => {
      const libro = new Book({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Test'
      });
      await libro.save();

      const response = await request(app)
        .put(`/api/books/${libro._id}`)
        .set('Authorization', `Bearer ${tokenSinPermisos}`)
        .send({ disponible: false })
        .expect(200);

      expect(response.body.libro.disponible).toBe(false);
    });
  });

  describe('DELETE /api/books/:id', () => {
    test('Debe inhabilitar un libro exitosamente con permisos', async () => {
      const libro = new Book({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Test'
      });
      await libro.save();

      const response = await request(app)
        .delete(`/api/books/${libro._id}`)
        .set('Authorization', `Bearer ${tokenConPermisos}`)
        .expect(200);

      expect(response.body.mensaje).toBe('Libro inhabilitado exitosamente');
      expect(response.body.libro.activo).toBe(false);
    });

    test('Debe fallar sin permisos', async () => {
      const libro = new Book({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Test'
      });
      await libro.save();

      const response = await request(app)
        .delete(`/api/books/${libro._id}`)
        .set('Authorization', `Bearer ${tokenSinPermisos}`)
        .expect(403);

      expect(response.body.error).toBe('No tienes permisos para realizar esta acción');
    });
  });

  describe('POST /api/books/:id/reserve', () => {
    test('Debe reservar un libro exitosamente', async () => {
      const libro = new Book({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Test',
        disponible: true
      });
      await libro.save();

      const response = await request(app)
        .post(`/api/books/${libro._id}/reserve`)
        .set('Authorization', `Bearer ${tokenSinPermisos}`)
        .expect(201);

      expect(response.body.mensaje).toBe('Libro reservado exitosamente');
      expect(response.body.reserva).toBeDefined();
    });

    test('Debe fallar si el libro no está disponible', async () => {
      const libro = new Book({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Test',
        disponible: false
      });
      await libro.save();

      const response = await request(app)
        .post(`/api/books/${libro._id}/reserve`)
        .set('Authorization', `Bearer ${tokenSinPermisos}`)
        .expect(400);

      expect(response.body.error).toBe('El libro no está disponible para reserva');
    });
  });

  describe('GET /api/books/:id/reservations', () => {
    test('Debe obtener las reservas de un libro', async () => {
      const libro = new Book({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Test'
      });
      await libro.save();

      const response = await request(app)
        .get(`/api/books/${libro._id}/reservations`)
        .set('Authorization', `Bearer ${tokenConPermisos}`)
        .expect(200);

      expect(response.body.reservas).toBeDefined();
      expect(Array.isArray(response.body.reservas)).toBe(true);
    });

    test('Debe fallar sin autenticación', async () => {
      const libro = new Book({
        nombre: 'Libro Test',
        autor: 'Autor Test',
        genero: 'Ficción',
        fechaPublicacion: new Date('2020-01-01'),
        casaEditorial: 'Editorial Test'
      });
      await libro.save();

      const response = await request(app)
        .get(`/api/books/${libro._id}/reservations`)
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });
});