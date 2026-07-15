const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  extname: '.handlebars',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

hbs.handlebars.registerHelper('mayusculas', function (texto) {
  return String(texto || '').toUpperCase();
});

const tienda = 'MiniShop';
const bienvenida = 'Bienvenidos a la mejor tienda online';
const productos = [
  { nombre: "Camiseta Básica", precio: 15, disponible: true, imagen: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600" },
  { nombre: "Pantalón Jeans", precio: 30, disponible: false, imagen: "https://images.unsplash.com/photo-1583005008627-cf9c4e1a9d6d?w=600" },
  { nombre: "Zapatos Deportivos", precio: 50, disponible: true, imagen: "https://images.unsplash.com/photo-1528701800489-20be8c01c1a3?w=600" },
  { nombre: "Chaqueta de Cuero", precio: 80, disponible: true, imagen: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600" },
  { nombre: "Gorra Clásica", precio: 12, disponible: true, imagen: "https://images.unsplash.com/photo-1526170375885-bf2f5f0f3e3a?w=600" },
  { nombre: "Bolso de Mano", precio: 45, disponible: false, imagen: "https://images.unsplash.com/photo-1526170375885-43f5d6d4f00f?w=600" },
  { nombre: "Reloj Digital", precio: 60, disponible: true, imagen: "https://images.unsplash.com/photo-1526170375885-6c60d6f0f47f?w=600" },
  { nombre: "Bufanda de Lana", precio: 18, disponible: true, imagen: "https://images.unsplash.com/photo-1526170375885-6b73d6d0f0aa?w=600" },
  { nombre: "Sudadera Hoodie", precio: 35, disponible: false, imagen: "https://images.unsplash.com/photo-1526170375885-9f25d6f0f077?w=600" },
  { nombre: "Gafas de Sol", precio: 25, disponible: true, imagen: "https://images.unsplash.com/photo-1526170375885-fc40d6f0f0cc?w=600" },
];

const rutasPermitidas = ['/', '/about', '/contact'];
const metodosPermitidos = {
  '/': ['GET'],
  '/about': ['GET'],
  '/contact': ['GET', 'POST'],
};

function manejar405(res) {
  return res.status(405).send('Método no permitido');
}

rutasPermitidas.forEach((ruta) => {
  const metodos = metodosPermitidos[ruta] || ['GET'];
  [ 'get', 'head' ].forEach((m) => {
    if (!metodos.includes(m.toUpperCase())) {
      app[m.toLowerCase()](ruta, (req, res) => manejar405(res));
    }
  });
  [ 'post', 'put', 'patch', 'delete' ].forEach((m) => {
    if (!metodos.includes(m.toUpperCase())) {
      app[m.toLowerCase()](ruta, (req, res) => manejar405(res));
    }
  });
});

app.get('/', (req, res) => {
  res.render('home', { tienda, bienvenida, productos });
});

app.get('/about', (req, res) => {
  res.render('about', { tienda });
});

app.get('/contact', (req, res) => {
  res.render('contact', { tienda });
});

app.post('/contact', (req, res) => {
  const nombre = req.body.nombre || '';
  res.render('success', { tienda, nombre });
});

app.listen(PORT, () => {
  console.log(`MiniShop escuchando en http://localhost:${PORT}`);
});
