# Guía Básica de Morgan

¡Hola! En esta guía aprenderemos qué es Morgan, para qué sirve y cómo agregarlo a tu servidor Node.js con Express para llevar un registro de todo lo que sucede.

## 1. ¿Qué es Morgan?

Imagina que tu servidor web es una tienda y tú eres el dueño. Cuando entra un cliente, compra algo y sale, te gustaría tener una libreta donde se anote automáticamente: “Cliente 1 entró a las 10:00 AM, pidió la página principal y todo salió bien".

Eso es Morgan. Es una herramienta (middleware) de Node.js que funciona como un registrador (logger). Cada vez que alguien hace una petición a tu servidor, Morgan escribe los detalles en la consola.

> En resumen: Morgan te muestra en tiempo real qué páginas o rutas están visitando los usuarios y si el servidor respondió con éxito o con un error.

## 2. ¿Por qué es útil?

Cuando desarrollas una aplicación, es muy difícil saber qué está pasando internamente en el servidor si no ves nada en la consola.

Morgan te ayuda a:

* Detectar errores rápidamente: Si una ruta falla (error 404 o 500), lo verás resaltado.

* Ver el tráfico: Sabrás qué rutas se consultan más.

* Medir el rendimiento: Te muestra cuánto tiempo tardó el servidor en responder a cada petición (en milisegundos).

## 3. Instalación

Abre la terminal en la carpeta de tu proyecto y ejecuta:

```bash
npm install morgan
```

## 4. Uso Básico (Paso a Paso)

Importa Morgan y dile a Express que lo use. Morgan tiene varios formatos predefinidos, pero el más popular para aprender y desarrollar es 'dev'.

```js

// 1. Importamos Express y Morgan
import express from 'express';
import morgan from 'morgan';

// 2. Creamos la app
const app = express();

// 3. Activamos Morgan en modo desarrollo ('dev') 🪵
// Colócalo SIEMPRE al inicio, antes de tus rutas
app.use(morgan('dev'));

// 4. Rutas de prueba
app.get('/', (req, res) => {
  res.send('¡Hola! Mira tu terminal para ver el registro.');
});

app.get('/productos', (req, res) => {
  res.json([{ id: 1, nombre: 'Laptop' }]);
});

// 5. Encendemos el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

```

### ¿Qué verás en la terminal?

Cada vez que entres a <http://localhost:3000/>, en tu consola aparecerá una línea parecida a esta:

```bash

GET / 200 12.345 ms - 42

```

**¿Qué significa cada parte?**

* ``GET``: El método HTTP utilizado.
* ``/``: La ruta solicitada.
* ``200``: El código de estado HTTP (200 significa “Todo salió bien").
* ``12.345 ms``: El tiempo que tardó el servidor en responder.

## 5. Formatos de Morgan

Morgan viene con diferentes modos de visualización que puedes pasar como texto en morgan('modo'):

1. ``dev``: Colorea las respuestas según su código (verde para éxito, rojo para errores). Ideal mientras estás programando.

2. ``tiny``: Muestra una versión muy corta con la información mínima.

3. ``combined``: Muestra información súper detallada (incluye el navegador del usuario, la IP, fecha y hora). Se usa mucho en servidores de producción.

```js
// Ejemplo usando el modo 'combined' para servidores de producción
app.use(morgan('combined'));
```

## 6. Resumen para llevar a casa

1. Morgan registra en consola todas las peticiones HTTP que llegan a tu servidor.
2. Se instala con `npm install morgan`.
3. Se activa con ``app.use(morgan('dev'))``.
4. Es la mejor herramienta para monitorear tu servidor mientras estás programando.
