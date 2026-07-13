# 🚲 Sistema de Arriendo de Bicicletas

Aplicación web desarrollada con **Node.js**, **Express** y **EJS** que simula un sistema básico de arriendo de bicicletas.

El proyecto fue creado con fines educativos para practicar el desarrollo de aplicaciones web utilizando Express, el manejo de rutas, formularios, variables en el servidor y plantillas EJS.

---

## Tecnologías utilizadas

- Node.js
- Express
- EJS
- Bootstrap 5

---

## Funcionalidades

- Visualizar la cantidad de bicicletas disponibles.
- Registrar el arriendo de bicicletas.
- Registrar la devolución de bicicletas.
- Validar operaciones incorrectas.
- Mostrar estadísticas básicas.
- Utilizar plantillas EJS y partials.
- Navegación entre distintas vistas.

---

## Estructura del proyecto

```text
arriendo-bicicletas/
│
├── index.js
├── package.json
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

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/patricio-silva-morales/tienda-bicicletas
```

Ingresar al proyecto:

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

El servidor quedará disponible en:

```
http://localhost:3000
```

---

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/arrendar` | Formulario para arrendar bicicletas |
| `/devolver` | Formulario para devolver bicicletas |

---

## Variables del servidor

La aplicación utiliza variables almacenadas en memoria para controlar el estado del sistema.

```javascript
const totalBicicletas = 20;

let bicicletasDisponibles = 20;

let totalArriendos = 0;

let totalDevoluciones = 0;
```

Estas variables son modificadas cada vez que el usuario realiza un arriendo o una devolución.

---

## Validaciones implementadas

- No permite ingresar cantidades menores o iguales a cero.
- No permite arrendar más bicicletas de las disponibles.
- No permite devolver más bicicletas de las que actualmente están arrendadas.
- Muestra mensajes de éxito y error utilizando Bootstrap.

---

## Limitaciones

Como los datos se almacenan únicamente en variables del servidor:

- Al detener el servidor (`Ctrl + C`) toda la información se pierde.
- Al volver a ejecutar la aplicación, las variables vuelven a sus valores iniciales.
- Todos los usuarios comparten el mismo estado de la aplicación.

---

## Próximas mejoras

- Persistencia mediante archivos JSON.
- Persistencia utilizando una base de datos.
- Historial de movimientos.
- Gestión de clientes.
- Sistema de autenticación.

---

## Licencia

Proyecto desarrollado con fines educativos.
