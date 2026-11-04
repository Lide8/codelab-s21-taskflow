import { create } from '../repositories/task.repository.js';
import { createTask } from '../entities/task.entity.js';
export default data => create(createTask(data));
