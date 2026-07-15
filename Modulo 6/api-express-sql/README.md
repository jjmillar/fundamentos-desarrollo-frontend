# API con Express + SQL: Conductores y Automóviles

API REST en Node.js + Express con base de datos en SQLite y frontend simple que consume los endpoints.

## Estructura

```
backend/
  server.js
  package.json
  database/
    actividad2.sql
frontend/
  index.html
  app.js
```

## Backend

- Node 18+
- Dependencias: `express`, `cors`, `sqlite3`

```bash
cd backend
npm install
npm start
```

El servidor usa el puerto definido en `PORT` o `3000` por defecto.

```bash
PORT=4000 npm start
```

## Frontend

Abrir `frontend/index.html` en el navegador. Por defecto se conecta a `http://localhost:3000`.

## Inicialización

Al iniciar, `server.js` crea automáticamente `database.sqlite` con las tablas y datos iniciales del ejercicio.

## Endpoints

- `GET /conductores`
- `GET /automoviles`
- `GET /conductoressinauto?edad=<numero>`
- `GET /solitos`
- `GET /auto?patente=<string>`
- `GET /auto?iniciopatente=<letra>`

## Autor

Juan Carlos Millar  
GitHub: [@jjmillar](https://github.com/jjmillar)
