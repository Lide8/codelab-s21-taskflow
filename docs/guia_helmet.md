# Guía Básica de Helmet.js

¡Hola! En esta guía aprenderás qué es **Helmet.js**, para qué sirve y cómo puedes agregarlo a tus proyectos de Node.js con Express de forma muy sencilla.

---

## 1. ¿Qué es Helmet?

Imagina que tu aplicación web es una casa. Cuando la construyes con Express, la casa funciona bien, pero algunas ventanas y puertas quedan sin candado.

**Helmet** es como un paquete de candados de seguridad instantáneos. Es una librería (middleware) para **Node.js** que protege tu aplicación configurando varios **encabezados HTTP** de seguridad.

> **En resumen:** Con una sola línea de código, **Helmet** oculta información sensible y bloquea varios ataques comunes de ciberseguridad.

## 2. ¿Por qué es importante usarlo?

Por defecto, cuando creas un servidor en Express, este le dice a todo el mundo: *"¡Hola! Soy un servidor hecho con Express"*. Los atacantes o *hackers* buscan esta información para explotar fallas conocidas de esa herramienta.

Helmet ayuda a:

* **Ocultar que usas Express** (para que los atacantes no sepan qué vulnerabilidades buscar).

* **Prevenir ataques XSS** (inyección de código malicioso en tus páginas).

* **Evitar que pongan tu página dentro de un `iframe` en otro sitio** (ataque de *Clickjacking*).

* **Forzar conexiones seguras (HTTPS)**.

## 3. Instalación

Para instalar Helmet en tu proyecto, abre la terminal en la carpeta de tu proyecto de Node.js y ejecuta el siguiente comando:

```bash

npm install helmet

```

## 4. Uso Básico (Paso a Paso)

Usar **Helmet** es muy fácil. Sólo debes importarlo y decirle a tu aplicación de Express que lo use antes de definir tus rutas.

Aquí tienes un ejemplo completo:

```javascript

// 1. Importamos Express y Helmet

import express from 'express';

import helmet from 'helmet';

// 2. Creamos la app de Express

const app = express();

// 3. ¡Activamos Helmet! 🛡️

// Es muy importante colocar esta línea ANTES de tus rutas

app.use(helmet());

// 4. Definimos una ruta normal

app.get('/', (req, res) => {
  res.send('¡Hola mundo! Mi servidor ahora es más seguro 🔒');
});

// 5. Encendemos el servidor

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

```

¡Y listo! Al poner `app.use(helmet())`, **Helmet** activa automáticamente **15 capas de protección** predeterminadas.

## 5. Configuración Personalizada ⚙️

Aunque la configuración por defecto de **Helmet** es excelente para la mayoría de proyectos, a veces necesitarás cambiar o desactivar algunas reglas.

Por ejemplo, si necesitas permitir que se carguen imágenes o scripts de otros sitios web, puedes configurar el módulo **Content Security Policy (CSP)**:

```javascript

app.use(
  helmet({

  // Desactivamos la protección de “frameguard” si queremos permitir iframes específicos
  frameguard: false,
  // Personalizamos qué fuentes externas permitimos (imágenes, estilos, scripts)
  contentSecurityPolicy: {
    directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'",'https://code.jquery.com'], // Permite scripts propios y de jQuery
    imgSrc: ["'self'", 'https://images.unsplash.com'], // Permite imágenes de Unsplash
    },  
  },
}));
```

## 6. Resumen para llevar a casa 📝

1. **Helmet** añade capas de seguridad a tu servidor Express automáticamente.

2. Se instala con `npm install helmet`.

3. Se activa agregando `app.use(helmet());` al inicio de tu aplicación.

4. Es una **buena práctica indispensable** para cualquier proyecto profesional en Node.js.F
