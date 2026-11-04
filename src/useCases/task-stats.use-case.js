import { findAll } from '../repositories/task.repository.js';
export default function taskStats() {
  const tasks = findAll();
  return { total: tasks.length, todo: tasks.filter(t => t.status === 'TODO').length, done: tasks.filter(t => t.status === 'DONE').length };
}
