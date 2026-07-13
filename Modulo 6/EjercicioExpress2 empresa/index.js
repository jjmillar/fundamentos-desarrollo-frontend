const express = require("express");

const app = express();
const puerto = 3000;

app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">

            <head>
                <meta charset="UTF-8">
                <title>Tienda de Tecnología</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>

            <body>
                <div class="container mt-3">

                    <h1>Tienda de Tecnología</h1>

                    <p>¡Bienvenido a nuestra tienda de tecnología!</p>

                    <ul>
                        <li> 
                            <a href="/productos" class="btn btn-primary">Productos</a>
                        </li>
                        <li>
                            <a href="/ofertas" class="btn btn-primary">Ofertas</a>
                        </li>
                        <li>
                            <a href="/contacto" class="btn btn-primary">Contacto</a>
                        </li>
                    </ul>

                </div>
            </body>

        </html>
    `);
});

app.get("/productos", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Productos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <h1>Productos</h1>
                <ul>
                    <li>Monitor 24 pulgadas</li>
                    <li>Teclado mecánico</li>
                    <li>Ratón gaming</li>
                    <li>Headset de gaming</li>
                    <li>Mousepad</li>
                    <li>Disco duro SSD 1TB</li>
                </ul>

                <p>
                    <a href="/">Volver al inicio</a>
                </p>
                
            </body>
        </html>
    `);
});

app.get("/ofertas", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">

            <head>
                <meta charset="UTF-8">
                <title>Ofertas</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>

            <body>

                <h1>Ofertas</h1>
                <ul>
                    <li>Monitor 24 pulgadas - 20% de descuento</li>
                    <li>Teclado mecánico - 15% de descuento</li>
                    <li>Ratón gaming - 10% de descuento</li>
                    <li>Headset de gaming - 25% de descuento</li>
                    <li>Mousepad - 5% de descuento</li>
                    <li>Disco duro SSD 1TB - 30% de descuento</li>
                </ul>

                <p>
                    <a href="/">Volver al inicio</a>
                </p>

            </body>

        </html>
    `);
});

app.get("/contacto", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Contacto</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <h1>Contacto</h1>
                <ul>
                    <li>Teléfono: +34 123 456 789</li>
                    <li>Email: initialmail@example.com</li>
                    <li>Dirección: Calle Falsa 123, Ciudad, País</li>
                </ul>

                <p>
                    <a href="/">Volver al inicio</a>
                </p>
                
            </body>
        </html>
    `);
});

app.listen(puerto, () => {
    console.log(`Servidor en funcionamiento. http://localhost:${puerto}`);
});