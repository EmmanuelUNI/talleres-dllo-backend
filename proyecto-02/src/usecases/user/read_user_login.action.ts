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

  const token = jwt.sign(
    { id: usuario._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { usuario: usuario.toJSON(), token };
};

export default loginUser;