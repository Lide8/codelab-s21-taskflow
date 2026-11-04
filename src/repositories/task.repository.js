const tasks = [
  { id: 1, title: 'Diseñar API REST', status: 'TODO', project: 'TaskFlow' },
  { id: 2, title: 'Separar rutas', status: 'DONE', project: 'TaskFlow' },
  { id: 3, title: 'Preparar pruebas', status: 'TODO', project: 'DASW' },
];
export const findAll = () => tasks.map(task => ({ ...task }));
export const findById = id => tasks.find(task => task.id === id);
export const create = data => {
  const task = { ...data, id: Math.max(0, ...tasks.map(item => item.id)) + 1 };
  tasks.push(task);
  return task;
};
export const update = (id, data) => {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return null;
  tasks[index] = { ...data, id };
  return tasks[index];
};
export const remove = id => {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return null;
  return tasks.splice(index, 1)[0];
};
