const express = require("express");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("inicio");
});

app.get("/destinos", (req, res) => {
    res.render("destinos");
});

app.get("/paquetes", (req, res) => {
    res.render("paquetes");
});

app.get("/contacto", (req, res) => {
    res.render("contacto");
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});