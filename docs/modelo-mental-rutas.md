# Práctica guiada S19: Express - rutas

## Objetivo

Extender TaskFlow con rutas Express que entregan la vista inicial mediante `res.sendFile()`, publican recursos bajo `/assets` y leen parámetros, query strings y body JSON.

## Modelo mental

```mermaid
sequenceDiagram
    participant Cliente
    participant Express
    participant Ruta

    Cliente->>Express: GET /
    Express->>Ruta: res.sendFile(index.html)
    Ruta-->>Cliente: Vista TaskFlow
    Cliente->>Express: GET /api/tasks?status=TODO
    Express->>Ruta: req.query.status
    Ruta-->>Cliente: res.json(tareas)
```