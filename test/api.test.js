import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { once } from 'node:events';

const directory = await mkdtemp(path.join(process.cwd(), '.test-data-'));
process.env.USERS_FILE = path.join(directory, 'users.json');
process.env.FRONTEND_ORIGIN = 'http://localhost:5500';
const { default: app } = await import('../src/app.js');
let server;
let base;
const evidence = [];
const password = process.env.TEST_PASSWORD || 'Solo-prueba-9876';
const user = { name: 'Estudiante Demo', email: 'demo@example.com', password };
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
  await writeFile(new URL('../docs/resultados-pruebas.json', import.meta.url), JSON.stringify(evidence, null, 2));
  await rm(directory, { recursive: true, force: true });
});
async function request(name, method, route, body, expected) {
  const response = await fetch(`${base}${route}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  assert.equal(response.status, expected, name);
  assert.ok(!text.includes(password));
  assert.ok(!text.includes('scrypt:'));
  evidence.push({ caso: name, method, route, expected, actual: response.status, response: data });
  return data;
}
test('CRUD completo, filtros, stats, errores y compatibilidad original', async () => {
  const tasks = await request('Listado', 'GET', '/api/tasks', undefined, 200);
  assert.equal(tasks.length, 3);
  const created = await request('Crear tarea', 'POST', '/api/tasks', { title: 'Nueva tarea', status: 'TODO' }, 201);
  await request('Obtener tarea', 'GET', `/api/tasks/${created.id}`, undefined, 200);
  const updated = await request('Actualizar tarea', 'PUT', `/api/tasks/${created.id}`, { title: 'Finalizada', status: 'DONE', project: 'DASW' }, 200);
  assert.equal(updated.status, 'DONE');
  const filtered = await request('Filtros y orden', 'GET', '/api/tasks?status=DONE&project=DASW&sort=title', undefined, 200);
  assert.equal(filtered.length, 1);
  await request('Estadísticas', 'GET', '/api/tasks/stats', undefined, 200);
  await request('Body tarea inválido', 'POST', '/api/tasks', {}, 400);
  assert.equal(await request('Eliminar sin body', 'DELETE', `/api/tasks/${created.id}`, undefined, 204), null);
  await request('ID inexistente', 'GET', `/api/tasks/${created.id}`, undefined, 404);
  await request('PUT inexistente', 'PUT', '/api/tasks/999', { title: 'No existe', status: 'TODO' }, 404);
  await request('DELETE inexistente', 'DELETE', '/api/tasks/999', undefined, 404);
  const legacy = await request('Compatibilidad crear v1', 'POST', '/api/v1/tasks', { title: 'Legacy', status: 'TODO' }, 201);
  const deleted = await request('Compatibilidad DELETE 200 v1', 'DELETE', `/api/v1/tasks/${legacy.id}`, undefined, 200);
  assert.equal(deleted.tareaEliminada.id, legacy.id);
});
test('Seis casos de autenticación y persistencia sin secretos en respuestas', async () => {
  const registered = await request('Registro válido', 'POST', '/registro', user, 201);
  assert.equal(registered.email, user.email);
  assert.ok(!Object.hasOwn(registered, 'password'));
  await request('Validación fallida', 'POST', '/registro', { name: '', email: 'incorrecto', password: 'x' }, 400);
  await request('Email repetido normalizado', 'POST', '/registro', { ...user, email: 'DEMO@example.com' }, 409);
  await request('Login válido', 'POST', '/login', { email: user.email, password }, 200);
  await request('Login inválido', 'POST', '/login', { email: user.email, password: 'incorrecta-987' }, 401);
  await request('Login usuario inexistente', 'POST', '/login', { email: 'otro@example.com', password }, 401);
  await request('Logout', 'POST', '/logout', {}, 200);
  const stored = JSON.parse(await readFile(process.env.USERS_FILE, 'utf8'));
  assert.equal(stored.length, 1);
  assert.ok(stored[0].password.startsWith('scrypt:'));
  assert.notEqual(stored[0].password, password);
  const safe = stored.map(({ password: _hidden, ...entry }) => ({ ...entry, password: '[OCULTO]' }));
  await writeFile(new URL('../docs/users-protegido.json', import.meta.url), JSON.stringify(safe, null, 2));
  const parallel = await Promise.all([1, 2].map(() => fetch(`${base}/registro`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...user, email: 'paralelo@example.com' }) })));
  assert.deepEqual(parallel.map(r => r.status).sort(), [201, 409]);
});
test('Helmet, CORS, JSON inválido y errores centralizados', async () => {
  const allowed = await fetch(`${base}/api/health`, { headers: { Origin: 'http://localhost:5500' } });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5500');
  assert.equal(allowed.headers.get('x-content-type-options'), 'nosniff');
  const denied = await fetch(`${base}/api/health`, { headers: { Origin: 'https://no-permitido.example' } });
  assert.equal(denied.headers.get('access-control-allow-origin'), null);
  const malformed = await fetch(`${base}/registro`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{malformado' });
  assert.equal(malformed.status, 400);
  await request('Ruta inexistente', 'GET', '/inexistente', undefined, 404);
});
