const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const rutaDatos = path.join(__dirname, "data", "partidas.json");

// Variable para guardar la partida actual
let partida = null;

// Clase Partida
class Partida {

    constructor(nombre) {
        this.nombre = nombre;
        this.numeroSecreto = Math.floor(Math.random() * 10) + 1;
        this.intentos = 0;
        this.puntaje = 0;
        this.finalizado = false;
        this.guardado = false;
        this.mensaje = "";
    }

}

// Leer JSON
function leerDatos() {
    const contenido = fs.readFileSync(rutaDatos, "utf8");
    return JSON.parse(contenido);
}

// Guardar JSON
function guardarDatos(datos) {
    fs.writeFileSync(
        rutaDatos,
        JSON.stringify(datos, null, 4)
    );
}

// Obtener fecha
function obtenerFecha() {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, "0");
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const año = hoy.getFullYear();
    return `${dia}-${mes}-${año}`;
}


// RUTA INICIO

app.get("/", (req, res) => {
    res.render("inicio");
});


// Ruta iniciar partida de juego

app.post("/jugar", (req, res) => {
    const nombre = req.body.nombre.trim();
    if (nombre === "") {
        return res.send("Debe ingresar un nombre.");
    }

    partida = new Partida(nombre);
    res.render("jugar", {
        nombre: partida.nombre,
        intentos: partida.intentos,
        restantes: 5 - partida.intentos,
        mensaje: partida.mensaje
    });

});

// MOSTRAR JUEGO

app.get("/jugar", (req, res) => {
    if (!partida) {
        return res.redirect("/");
    }

    res.render("jugar", {
        nombre: partida.nombre,
        intentos: partida.intentos,
        restantes: 5 - partida.intentos,
        mensaje: partida.mensaje
    });

});

// PROCESAR INTENTO

app.post("/intento", (req, res) => {
    if (!partida) {
        return res.redirect("/");
    }

    const numero = Number(req.body.numero);
    if (isNaN(numero) || numero < 1 || numero > 10) {
        partida.mensaje = "Debe ingresar un número entre 1 y 10.";
        return res.render("jugar", {
            nombre: partida.nombre,
            intentos: partida.intentos,
            restantes: 5 - partida.intentos,
            mensaje: partida.mensaje
        });
    }

    partida.intentos++;

    if (numero === partida.numeroSecreto) {
        partida.finalizado = true;
        if (partida.intentos === 1) {
            partida.puntaje = 3;
        }

        else {
            partida.puntaje = 1;
        }

        partida.mensaje = "¡Felicitaciones! Adivinaste el número.";

    }

    else if (numero < partida.numeroSecreto) {
        partida.mensaje = "El número secreto es mayor.";
    }

    else {
        partida.mensaje = "El número secreto es menor.";
    }

    if (partida.intentos >= 5 && !partida.finalizado) {
        partida.finalizado = true;
        partida.puntaje = 0;
        partida.mensaje = "Has perdido.";
    }

    if (partida.finalizado) {
        if (!partida.guardado) {
            const historial = leerDatos();
            historial.push({
                nombre: partida.nombre,
                puntaje: partida.puntaje,
                fecha: obtenerFecha()
            });

            guardarDatos(historial);
            partida.guardado = true;

        }

        return res.render("resultado", {
            nombre: partida.nombre,
            numeroSecreto: partida.numeroSecreto,
            puntaje: partida.puntaje,
            mensaje: partida.mensaje,
            gano: partida.puntaje > 0
        });

    }

    res.render("jugar", {
        nombre: partida.nombre,
        intentos: partida.intentos,
        restantes: 5 - partida.intentos,
        mensaje: partida.mensaje
    });

});


// Ruta historial

app.get("/historial", (req, res) => {

    const historial = leerDatos();
    const totalPartidas = historial.length;
    const ganadas = historial.filter(partida => partida.puntaje > 0).length;
    const perdidas = historial.filter(partida => partida.puntaje === 0).length;
    const puntajeTotal = historial.reduce((total, partida) => {
        return total + partida.puntaje;
    }, 0);

    res.render("historial", {
        historial,
        totalPartidas,
        ganadas,
        perdidas,
        puntajeTotal
    });

});

// Desafío Extensión
// Ruta historial personal

app.get("/historial-personal", (req, res) => {

    res.render("historialPersonal", {
        historial: [],
        nombre: "",
        totalPartidas: 0,
        puntajeTotal: 0,
        promedio: 0
    });

});

app.post("/historial-personal", (req, res) => {

    const nombre = req.body.nombre;
    const historial = leerDatos();
    const partidasJugador = historial.filter(partida =>
        partida.nombre.toLowerCase() === nombre.toLowerCase()
    );

    const totalPartidas = partidasJugador.length;

    const puntajeTotal = partidasJugador.reduce((total, partida) =>
        total + partida.puntaje, 0
    );

    const promedio =
        totalPartidas > 0
            ? (puntajeTotal / totalPartidas).toFixed(2)
            : 0;

    res.render("historialPersonal", { historial: partidasJugador,
        nombre, totalPartidas, puntajeTotal, promedio
    });

});

// Ruta ranking, mostrarse ordenados desde el mayor al menor puntaje acumulado
// console.log("Ruta ranking cargada");

// app.get("/ranking", (req, res) => {
    //console.log("Entró a la ruta ranking");
    //res.send("Ranking funcionando");
//});

app.get("/ranking", (req, res) => {

    const historial = leerDatos();
    const ranking = {};

    historial.forEach(partida => {
        if(!ranking[partida.nombre]){ ranking[partida.nombre] = 0; }
        ranking[partida.nombre] += partida.puntaje;
    });

    const jugadores = Object.entries(ranking)

    .map(([nombre,puntaje]) => ({ nombre, puntaje }))
    .sort((a,b)=>b.puntaje-a.puntaje);

    res.render("ranking",{ jugadores });

});

// Ruta eliminar

app.post("/eliminar-jugador",(req,res)=>{

    const nombre=req.body.nombre;
    let historial=leerDatos();
    historial=historial.filter(partida=> partida.nombre.toLowerCase()!=nombre.toLowerCase() );

    guardarDatos(historial);

    res.redirect("/historial-personal");

});

// reiniciar post y get

app.post("/reiniciar",(req,res)=>{

    guardarDatos([]);
    res.render("configuracion",{ mensaje:"El historial fue eliminado correctamente." });

});

app.get("/configuracion", (req, res) => {
    res.render("configuracion", { mensaje: "" });
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});