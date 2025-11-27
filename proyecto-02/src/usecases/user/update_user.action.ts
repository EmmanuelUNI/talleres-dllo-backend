import User from '../../models/user.model';
import { IUserDocument, IUpdateUserDTO } from '../../types/user.types';

const updateUser = async (
  userIdToUpdate: string, 
  updateData: IUpdateUserDTO, 
  requestingUser: IUserDocument
): Promise<IUserDocument> => {
  const usuarioAModificar = await User.findOne({ _id: userIdToUpdate, activo: true });
  
  if (!usuarioAModificar) {
    throw new Error('Usuario no encontrado');
  }

  const esElMismoUsuario = requestingUser._id.toString() === userIdToUpdate;
  const tienePermiso = requestingUser.permisos.modificarUsuarios;

  if (!esElMismoUsuario && !tienePermiso) {
    throw new Error('No tienes permisos para modificar este usuario');
  }

  const camposPermitidos: Array<keyof IUpdateUserDTO> = ['nombre', 'correo', 'password', 'permisos'];
  const actualizaciones: Partial<IUserDocument> = {};

  for (const campo of camposPermitidos) {
    if (updateData[campo] !== undefined) {
      (actualizaciones as any)[campo] = updateData[campo];
    }
  }

  if (updateData.correo && updateData.correo !== usuarioAModificar.correo) {
    const correoExistente = await User.findOne({ correo: updateData.correo });
    if (correoExistente) {
      throw new Error('El correo ya está registrado');
    }
  }

  Object.assign(usuarioAModificar, actualizaciones);
  await usuarioAModificar.save();

  return usuarioAModificar;
};

export default updateUser;