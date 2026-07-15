const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// vistas
app.set("view engine", "ejs");

// Permitir recibir datos desde formularios
app.use(express.urlencoded({ extended: true }));

// Archivos públicos (CSS, imágenes, etc.)
app.use(express.static("public"));

//Ruta archivo json
const rutaDatos = path.join(__dirname, "data", "estanque.json");


// Lectura de datos

function leerDatos() {
    const contenido = fs.readFileSync(rutaDatos, "utf-8"); return JSON.parse(contenido);

}

// Guardado de datos "data"

function guardarDatos(datos) {

    fs.writeFileSync( rutaDatos, JSON.stringify(datos, null, 4)
    );

}

// Rutas

app.get("/", (req, res) => {

    const datos = leerDatos();

    let nivel = "";

    if (datos.aguaDisponible > 3000) { nivel = "Nivel óptimo"; 

    } else if (datos.aguaDisponible >= 1500) { nivel = "Nivel medio"; 

    }  else { nivel = "Nivel crítico"; }

    res.render("inicio", { titulo: "Sistema de Control de Agua",
        capacidadMaxima: datos.capacidadMaxima, aguaDisponible: datos.aguaDisponible, totalIngresado: datos.totalIngresado, totalConsumido: datos.totalConsumido, nivel
    });

});


//Formulario

app.get("/ingresar", (req, res) => {
    const datos = leerDatos();

    res.render("ingresar", {
        titulo: "Ingresar Agua",
        aguaDisponible: datos.aguaDisponible,
        mensaje: "",
        tipoMensaje: ""

    });

});


app.post("/ingresar", (req, res) => {
    const datos = leerDatos();
    const nombre = req.body.nombre;
    const cantidad = Number(req.body.cantidad);
    let mensaje = "";
    let tipoMensaje = "";

    if ( nombre.trim() === "" || isNaN(cantidad) || cantidad <= 0 ) { mensaje = "Debe ingresar datos válidos.";  tipoMensaje = "danger"; }

    else if ( datos.aguaDisponible + cantidad > datos.capacidadMaxima ) 
        { mensaje = "No es posible superar la capacidad máxima del estanque.";  tipoMensaje = "danger"; 

        } else { datos.aguaDisponible += cantidad; datos.totalIngresado += cantidad; guardarDatos(datos); mensaje = `${nombre} ingresó ${cantidad} litro(s) correctamente.`; tipoMensaje = "success";

    }

    res.render("ingresar", { titulo: "Ingresar Agua", aguaDisponible: datos.aguaDisponible, mensaje, tipoMensaje });

});


app.get("/consumir", (req, res) => {

    const datos = leerDatos();

    res.render("consumir", { titulo: "Consumir Agua", aguaDisponible: datos.aguaDisponible,  mensaje: "", tipoMensaje: "" });

});


app.post("/consumir", (req, res) => {

    const datos = leerDatos();
    const nombre = req.body.nombre;
    const cantidad = Number(req.body.cantidad);
    let mensaje = "";
    let tipoMensaje = "";

    if ( nombre.trim() === "" || isNaN(cantidad) || cantidad <= 0 ) 
        { mensaje = "Debe ingresar datos válidos."; tipoMensaje = "danger";

    } else if ( cantidad > datos.aguaDisponible ) 
        { mensaje = "No existe suficiente agua disponible."; tipoMensaje = "danger"; 

        } else { datos.aguaDisponible -= cantidad; datos.totalConsumido += cantidad; guardarDatos(datos); mensaje = `${nombre} consumió ${cantidad} litro(s) correctamente.`; tipoMensaje = "success";

    }

    res.render("consumir", {

        titulo: "Consumir Agua", aguaDisponible: datos.aguaDisponible, mensaje, tipoMensaje 
    });

});


app.listen(PORT, () => {

    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);

});