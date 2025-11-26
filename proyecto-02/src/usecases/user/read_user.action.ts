import User from '../../models/user.model';
import { IUserDocument } from '../../types/user.types';

const readUser = async (userId: string, incluirInactivos: boolean = false): Promise<IUserDocument> => {
  const query: any = { _id: userId };
  if (!incluirInactivos) {
    query.activo = true;
  }

  const usuario = await User.findOne(query);
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  return usuario;
};

export default readUser;