import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { IUserDocument } from '../types/user.types';

export interface AuthRequest extends Request {
  user?: IUserDocument;
  userId?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'No se proporcionó token de autenticación' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findOne({ _id: decoded.id, activo: true });

    if (!user) {
      res.status(401).json({ error: 'Token inválido o usuario inactivo' });
      return;
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    res.status(401).json({ error: 'Autenticación fallida' });
  }
};

export const checkPermission = (permissionKey: keyof IUserDocument['permisos']) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.permisos[permissionKey]) {
      res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
      return;
    }
    next();
  };
};