import { remove } from '../repositories/task.repository.js';
import AppError from '../entities/app-error.js';

export default function removeTask(id) {
  const task = remove(id);
  if (!task) throw new AppError(404, { mensaje: 'Tarea no encontrada' });
  return task;
}
