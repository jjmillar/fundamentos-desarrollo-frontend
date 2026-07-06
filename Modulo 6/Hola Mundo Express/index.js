const express = require("express");
const app = express();
const puerto = 3000;
app.get("/", (req, res) => {
    res.send(`
        <h1>Hola Mundo!</h1>
        <p>Bienvenidos a nuestro segundo proyecto en Node</p>
    `);
});
app.listen(puerto, () => {
    console.log(`Servidor en funcionamiento. http://localhost:${puerto}`);
});