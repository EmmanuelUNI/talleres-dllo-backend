import jwt from 'jsonwebtoken';
import User from '../../models/user.model';
import { ILoginResponse } from '../../types/user.types';

const loginUser = async (correo: string, contrasena: string): Promise<ILoginResponse> => {
  if (!correo || !contrasena) {
    throw new Error('Correo y contraseña son requeridos');
  }

  const usuario = await User.findOne({ correo, activo: true });
  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  const esValida = await usuario.compararContrasena(contrasena);
  if (!esValida) {
    throw new Error('Credenciales inválidas');
  }

  const userId = usuario._id.toString();

  // FIX: Agregar payload correcto al jwt.sign
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const usuarioObj = usuario.toObject();
  delete usuarioObj.contrasena;

  return { 
    usuario: usuarioObj as any, 
    token 
  };
};

export default loginUser;