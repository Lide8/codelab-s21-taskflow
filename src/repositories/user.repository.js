import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import AppError from '../entities/app-error.js';
const file = process.env.USERS_FILE || fileURLToPath(new URL('../data/users.json', import.meta.url));
let pending = Promise.resolve();
async function readUsers() {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}
export async function findByEmail(email) {
  return (await readUsers()).find(user => user.email === email.toLowerCase());
}
export function create(data) {
  const operation = pending.then(async () => {
    const users = await readUsers();
    if (users.some(user => user.email === data.email)) throw new AppError(409, { mensaje: 'El email ya está registrado' });
    users.push(data);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(`${file}.tmp`, JSON.stringify(users, null, 2), { mode: 0o600 });
    await rename(`${file}.tmp`, file);
    return data;
  });
  pending = operation.catch(() => undefined);
  return operation;
}
