import { randomUUID } from 'node:crypto';
export const createUser = ({ name, email, password }) => ({ id: randomUUID(), name, email, password, createdAt: new Date().toISOString(), isActive: true });
export const publicUser = ({ id, name, email, createdAt, isActive }) => ({ id, name, email, createdAt, isActive });
