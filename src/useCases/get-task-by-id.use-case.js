import { findById } from '../repositories/task.repository.js';
import AppError from '../entities/app-error.js';
export default function getTaskById(id) {
  const task = findById(id);
  if (!task) throw new AppError(404, { mensaje: 'No se encontró la tarea ', id });
  return task;
}
