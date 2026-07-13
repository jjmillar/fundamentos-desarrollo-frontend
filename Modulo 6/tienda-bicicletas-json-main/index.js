const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Configurar EJS
app.set("view engine", "ejs");

// Permitir recibir datos desde formularios
app.use(express.urlencoded({ extended: true }));

const rutaDatos = path.join(__dirname, "data", "bicicletas.json");

function leerDatos(){
    const contenido = fs.readFileSync(rutaDatos, "utf-8");

    return JSON.parse(contenido);
}

function guardarDatos(datos){
    fs.writeFileSync(rutaDatos, JSON.stringify(datos, null, 4));
}

// Página principal
app.get("/", (req, res) => {
    const datos = leerDatos();

    const bicicletasArrendadas =
        datos.totalBicicletas - datos.bicicletasDisponibles;

    const porcentajeOcupacion =
        (bicicletasArrendadas / datos.totalBicicletas) * 100;

    res.render("inicio", {
        titulo: "Inicio",
        totalBicicletas: datos.totalBicicletas,
        bicicletasDisponibles: datos.bicicletasDisponibles,
        bicicletasArrendadas: bicicletasArrendadas,
        totalArriendos: datos.totalArriendos,
        totalDevoluciones: datos.totalDevoluciones,
        porcentajeOcupacion: porcentajeOcupacion
    });
});

// Mostrar formulario para arrendar
app.get("/arrendar", (req, res) => {
    const datos = leerDatos();

    res.render("arrendar", {
        titulo: "Arrendar bicicletas",
        bicicletasDisponibles: datos.bicicletasDisponibles,
        mensaje: "",
        tipoMensaje: ""
    });
});

// Procesar arriendo
app.post("/arrendar", (req, res) => {
    const datos = leerDatos();

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
    } else if (cantidad > datos.bicicletasDisponibles) {
        mensaje = "No hay suficientes bicicletas disponibles.";
        tipoMensaje = "danger";
    } else {
        datos.bicicletasDisponibles -= cantidad;
        datos.totalArriendos += cantidad;

        guardarDatos(datos);

        mensaje = `${nombre} arrendó ${cantidad} bicicleta(s) correctamente.`;
        tipoMensaje = "success";
    }

    res.render("arrendar", {
        titulo: "Arrendar bicicletas",
        bicicletasDisponibles: datos.bicicletasDisponibles,
        mensaje,
        tipoMensaje
    });
});

// Mostrar formulario para devolver
app.get("/devolver", (req, res) => {
    const datos = leerDatos();

    res.render("devolver", {
        titulo: "Devolver bicicletas",
        bicicletasDisponibles: datos.bicicletasDisponibles,
        mensaje: "",
        tipoMensaje: ""
    });
});

// Procesar devolución
app.post("/devolver", (req, res) => {
    const datos = leerDatos();

    const nombre = req.body.nombre;
    const cantidad = Number(req.body.cantidad);

    const bicicletasArrendadas =
        datos.totalBicicletas - datos.bicicletasDisponibles;

    let mensaje;
    let tipoMensaje;

    if (
        nombre.trim() === "" ||
        isNaN(cantidad) ||
        cantidad <= 0
    ) {
        mensaje = "Debe ingresar datos válidos.";
        tipoMensaje = "danger";
    } else if (cantidad > datos.bicicletasArrendadas) {
        mensaje = "No se puede devolver esa cantidad de bicicletas.";
        tipoMensaje = "danger";
    } else {
        datos.bicicletasDisponibles += cantidad;
        datos.totalDevoluciones += cantidad;

        guardarDatos(datos);

        mensaje = `${nombre} devolvió ${cantidad} bicicleta(s) correctamente.`;
        tipoMensaje = "success";
    }

    res.render("devolver", {
        titulo: "Devolver bicicletas",
        bicicletasDisponibles: datos.bicicletasDisponibles,
        mensaje,
        tipoMensaje
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});