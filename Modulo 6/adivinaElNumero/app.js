const express = require("express");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//==============================
// Variables del juego
//==============================

let nombreJugador = "";
let numeroSecreto = 0;
let intentos = 0;
let juegoTerminado = false;
let partidaGuardada = false;

//==============================
// Archivo JSON
//==============================

const archivo = "./data/partidas.json";

// Si el archivo no existe, lo crea
if (!fs.existsSync(archivo)) {
    fs.writeFileSync(archivo, "[]");
}

// Leer partidas
function leerPartidas() {
    const datos = fs.readFileSync(archivo, "utf8");
    return JSON.parse(datos);
}

// Guardar una partida
function guardarPartida(nombre, puntaje) {

    const partidas = leerPartidas();

    const nuevaPartida = {
        nombre: nombre,
        puntaje: puntaje,
        fecha: new Date().toLocaleDateString("es-CL")
    };

    partidas.push(nuevaPartida);

    fs.writeFileSync(
        archivo,
        JSON.stringify(partidas, null, 2)
    );
}

//==============================
// Página principal
//==============================

app.get("/", (req, res) => {

    res.render("index", {
        error: ""
    });

});

//==============================
// Comenzar partida
//==============================

app.post("/", (req, res) => {

    nombreJugador = req.body.nombre.trim();

    if (nombreJugador === "") {

        return res.render("index", {
            error: "Debe ingresar un nombre."
        });

    }

    numeroSecreto = Math.floor(Math.random() * 10) + 1;

    intentos = 0;
    juegoTerminado = false;
    partidaGuardada = false;

    res.redirect("/jugar");

});
//==============================
// Mostrar juego
//==============================

app.get("/jugar", (req, res) => {

    if (nombreJugador === "") {
        return res.redirect("/");
    }

    res.render("jugar", {

        nombre: nombreJugador,
        intentos: intentos,
        restantes: 5 - intentos,
        mensaje: "",
        terminado: juegoTerminado,
        numero: numeroSecreto,
        puntaje: 0,
        gano: false

    });

});

//==============================
// Procesar intento
//==============================

app.post("/jugar", (req, res) => {

    if (juegoTerminado) {
        return res.redirect("/jugar");
    }

    let numero = Number(req.body.numero);

    if (numero < 1 || numero > 10 || isNaN(numero)) {

        return res.render("jugar", {

            nombre: nombreJugador,
            intentos: intentos,
            restantes: 5 - intentos,
            mensaje: "Debe ingresar un número entre 1 y 10.",
            terminado: false,
            numero: numeroSecreto,
            puntaje: 0,
            gano: false

        });

    }

    intentos++;

    let mensaje = "";
    let puntaje = 0;
    let gano = false;

    if (numero === numeroSecreto) {

        juegoTerminado = true;
        gano = true;

        if (intentos === 1) {
            puntaje = 3;
        } else {
            puntaje = 1;
        }

        mensaje = "¡Felicitaciones! Adivinaste el número.";

    } else {

        if (numero < numeroSecreto) {
            mensaje = "El número secreto es mayor.";
        } else {
            mensaje = "El número secreto es menor.";
        }

        if (intentos === 5) {

            juegoTerminado = true;
            mensaje = "Se acabaron los intentos.";

        }

    }

    // Guardar una sola vez
    if (juegoTerminado && !partidaGuardada) {

        guardarPartida(nombreJugador, puntaje);

        partidaGuardada = true;

    }

    res.render("jugar", {

        nombre: nombreJugador,
        intentos: intentos,
        restantes: 5 - intentos,
        mensaje: mensaje,
        terminado: juegoTerminado,
        numero: numeroSecreto,
        puntaje: puntaje,
        gano: gano

    });

});
//==============================
// Historial
//==============================

app.get("/historial", (req, res) => {

    const partidas = leerPartidas();

    const totalPartidas = partidas.length;

    const partidasGanadas = partidas.filter(partida => partida.puntaje > 0).length;

    const partidasPerdidas = totalPartidas - partidasGanadas;

    const puntajeTotal = partidas.reduce((total, partida) => {
        return total + partida.puntaje;
    }, 0);

    res.render("historial", {
        partidas,
        totalPartidas,
        partidasGanadas,
        partidasPerdidas,
        puntajeTotal
    });

});
app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});