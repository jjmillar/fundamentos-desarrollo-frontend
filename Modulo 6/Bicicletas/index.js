const express = require("express");

const app = express();
const PORT = 3000;

// Configurar EJS
app.set("view engine", "ejs");

// Permitir recibir datos desde formularios
app.use(express.urlencoded({ extended: true }));

// Variables almacenadas en el servidor
const totalBicicletas = 20;
let bicicletasDisponibles = 20;

let totalArriendos = 0;
let totalDevoluciones = 0;

// Página principal
app.get("/", (req, res) => {
    const bicicletasArrendadas =
        totalBicicletas - bicicletasDisponibles;

    const porcentajeOcupacion =
        (bicicletasArrendadas / totalBicicletas) * 100;

    res.render("inicio", {
        titulo: "Inicio",
        bicicletasDisponibles,
        bicicletasArrendadas,
        totalArriendos,
        totalDevoluciones,
        porcentajeOcupacion
    });
});

// Mostrar formulario para arrendar
app.get("/arrendar", (req, res) => {
    res.render("arrendar", {
        titulo: "Arrendar bicicletas",
        bicicletasDisponibles,
        mensaje: "",
        tipoMensaje: ""
    });
});

// Procesar arriendo
app.post("/arrendar", (req, res) => {
    const nombre = req.body.nombre;
    const cantidad = Number(req.body.cantidad);

    let mensaje;
    let tipoMensaje;

    if (
        nombre.trim() === "" ||
        isNaN(cantidad) ||
        cantidad <= 0
    ) {
        mensaje = "Debe ingresar datos válidos.";
        tipoMensaje = "danger";
    } else if (cantidad > bicicletasDisponibles) {
        mensaje = "No hay suficientes bicicletas disponibles.";
        tipoMensaje = "danger";
    } else {
        bicicletasDisponibles -= cantidad;
        totalArriendos += cantidad;

        mensaje = `${nombre} arrendó ${cantidad} bicicleta(s) correctamente.`;
        tipoMensaje = "success";
    }

    res.render("arrendar", {
        titulo: "Arrendar bicicletas",
        bicicletasDisponibles,
        mensaje,
        tipoMensaje
    });
});

// Mostrar formulario para devolver
app.get("/devolver", (req, res) => {
    res.render("devolver", {
        titulo: "Devolver bicicletas",
        bicicletasDisponibles,
        mensaje: "",
        tipoMensaje: ""
    });
});

// Procesar devolución
app.post("/devolver", (req, res) => {
    const nombre = req.body.nombre;
    const cantidad = Number(req.body.cantidad);

    const bicicletasArrendadas =
        totalBicicletas - bicicletasDisponibles;

    let mensaje;
    let tipoMensaje;

    if (
        nombre.trim() === "" ||
        isNaN(cantidad) ||
        cantidad <= 0
    ) {
        mensaje = "Debe ingresar datos válidos.";
        tipoMensaje = "danger";
    } else if (cantidad > bicicletasArrendadas) {
        mensaje = "No se puede devolver esa cantidad de bicicletas.";
        tipoMensaje = "danger";
    } else {
        bicicletasDisponibles += cantidad;
        totalDevoluciones += cantidad;

        mensaje = `${nombre} devolvió ${cantidad} bicicleta(s) correctamente.`;
        tipoMensaje = "success";
    }

    res.render("devolver", {
        titulo: "Devolver bicicletas",
        bicicletasDisponibles,
        mensaje,
        tipoMensaje
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});