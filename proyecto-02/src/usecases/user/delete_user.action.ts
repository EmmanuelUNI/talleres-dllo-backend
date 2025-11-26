import User from '../../models/user.model';
import { IUserDocument } from '../../types/user.types';

const deleteUser = async (userIdToDelete: string, requestingUser: IUserDocument): Promise<IUserDocument> => {
  const usuarioAInhabilitar = await User.findOne({ _id: userIdToDelete, activo: true });
  
  if (!usuarioAInhabilitar) {
    throw new Error('Usuario no encontrado');
  }

  const esElMismoUsuario = requestingUser._id.toString() === userIdToDelete;
  const tienePermiso = requestingUser.permisos.inhabilitarUsuarios;

  if (!esElMismoUsuario && !tienePermiso) {
    throw new Error('No tienes permisos para inhabilitar este usuario');
  }

  usuarioAInhabilitar.activo = false;
  await usuarioAInhabilitar.save();

  return usuarioAInhabilitar;
};

export default deleteUser;