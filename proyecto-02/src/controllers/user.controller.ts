import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import createUser from '../usecases/user/create_user.action';
import loginUser from '../usecases/user/read_user_login.action';
import readUser from '../usecases/user/read_user.action';
import updateUser from '../usecases/user/update_user.action';
import deleteUser from '../usecases/user/delete_user.action';
import getUserReservations from '../usecases/reservation/get_user_reservations.action';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuario = await createUser(req.body);
    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { correo, password } = req.body;
    const { usuario, token } = await loginUser(correo, password);
    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario,
      token
    });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const incluirInactivos = req.query.incluirInactivos === 'true';
    const usuario = await readUser(req.params.id, incluirInactivos);
    res.status(200).json({ usuario });
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const updateUserController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    const usuario = await updateUser(req.params.id, req.body, req.user);
    res.status(200).json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteUserController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }
    const usuario = await deleteUser(req.params.id, req.user);
    res.status(200).json({
      mensaje: 'Usuario inhabilitado exitosamente',
      usuario
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUserReservationsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservas = await getUserReservations(req.params.id);
    res.status(200).json({ reservas });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};