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
  contrasena: {
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

// FIX: Corregir el pre-save hook
userSchema.pre('save', async function(next) {
  if (!this.isModified('contrasena')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// FIX: Corregir el método de comparación
userSchema.methods.compararContrasena = async function(contrasenaIngresada: string): Promise<boolean> {
  try {
    return await bcrypt.compare(contrasenaIngresada, this.contrasena);
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.contrasena;
  return obj;
};

export default mongoose.model<IUserDocument>('User', userSchema);