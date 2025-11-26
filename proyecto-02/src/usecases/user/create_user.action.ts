import User from '../../models/user.model';
import { ICreateUserDTO, IUserDocument } from '../../types/user.types';

const createUser = async (userData: ICreateUserDTO): Promise<IUserDocument> => {
  const { nombre, correo, contrasena, permisos } = userData;

  if (!nombre || !correo || !contrasena) {
    throw new Error('Nombre, correo y contraseña son requeridos');
  }

  const usuarioExistente = await User.findOne({ correo });
  if (usuarioExistente) {
    throw new Error('El correo ya está registrado');
  }

  const nuevoUsuario = new User({
    nombre,
    correo,
    contrasena,
    permisos: permisos || {}
  });

  await nuevoUsuario.save();
  return nuevoUsuario;
};

export default createUser;