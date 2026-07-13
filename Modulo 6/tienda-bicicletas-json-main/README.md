# 🚲 Sistema de Arriendo de Bicicletas

Aplicación web desarrollada con **Node.js**, **Express** y **EJS** que simula un sistema de arriendo de bicicletas.

A diferencia de la versión inicial, esta implementación incorpora **persistencia de datos mediante archivos JSON**, permitiendo que la información se mantenga incluso después de reiniciar el servidor.

El proyecto fue desarrollado con fines educativos para practicar el desarrollo de aplicaciones web utilizando Express, el manejo de formularios, rutas, plantillas EJS y almacenamiento de datos mediante archivos de texto.

---

## Tecnologías utilizadas

- Node.js
- Express
- EJS
- Bootstrap 5
- Módulo **fs** de Node.js
- Archivos JSON para persistencia

---

## Funcionalidades

- Visualizar bicicletas disponibles.
- Registrar arriendos.
- Registrar devoluciones.
- Validar operaciones incorrectas.
- Mostrar estadísticas del sistema.
- Utilizar plantillas EJS y partials.
- Persistir los datos utilizando archivos JSON.

---

## Estructura del proyecto

```text
arriendo-bicicletas/
│
├── index.js
├── package.json
├── data/
│   └── bicicletas.json
└── views/
    ├── inicio.ejs
    ├── arrendar.ejs
    ├── devolver.ejs
    └── partials/
        ├── head.ejs
        ├── navbar.ejs
        └── footer.ejs
```

---

## Archivo de datos

El sistema utiliza el archivo:

```text
data/bicicletas.json
```

Contenido inicial:

```json
{
    "totalBicicletas": 20,
    "bicicletasDisponibles": 20,
    "totalArriendos": 0,
    "totalDevoluciones": 0
}
```

Cada vez que se realiza un arriendo o una devolución, este archivo es actualizado automáticamente.

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/patricio-silva-morales/tienda-bicicletas-json
```

Ingresar a la carpeta del proyecto:

```bash
cd arriendo-bicicletas
```

Instalar las dependencias:

```bash
npm install
```

---

## Ejecutar la aplicación

```bash
node index.js
```

Abrir el navegador en:

```
http://localhost:3000
```

---

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/arrendar` | Formulario para registrar un arriendo |
| `/devolver` | Formulario para registrar una devolución |

---

## Persistencia de datos

La aplicación utiliza el módulo **fs** de Node.js para trabajar con archivos.

### Leer información

```javascript
const contenido = fs.readFileSync(
    rutaDatos,
    "utf-8"
);

const datos = JSON.parse(contenido);
```

### Guardar información

```javascript
fs.writeFileSync(
    rutaDatos,
    JSON.stringify(datos, null, 4)
);
```

De esta manera, los datos permanecen almacenados aunque el servidor sea detenido y ejecutado nuevamente.

---

## Validaciones implementadas

- No permite ingresar cantidades menores o iguales a cero.
- No permite arrendar más bicicletas de las disponibles.
- No permite devolver más bicicletas de las que actualmente están arrendadas.
- Muestra mensajes informativos utilizando Bootstrap.

---

## Estadísticas disponibles

La página principal muestra:

- Total de bicicletas.
- Bicicletas disponibles.
- Bicicletas arrendadas.
- Total histórico de arriendos.
- Total histórico de devoluciones.
- Porcentaje de ocupación.

---

## Ventajas de utilizar JSON

- No requiere instalar un motor de base de datos.
- Permite practicar persistencia de información.
- Es sencillo de leer y modificar.
- Ideal para proyectos educativos y de pequeña escala.

---

## Limitaciones

Aunque los datos se almacenan en un archivo JSON, este mecanismo presenta algunas limitaciones:

- No está pensado para múltiples usuarios trabajando simultáneamente.
- No ofrece mecanismos de seguridad ni control de concurrencia.
- No reemplaza una base de datos en aplicaciones reales.

Para proyectos de mayor tamaño se recomienda utilizar sistemas gestores de bases de datos como PostgreSQL, MySQL o MongoDB.

---

## Próximas mejoras

- Historial de movimientos en un segundo archivo JSON.
- Registro de clientes.
- Gestión de múltiples sucursales.
- Búsqueda de movimientos.
- Migración a PostgreSQL o MySQL.

---

## Licencia

Proyecto desarrollado con fines educativos para el aprendizaje de **Node.js**, **Express**, **EJS** y persistencia de datos mediante archivos JSON.
