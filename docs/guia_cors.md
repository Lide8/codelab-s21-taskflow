# Guía Básica de CORS 🌐

¡Hola! En esta guía aprenderemos qué es **CORS**, por qué a veces nos causa problemas al programar y cómo resolverlo fácilmente usando el paquete `cors` en Node.js.

## 1. ¿Qué es CORS? 🤔

**CORS** significa *Cross-Origin Resource Sharing* (Compartimento de Recursos entre Orígenes Distintos).

Imagina que tu servidor backend está en una fiesta (por ejemplo, en `http://localhost:3000`) y tu frontend (hecho con React, Vue o HTML) está en otra fiesta distinta (por ejemplo, en `http://localhost:5000`).

Por razones de seguridad, los navegadores web **no permiten por defecto** que un sitio web pida datos a otro servidor que esté en una dirección o puerto diferente. Si intentas hacerlo sin permiso, el navegador bloqueará la respuesta y verás el famoso **"Error de CORS"** en la consola.

> **En resumen:** El paquete `cors` es el “pase de invitado” que tu backend le da a otros sitios web para que puedan pedirle información de forma segura.

## 2. ¿Por qué necesitamos configurarlo?

Si estás creando una API REST en Node.js para que la consuma una aplicación móvil o una página web hecha en React/Angular/Vue, **necesitas habilitar CORS**. De lo contrario, la página web no podrá recibir las respuestas de tu servidor.

## 3. Instalación 📦

Abre la terminal en la carpeta de tu servidor Express y ejecuta:
```bash
npm install cors
```

## 4. Uso Básico (Paso a Paso)

La forma más rápida de habilitar CORS para que **cualquier sitio web** pueda conectarse a tu API es la siguiente:

```js

// 1. Importamos Express y CORS
import express from 'express';
import cors from 'cors';

// 2. Creamos la app
const app = express();

// 3. ¡Activamos CORS!
// Esto permite que CUALQUIER origen haga peticiones a tu servidor
app.use(cors());

// 4. Tu API con datos
app.get('/api/usuarios', (req, res) => {
  res.json([
  { id: 1, nombre: 'Ana' },
  { id: 2, nombre: 'Carlos' }
  ]);
});

// 5. Encendemos el servidor
app.listen(3000, () => {
console.log('Servidor listo en http://localhost:3000');
});
```

¡Listo! Con solo agregar `app.use(cors())`, tu servidor dejará de rechazar peticiones de otros dominios o puertos.

## 5. Configuración Personalizada (Más Seguridad) ⚙️

Permitir que *todo el mundo* acceda a tu API está bien mientras estudias o si tu API es pública. Pero en proyectos profesionales, querrás dar acceso **solo a tu propio sitio web**.

Puedes restringir el acceso configurando la opción `origin`:

```js
// Definimos las opciones de seguridad
const corsOptions = {

  // Solo permitimos peticiones provenientes de este dominio específico
  origin: 'https://mi-tienda-online.com',
  optionsSuccessStatus: 200 // Para compatibilidad con navegadores antiguos
};

// Aplicamos CORS con nuestras reglas personalizadas
app.use(cors(corsOptions));
```

Si necesitas permitir **varios dominios específicos** (por ejemplo, tu sitio web local de pruebas y el sitio oficial), puedes usar una lista (array):

```js

const dominiosPermitidos = [
  'http://localhost:5173', // Tu frontend en desarrollo (Vite)
  'https://mi-tienda-online.com' // Tu frontend en internet
];

app.use(cors({
  origin: dominiosPermitidos
}));

```

## 6. Resumen para llevar a casa 📝

1. **CORS** es un mecanismo de seguridad del navegador que bloquea peticiones entre dominios o puertos distintos.
2. Se instala en el backend con `npm install cors`.
3. Para permitir el acceso a todos los orígenes durante el desarrollo, usas `app.use(cors())`.
4. Para producción, puedes especificar exactamente qué sitios web tienen permiso de consultar tu servidor.