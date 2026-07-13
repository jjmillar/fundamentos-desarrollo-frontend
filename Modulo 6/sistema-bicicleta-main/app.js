const express = require("express");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const empresa = "Bicis";
const total_bicis = 20;

let disponibles = 20;
let arrendadas = 0;

let arriendos = [];

function formatearFecha() {
  return new Date().toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function registrarDevolucion(nombre, cantidad) {
  let restante = cantidad;

  for (let i = 0; i < arriendos.length && restante > 0; i++) {
    if (arriendos[i].cliente.toLowerCase() === nombre.toLowerCase()) {
      if (arriendos[i].cantidad <= restante) {
        restante -= arriendos[i].cantidad;
        arriendos[i].cantidad = 0;
      } else {
        arriendos[i].cantidad -= restante;
        restante = 0;
      }
    }
  }

  arriendos = arriendos.filter((a) => a.cantidad > 0);
}

app.get("/", (req, res) => {
  let mensaje = "";

  if (disponibles > 10) {
    mensaje = "Disponibilidad alta.";
  } else if (disponibles >= 5) {
    mensaje = "Disponibilidad limitada.";
  } else {
    mensaje = "Pocas bicicletas disponibles.";
  }

  res.render("inicio", {
    empresa,
    disponibles,
    arrendadas,
    mensaje,
    arriendos,
  });
});

app.get("/arrendar", (req, res) => {
  res.render("arrendar", {
    empresa,
    mensaje: "",
  });
});

app.post("/arrendar", (req, res) => {
  const nombre = req.body.nombre;
  const cantidad = Number(req.body.cantidad);

  let mensaje = "";

  if (cantidad <= 0) {
    mensaje = "La cantidad debe ser mayor que cero.";
  } else if (cantidad > disponibles) {
    mensaje = "No existen suficientes bicicletas disponibles.";
  } else {
    disponibles -= cantidad;
    arrendadas += cantidad;

    arriendos.push({
      cliente: nombre,
      cantidad,
      fecha: formatearFecha(),
    });

    mensaje = `${nombre} arrendó ${cantidad} bicicleta(s).`;
  }

  res.render("arrendar", {
    empresa,
    mensaje,
  });
});

app.get("/devolver", (req, res) => {
  res.render("devolver", {
    empresa,
    mensaje: "",
  });
});

app.post("/devolver", (req, res) => {
  const nombre = req.body.nombre;
  const cantidad = Number(req.body.cantidad);

  let mensaje = "";

  if (cantidad <= 0) {
    mensaje = "La cantidad debe ser mayor que cero.";
  } else if (disponibles + cantidad > total_bicis) {
    mensaje = "No se puede superar el total de bicicletas.";
  } else {
    disponibles += cantidad;
    arrendadas -= cantidad;

    registrarDevolucion(nombre, cantidad);

    mensaje = `${nombre} devolvió ${cantidad} bicicleta(s).`;
  }

  res.render("devolver", {
    empresa,
    mensaje,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});