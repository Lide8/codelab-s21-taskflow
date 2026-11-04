# TaskFlow · CodeLab S21

Entrega individual: CRUD por capas y autenticación. Repositorio: https://github.com/Lide8/codelab-s21-taskflow

## Instalación y ejecución

Requiere Node.js 22.10 o posterior y npm. Desde la raíz del proyecto:

```sh
npm ci
cp .env.example .env
npm start
```

En Windows se puede copiar `.env.example` a `.env` con el explorador. `npm run dev` inicia con recarga; `npm test` ejecuta las pruebas; `npm run lint` revisa el código.

Configura PORT (3000 por defecto), FRONTEND_ORIGIN (orígenes exactos separados por comas) y ENV. Nunca subas `.env`. `USERS_FILE` permite usar otra ubicación de almacenamiento en pruebas; por defecto se utiliza `src/data/users.json`, inicialmente vacío.

## Arquitectura

`routes → controllers → useCases → repositories → datos`.
Las entities representan tareas y usuarios. Las rutas conectan validación con controllers; los controllers traducen HTTP; los casos de uso aplican operaciones; los repositories aíslan almacenamiento. `task.route.js` se conserva como reexportación para respetar el nombre del archivo base.

Al migrar a MongoDB cambiará la implementación de `user.repository.js`, no los contratos usados por use cases o controllers. El repositorio expone `findByEmail(email)` y `create(data)`; la unicidad se comprueba también dentro de la escritura serializada para evitar duplicados simultáneos en un proceso. El archivo se reemplaza mediante archivo temporal y rename. JSON no sustituye una base de datos para varios procesos concurrentes.

## Contratos HTTP

| Método | Ruta | Resultado |
|---|---|---|
| GET | /api/tasks | 200, arreglo; filtros status, project y sort=title |
| GET | /api/tasks/stats | 200, total/todo/done |
| GET | /api/tasks/:id | 200 o 404 |
| POST | /api/tasks | 201 o 400 |
| PUT | /api/tasks/:id | 200, 400 o 404 |
| DELETE | /api/tasks/:id | 204 sin cuerpo o 404 |
| POST | /registro | 201, 400 o 409 |
| POST | /login | 200, 400 o 401 |
| POST | /logout | 200 y mensaje |

La plantilla original usa `/api/v1/tasks` y DELETE 200 con `{mensaje,tareaEliminada}`; esta ruta sigue disponible con su contrato original. La guía pide `/api/tasks` y DELETE 204: se ofrece como alias sobre el mismo repositorio, con esa respuesta. Se preservan filtros, estadísticas, datos iniciales y valores por defecto.

## Autenticación y seguridad

Registro recibe name (texto no vacío), email válido y password de 8 a 1024 caracteres. Login recibe email y password con las mismas restricciones. El email se recorta y convierte a minúsculas. Las validaciones usan express-validator y devuelven errores sin el valor ingresado. Se guardan id, name, email, password, createdAt e isActive. `password` contiene un hash scrypt con salt aleatorio; nunca se devuelve ni se registra. Los demás campos se devuelven como usuario público.

No se implementan sesiones, cookies ni JWT. Login sólo verifica credenciales; logout devuelve un mensaje y no invalida tokens porque esta etapa no los emite. Las tareas no están protegidas por autenticación todavía.

Helmet aplica cabeceras, CORS limita los orígenes según el entorno y Morgan registra método, URL, estado y duración sin bodies. No envíes secretos en URLs. Los errores inesperados producen 500 genérico; JSON malformado devuelve 400. El repository debe mantenerse fuera del directorio público.

## Pruebas y evidencias

`npm test` usa HTTP real en un puerto temporal y un archivo de usuarios aislado, sin modificar users.json de la aplicación. Incluye CRUD completo, filtros, stats, 404, DELETE 204, compatibilidad v1; registro válido, body inválido, email repetido, login válido e inválido y logout; además duplicados concurrentes, hash persistido, CORS, Helmet y JSON malformado.

`docs/resultados-pruebas.json` contiene respuestas reales sin contraseñas; `docs/users-protegido.json` muestra persistencia con password oculto. `docs/morgan.log` es la salida real de las pruebas. `docs/evidencias.html` presenta esos resultados. `test/auth.http` permite repetir autenticación en REST Client usando una contraseña de entorno. No captures su valor. `src/data/users.json` se entrega vacío para no distribuir cuentas.

Base proporcionada por el curso: TaskFlow S21. Implementación de capas, autenticación y pruebas sobre esa plantilla.
