# BancoEstado - Administración de Cuentas

Backend en Express + JSON local y frontend para ejecutivos del banco.

## Reglas de negocio

- Cada cliente puede tener máximo 1 cuenta RUT.
- Un cliente puede tener múltiples cuentas de ahorro.
- No se permite cliente sin cuenta RUT ni cuenta de ahorro sin cliente.
- Formato RUT referencial: `11111111-1`.

## Estructura

```
banco-estado/
  backend/
    package.json
    server.js
  data/
    clientes.json
    cuentas.json
  frontend/
    index.html
    app.js
    styles.css
```

## Ejecución

```bash
cd C:/Users/juanc/Desktop/banco-estado/backend
npm install
npm start
```

Luego abrir `frontend/index.html`.

## Backend

- `GET /api/clientes`
- `GET /api/clientes/rut`
- `POST /api/clientes`
- `POST /api/clientes/:rut/cuentas`
- `DELETE /api/clientes/:rut`
- `DELETE /api/clientes/:rut/cuentas/rut`
- `DELETE /api/clientes/:rut/cuentas/ahorro/:numero`

## Frontend

- Listar todos los clientes y sus cuentas.
- Listar clientes con cuenta RUT.
- Agregar cliente nuevo + RUT o ahorro.
- Agregar cuenta a cliente existente.
- Eliminar cliente, cuenta RUT o cuenta de ahorro.

## Autor

Juan Carlos Millar  
GitHub: [@jjmillar](https://github.com/jjmillar)
