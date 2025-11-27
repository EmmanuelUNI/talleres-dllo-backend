import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserDocument } from '../types/user.types';

const userSchema = new Schema<IUserDocument>({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  permisos: {
    crearLibros: {
      type: Boolean,
      default: false
    },
    modificarLibros: {
      type: Boolean,
      default: false
    },
    inhabilitarLibros: {
      type: Boolean,
      default: false
    },
    modificarUsuarios: {
      type: Boolean,
      default: false
    },
    inhabilitarUsuarios: {
      type: Boolean,
      default: false
    }
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.compararPassword = async function(passwordIngresado: string): Promise<boolean> {
  try {
    return await bcrypt.compare(passwordIngresado, this.password);
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model<IUserDocument>('User', userSchema);