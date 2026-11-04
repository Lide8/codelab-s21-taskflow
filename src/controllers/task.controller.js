import listTasks from '../useCases/list-tasks.use-case.js';
import getTask from '../useCases/get-task-by-id.use-case.js';
import createTask from '../useCases/create-task.use-case.js';
import updateTask from '../useCases/update-task.use-case.js';
import removeTask from '../useCases/remove-task.use-case.js';
import taskStats from '../useCases/task-stats.use-case.js';
const handle = action => (req, res, next) => {
  try { action(req, res); } catch (error) { next(error); }
};
export const list = handle((req, res) => res.json(listTasks(req.query)));
export const getById = handle((req, res) => res.json(getTask(Number(req.params.id))));
export const create = handle((req, res) => res.status(201).json(createTask(req.body)));
export const update = handle((req, res) => res.json(updateTask(Number(req.params.id), req.body)));
export const stats = handle((_req, res) => res.json(taskStats()));
export const remove = handle((req, res) => {
  const tareaEliminada = removeTask(Number(req.params.id));
  if (req.baseUrl === '/api/v1/tasks') return res.status(200).json({ mensaje: 'Tarea Eliminada', tareaEliminada });
  res.status(204).end();
});
