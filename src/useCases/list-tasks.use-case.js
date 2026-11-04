import { findAll } from '../repositories/task.repository.js';
export default function listTasks({ status, project, sort } = {}) {
  let tasks = findAll();
  if (typeof status === 'string' && status.trim()) tasks = tasks.filter(t => t.status === status);
  if (typeof project === 'string' && project.trim()) tasks = tasks.filter(t => t.project === project);
  if (sort === 'title') tasks.sort((a, b) => a.title.localeCompare(b.title));
  return tasks;
}
