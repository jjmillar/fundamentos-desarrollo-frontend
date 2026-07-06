const express = require("express");
const app = express();
const puerto = 3000;
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Tienda de Videojuegos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container mt-3">
                    <h1>Tienda Gamer</h1>
                    <p>¡Bienvenido a nuestra tienda de videojuegos!</p>
                    
                    <p> 
                        <a href="/catalogo" class="btn btn-primary">Ver catálogo de videojuegos</a>
                    </p>
                    <p>
                        <a href="/contacto" class="btn btn-primary">Ver datos de contacto</a>
                    </p>
                </div>
            </body>
        </html>
    `);
});

app.get("/catalogo", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Catálogo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <h1>Catálogo de Videojuegos</h1>
                <ul>
                    <li>EA Sports FC 26</li>
                    <li>Minecraft</li>
                    <li>Grand Theft Auto V</li>
                    <li>The Legend of Zelda: Tears of the Kingdom</li>
                    <li>Call of Duty: Black Ops 7</li>
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
                <p><strong>Tienda:</strong> Tienda Gamer</p>
                <p><strong>Correo:</strong> contacto@tiendagamer.cl</p>
                <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
                <p><strong>Dirección:</strong> Av. Los Videojuegos 123, Santiago, Chile</p>
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