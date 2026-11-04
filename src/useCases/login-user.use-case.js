import { findByEmail } from '../repositories/user.repository.js';
import { publicUser } from '../entities/user.entity.js';
import { verifyPassword } from './password.js';
import AppError from '../entities/app-error.js';
export default async function loginUser({ email, password }) {
  const user = await findByEmail(email);
  if (!user || !user.isActive || !await verifyPassword(password, user.password)) throw new AppError(401, { mensaje: 'Credenciales no válidas' });
  return publicUser(user);
}
