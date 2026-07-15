# Netflix Catalog - API + Cliente Web

Servicio web en Node.js + Express con archivos JSON locales y cliente web para un catálogo de series y películas.

## Backend

- GET `/api/catalogo?tipo=pelicula`
- GET `/api/catalogo?tipo=serie`
- POST `/api/catalogo?tipo=pelicula`
- POST `/api/catalogo?tipo=serie`
- DELETE `/api/catalogo?nombre=...&tipo=pelicula o serie`
- Otros métodos sobre `/api/catalogo` devuelven 405

Los datos se almacenan en:
- `data/peliculas.json`
- `data/series.json`

## Frontend

Abrir `public/index.html`. Consume el backend y permite:
- Visualizar películas y series
- Ordenar por nombre, año, director o temporadas
- Agregar películas y series
- Eliminar elementos del listado

## Ejecución

```bash
cd C:/Users/juanc/Desktop/netflix-catalog
npm install
npm start
```

Luego abrir `http://localhost:3000`.

## Autor

Juan Carlos Millar  
GitHub: [@jjmillar](https://github.com/jjmillar)
