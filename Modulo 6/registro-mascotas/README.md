# Registro Civil de Mascotas

Sistema de registro de mascotas en Node.js + Express con almacenamiento en JSON local y frontend con Axios.

## Objetivo

Implementar un sistema de registro de mascotas para el gobierno de Chile que permita administrar información de mascotas y sus dueños mediante una API REST y un frontend funcional.

## Estructura

```
registro-mascotas/
  backend/
    package.json
    server.js
  data/
    mascotas.json
  frontend/
    index.html
    app.js
    styles.css
```

## Endpoints

- `GET /api/mascotas` - Lista todas las mascotas
- `GET /api/mascotas/buscar?nombre=...` - Busca mascota por nombre
- `GET /api/mascotas/buscar?rut=...` - Lista mascotas por RUT del dueño
- `POST /api/mascotas` - Crea una mascota
- `DELETE /api/mascotas?nombre=...` - Elimina una mascota por nombre
- `DELETE /api/mascotas?rut=...` - Elimina todas las mascotas de un RUT

## Ejecución

```bash
cd C:/Users/juanc/Desktop/registro-mascotas/backend
npm install
npm start
```

Luego abrir `frontend/index.html` en el navegador o con Live Server.

## Autor

Juan Carlos Millar  
GitHub: [@jjmillar](https://github.com/jjmillar)  
Repositorio: https://github.com/jjmillar/registro-mascotas
