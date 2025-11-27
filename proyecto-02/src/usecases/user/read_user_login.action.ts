import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../../models/user.model';
import { ILoginResponse } from '../../types/user.types';

const loginUser = async (correo: string, password: string): Promise<ILoginResponse> => {
  if (!correo || !password) {
    throw new Error('Correo y contraseña son requeridos');
  }

  const usuario = await User.findOne({ correo, activo: true });
  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  const esValida = await usuario.compararPassword(password);
  if (!esValida) {
    throw new Error('Credenciales inválidas');
  }

  const userId = usuario._id.toString();

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET no está configurado');
  }

  const token = jwt.sign(
    { id: userId },
    jwtSecret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    } as SignOptions
  );

  const usuarioObj = usuario.toJSON();

  return { 
    usuario: usuarioObj as any, 
    token 
  };
};

export default loginUser;