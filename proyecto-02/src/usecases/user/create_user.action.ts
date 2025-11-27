import User from '../../models/user.model';
import { ICreateUserDTO, IUserDocument } from '../../types/user.types';

const createUser = async (userData: ICreateUserDTO): Promise<IUserDocument> => {
  const { nombre, correo, password, permisos } = userData;

  if (!nombre || !correo || !password) {
    throw new Error('Nombre, correo y contraseña son requeridas');
  }

  const usuarioExistente = await User.findOne({ correo });
  if (usuarioExistente) {
    throw new Error('El correo ya está registrado');
  }

  const nuevoUsuario = new User({
    nombre,
    correo,
    password,
    permisos: permisos || {}
  });

  await nuevoUsuario.save();
  return nuevoUsuario;
};

export default createUser;