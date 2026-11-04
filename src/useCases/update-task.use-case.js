import { update } from '../repositories/task.repository.js';
import AppError from '../entities/app-error.js';
import { createTask } from "../entities/task.entity.js";
export default function updateTask(id, data) {
  const task = update(id, createTask(data));
  if (!task) throw new AppError(404, { mensaje: 'Tarea no encontrada' });
  return task;
}
