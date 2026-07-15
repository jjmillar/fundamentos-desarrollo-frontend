const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PUERTO = process.env.PORT || 3000;
const RUTA_JSON = path.join(__dirname, "data", "partidas.json");
const MAX_INTENTOS = 5;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function leerPartidas() {
  try {
    const contenido = fs.readFileSync(RUTA_JSON, "utf-8");
    return JSON.parse(contenido);
  } catch (error) {
    return [];
  }
}

function guardarPartida(partida) {
  const partidas = leerPartidas();
  partidas.push(partida);
  fs.writeFileSync(RUTA_JSON, JSON.stringify(partidas));
}

function formatearFecha() {
  return new Date().toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

app.get("/", function (req, res) {
  res.render("index", { error: null });
});

app.post("/iniciar", function (req, res) {
  const nombre = (req.body.nombre || "").trim();

  if (nombre === "") {
    res.render("index", { error: "Debes ingresar tu nombre para comenzar." });
    return;
  }

  const juego = {
    nombre: nombre,
    numeroSecreto: Math.floor(Math.random() * 10) + 1,
    intentosUsados: 0,
    mensaje: null,
    terminado: false,
    gano: false,
    puntaje: 0,
    registrado: false,
  };

  res.render("jugar", {
    juego: juego,
    intentosRestantes: MAX_INTENTOS - juego.intentosUsados,
    maxIntentos: MAX_INTENTOS,
    error: null,
  });
});

app.post("/jugar", function (req, res) {
  const juego = JSON.parse(req.body.estado);

  if (juego.terminado) {
    res.render("jugar", {
      juego: juego,
      intentosRestantes: MAX_INTENTOS - juego.intentosUsados,
      maxIntentos: MAX_INTENTOS,
      error: null,
    });
    return;
  }

  const numero = parseInt(req.body.numero, 10);

  if (isNaN(numero) || numero < 1 || numero > 10) {
    res.render("jugar", {
      juego: juego,
      intentosRestantes: MAX_INTENTOS - juego.intentosUsados,
      maxIntentos: MAX_INTENTOS,
      error: "Ingresa un número válido entre 1 y 10.",
    });
    return;
  }

  juego.intentosUsados = juego.intentosUsados + 1;

  if (numero === juego.numeroSecreto) {
    juego.terminado = true;
    juego.gano = true;
    if (juego.intentosUsados === 1) {
      juego.puntaje = 3;
    } else {
      juego.puntaje = 1;
    }
    juego.mensaje = "¡Felicidades, adivinaste el número!";
  } else {
    if (numero < juego.numeroSecreto) {
      juego.mensaje = "El número secreto es MAYOR que tu intento.";
    } else {
      juego.mensaje = "El número secreto es MENOR que tu intento.";
    }

    if (juego.intentosUsados >= MAX_INTENTOS) {
      juego.terminado = true;
      juego.gano = false;
      juego.puntaje = 0;
    }
  }

  if (juego.terminado && !juego.registrado) {
    guardarPartida({
      nombre: juego.nombre,
      puntaje: juego.puntaje,
      fecha: formatearFecha(),
    });
    juego.registrado = true;
  }

  res.render("jugar", {
    juego: juego,
    intentosRestantes: MAX_INTENTOS - juego.intentosUsados,
    maxIntentos: MAX_INTENTOS,
    error: null,
  });
});

app.get("/nueva-partida", function (req, res) {
  res.redirect("/");
});

app.get("/historial", function (req, res) {
  const partidas = leerPartidas();

  let partidasGanadas = 0;
  let puntajeTotal = 0;

  for (let i = 0; i < partidas.length; i++) {
    if (partidas[i].puntaje > 0) {
      partidasGanadas = partidasGanadas + 1;
    }
    puntajeTotal = puntajeTotal + partidas[i].puntaje;
  }

  res.render("historial", {
    partidas: partidas,
    totalPartidas: partidas.length,
    partidasGanadas: partidasGanadas,
    partidasPerdidas: partidas.length - partidasGanadas,
    puntajeTotal: puntajeTotal,
  });
});

app.listen(PUERTO, function () {
  console.log("Servidor corriendo en http://localhost:" + PUERTO);
});
