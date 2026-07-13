const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// "Base de datos"
let stock = 50;
let mensaje = "";
let tipoMensaje = "";

// VISTA 1: INICIO /
app.get("/", (req, res) => {
    res.render("inicio", { 
        nombreCafeteria: "Cafetería Express",
        stock: stock,
        mensaje: mensaje,
        tipo: tipoMensaje
    });
    mensaje = ""; // limpiar después de mostrar
    tipoMensaje = "";
});

// VISTA 2: REABASTECER /reabastecer
app.get("/reabastecer", (req, res) => {
    res.render("reabastecer", { stock: stock, mensaje: mensaje, tipo: tipoMensaje });
});

app.post("/reabastecer", (req, res) => {
    const cantidad = parseInt(req.body.cantidad);

    if (cantidad <= 0 || isNaN(cantidad)) {
        mensaje = "Error: La cantidad debe ser mayor a 0";
        tipoMensaje = "error";
    } else {
        stock += cantidad;
        mensaje = `Ingreso exitoso. Se agregaron ${cantidad} paquetes. Nuevo total: ${stock}`;
        tipoMensaje = "exito";
    }
    res.redirect("/");
});

// VISTA 3: CONSUMO /consumo
app.get("/consumo", (req, res) => {
    res.render("consumo", { stock: stock, mensaje: mensaje, tipo: tipoMensaje });
});

app.post("/consumo", (req, res) => {
    const cantidad = parseInt(req.body.cantidad);

    if (cantidad <= 0 || isNaN(cantidad)) {
        mensaje = "Error: La cantidad debe ser mayor a 0";
        tipoMensaje = "error";
    } else if (cantidad > stock) {
        mensaje = `Error: Stock insuficiente. Solo hay ${stock} paquetes disponibles`;
        tipoMensaje = "error";
    } else {
        stock -= cantidad;
        mensaje = `Consumo registrado. Se usaron ${cantidad} paquetes. Quedan: ${stock}`;
        tipoMensaje = "exito";
    }
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});