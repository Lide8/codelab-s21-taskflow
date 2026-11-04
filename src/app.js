// Importaciones de modulos nativos y de terceros
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// Importaciones de la aplicacion (Propias)
import taskRouter from './routes/task.routes.js';
import authRouter from './routes/auth.routes.js';
import errorHandler from './middlewares/error.handler.js';

const app = express();

app.use(helmet());

app.use(cors({
  origin: (process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5500').split(',').map(origin => origin.trim()),
}));



app.use(morgan(':method :url :status :response-time ms', { skip: () => process.env.DISABLE_MORGAN === 'true' }));

app.use(express.json());

const publicDir = path.join(process.cwd(), 'public');



app.use('/assets', express.static(path.join(publicDir, 'assets')));

app.use('/api/v1/tasks', taskRouter);
app.use('/api/tasks', taskRouter);
app.use(authRouter);

app.get('/', (request, response) => {
  response.sendFile('index.html', {
    root: path.join(publicDir, 'views'),
    dotfiles: 'deny',
  });
});

app.get('/api/health', (request, response) => {
  response.json({ status: 'Ok', system: 'TaskFlow' });
});

app.get('/api/info', (request, response) => {
  const info = {
    name : 'TaskFlow',
    version: '1.0.0',
    description: 'TaskFlow, el sistema de seguimiento de tareas y proyectos.',
  };

  response.json(info);
});

app.use((request, response) => {
  const mensaje = {
    mensaje: 'Ruta no encontrada',
    path: request.path,
  };
  response.status(404).json(mensaje);
});

app.use(errorHandler);

export default app;
