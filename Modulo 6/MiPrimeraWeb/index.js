const express = require("express");
const app = express();
const puerto = 3000;
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Index</title>
            </head>
            <body>
                <h1>Bienvenidos</h1>
                <p>Este es mi primer sitio hecho con Node Express</p>
                <p><a href="/contacto">Ver datos de contacto</a></p>
                <h6>Sitio hecho en el Bootcamp Full Stack de Javascript</h6>
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
            </head>
            <body>
                <h1>Contacto</h1>
                <p>micorreo@gmail.com</p>
                <p>+56 9 87654321</p>
                <a href="/">Volver a index</a>
            </body>
        </html>
    `);
});
app.listen(puerto, () => {
    console.log(`Servidor en funcionamiento. http://localhost:${puerto}`);
});