import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/user.model';
import Reservation from '../models/reservation.model';

describe('User Controller Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca_test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Reservation.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    test('Debe crear un usuario exitosamente', async () => {
      const nuevoUsuario = {
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(nuevoUsuario)
        .expect(201);

      expect(response.body.mensaje).toBe('Usuario creado exitosamente');
      expect(response.body.usuario.correo).toBe('juan@test.com');
      expect(response.body.usuario.contrasena).toBeUndefined();
    });

    test('Debe fallar si falta información requerida', async () => {
      const usuarioIncompleto = {
        nombre: 'Juan Pérez',
        correo: 'juan@test.com'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(usuarioIncompleto)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    test('Debe fallar si el correo ya existe', async () => {
      const usuario = {
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      };

      await request(app).post('/api/users/register').send(usuario);

      const response = await request(app)
        .post('/api/users/register')
        .send(usuario)
        .expect(400);

      expect(response.body.error).toBe('El correo ya está registrado');
    });
  });

  describe('POST /api/users/login', () => {
    test('Debe hacer login exitosamente', async () => {
      const usuario = {
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      };

      await request(app).post('/api/users/register').send(usuario);

      const response = await request(app)
        .post('/api/users/login')
        .send({ correo: usuario.correo, contrasena: usuario.contrasena })
        .expect(200);

      expect(response.body.mensaje).toBe('Login exitoso');
      expect(response.body.token).toBeDefined();
    });

    test('Debe fallar con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ correo: 'noexiste@test.com', contrasena: 'wrong' })
        .expect(401);

      expect(response.body.error).toBe('Credenciales inválidas');
    });
  });

  describe('GET /api/users/:id', () => {
    test('Debe obtener información de un usuario', async () => {
      const usuario = new User({
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      });
      await usuario.save();

      const response = await request(app)
        .get(`/api/users/${usuario._id}`)
        .expect(200);

      expect(response.body.usuario.nombre).toBe('Juan Pérez');
    });

    test('Debe fallar si el usuario no existe', async () => {
      const idInvalido = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/users/${idInvalido}`)
        .expect(404);

      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });

  describe('PUT /api/users/:id', () => {
    test('Debe actualizar un usuario exitosamente', async () => {
      const usuario = new User({
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      });
      await usuario.save();

      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({ correo: 'juan@test.com', contrasena: 'password123' });

      const token = loginResponse.body.token;

      const response = await request(app)
        .put(`/api/users/${usuario._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nombre: 'Juan Carlos Pérez' })
        .expect(200);

      expect(response.body.usuario.nombre).toBe('Juan Carlos Pérez');
    });

    test('Debe fallar sin autenticación', async () => {
      const usuario = new User({
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      });
      await usuario.save();

      const response = await request(app)
        .put(`/api/users/${usuario._id}`)
        .send({ nombre: 'Nuevo Nombre' })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('Debe inhabilitar un usuario exitosamente', async () => {
      const usuario = new User({
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      });
      await usuario.save();

      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({ correo: 'juan@test.com', contrasena: 'password123' });

      const token = loginResponse.body.token;

      const response = await request(app)
        .delete(`/api/users/${usuario._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.mensaje).toBe('Usuario inhabilitado exitosamente');
      expect(response.body.usuario.activo).toBe(false);
    });

    test('Debe fallar sin autenticación', async () => {
      const usuario = new User({
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      });
      await usuario.save();

      const response = await request(app)
        .delete(`/api/users/${usuario._id}`)
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/users/:id/reservations', () => {
    test('Debe obtener las reservas de un usuario', async () => {
      const usuario = new User({
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      });
      await usuario.save();

      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({ correo: 'juan@test.com', contrasena: 'password123' });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get(`/api/users/${usuario._id}/reservations`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.reservas).toBeDefined();
      expect(Array.isArray(response.body.reservas)).toBe(true);
    });

    test('Debe fallar sin autenticación', async () => {
      const usuario = new User({
        nombre: 'Juan Pérez',
        correo: 'juan@test.com',
        contrasena: 'password123'
      });
      await usuario.save();

      const response = await request(app)
        .get(`/api/users/${usuario._id}/reservations`)
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });
});