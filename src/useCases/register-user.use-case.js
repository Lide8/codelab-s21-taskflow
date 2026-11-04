import * as repository from '../repositories/user.repository.js';
import { createUser, publicUser } from '../entities/user.entity.js';
import { hashPassword } from './password.js';
import AppError from '../entities/app-error.js';
export default async function registerUser(data) {
  if (await repository.findByEmail(data.email)) throw new AppError(409, { mensaje: 'El email ya está registrado' });
  const user = createUser({ ...data, password: await hashPassword(data.password) });
  return publicUser(await repository.create(user));
}
