const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}));

const rutaVotos = path.join(
    __dirname,
    "data",
    "votos.json"
);

const rutaCandidatos = path.join(
    __dirname,
    "data",
    "candidatos.json"
);

function leerArchivo(ruta) {
    const contenido = fs.readFileSync(
        ruta,
        "utf-8"
    );

    return JSON.parse(contenido);
}

function guardarVotos(votos) {
    fs.writeFileSync(
        rutaVotos,
        JSON.stringify(votos, null, 4)
    );
}

function normalizarTexto(texto) {
    return texto.trim().toLowerCase();
}

function obtenerResultados() {
    const candidatos = leerArchivo(rutaCandidatos);
    const votos = leerArchivo(rutaVotos);

    const resultados = candidatos.map(candidato => {
        const cantidadVotos = votos.filter(
            voto => voto.candidatoId === candidato.id
        ).length;

        const porcentaje =
            votos.length > 0
                ? (cantidadVotos / votos.length) * 100
                : 0;

        return {
            id: candidato.id,
            nombre: candidato.nombre,
            votos: cantidadVotos,
            porcentaje
        };
    });

    resultados.sort((a, b) => b.votos - a.votos);

    return {
        candidatos,
        votos,
        resultados
    };
}

// Página principal
app.get("/", (req, res) => {
    const candidatos = leerArchivo(rutaCandidatos);

    res.render("inicio", {
        titulo: "Sistema de votación",
        candidatos,
        mensaje: "",
        tipoMensaje: ""
    });
});

// Registrar voto
app.post("/votar", (req, res) => {
    const candidatos = leerArchivo(rutaCandidatos);
    const votos = leerArchivo(rutaVotos);

    const nombre = req.body.nombre
        ? req.body.nombre.trim()
        : "";

    const candidatoId = Number(
        req.body.candidatoId
    );

    let mensaje;
    let tipoMensaje;

    if (nombre === "") {
        mensaje = "Debe ingresar su nombre.";
        tipoMensaje = "danger";

        return res.render("inicio", {
            titulo: "Sistema de votación",
            candidatos,
            mensaje,
            tipoMensaje
        });
    }

    const candidatoSeleccionado = candidatos.find(
        candidato => candidato.id === candidatoId
    );

    if (!candidatoSeleccionado) {
        mensaje = "Debe seleccionar un candidato válido.";
        tipoMensaje = "danger";

        return res.render("inicio", {
            titulo: "Sistema de votación",
            candidatos,
            mensaje,
            tipoMensaje
        });
    }

    const votoExistente = votos.find(
        voto =>
            normalizarTexto(voto.nombre) ===
            normalizarTexto(nombre)
    );

    if (votoExistente) {
        mensaje = "Esta persona ya registró su voto.";
        tipoMensaje = "warning";

        return res.render("inicio", {
            titulo: "Sistema de votación",
            candidatos,
            mensaje,
            tipoMensaje
        });
    }

    const nuevoVoto = {
        nombre,
        candidatoId,
        fecha: new Date().toLocaleString("es-CL")
    };

    votos.push(nuevoVoto);

    guardarVotos(votos);

    mensaje = "El voto fue registrado correctamente.";
    tipoMensaje = "success";

    res.render("inicio", {
        titulo: "Sistema de votación",
        candidatos,
        mensaje,
        tipoMensaje
    });
});

// Historial completo
app.get("/historial", (req, res) => {
    const votos = leerArchivo(rutaVotos);
    const candidatos = leerArchivo(rutaCandidatos);

    const historial = votos.map(voto => {
        const candidato = candidatos.find(
            item => item.id === voto.candidatoId
        );

        return {
            nombre: voto.nombre,
            candidato: candidato
                ? candidato.nombre
                : "Candidato no disponible",
            fecha: voto.fecha
        };
    });

    res.render("historial", {
        titulo: "Historial",
        historial
    });
});

// Resultados
app.get("/resultados", (req, res) => {
    const {
        votos,
        resultados
    } = obtenerResultados();

    let lider = null;
    let empate = false;

    if (resultados.length > 0 && votos.length > 0) {
        lider = resultados[0];

        empate = resultados.filter(
            resultado =>
                resultado.votos === lider.votos
        ).length > 1;
    }

    res.render("resultados", {
        titulo: "Resultados",
        resultados,
        totalVotos: votos.length,
        lider,
        empate
    });
});

// Formulario de búsqueda
app.get("/buscar", (req, res) => {
    res.render("buscar", {
        titulo: "Buscar votante",
        busquedaRealizada: false,
        encontrado: false,
        nombreBuscado: "",
        fecha: "",
        mensaje: ""
    });
});

// Buscar votante
app.post("/buscar", (req, res) => {
    const votos = leerArchivo(rutaVotos);

    const nombreBuscado = req.body.nombre
        ? req.body.nombre.trim()
        : "";

    if (nombreBuscado === "") {
        return res.render("buscar", {
            titulo: "Buscar votante",
            busquedaRealizada: false,
            encontrado: false,
            nombreBuscado: "",
            fecha: "",
            mensaje: "Debe ingresar un nombre."
        });
    }

    const voto = votos.find(
        registro =>
            normalizarTexto(registro.nombre) ===
            normalizarTexto(nombreBuscado)
    );

    res.render("buscar", {
        titulo: "Buscar votante",
        busquedaRealizada: true,
        encontrado: Boolean(voto),
        nombreBuscado,
        fecha: voto ? voto.fecha : "",
        mensaje: ""
    });
});

// Dashboard
app.get("/dashboard", (req, res) => {
    const {
        candidatos,
        votos,
        resultados
    } = obtenerResultados();

    const candidatosConVotos = resultados.filter(
        candidato => candidato.votos > 0
    ).length;

    let lider = null;
    let empate = false;

    if (resultados.length > 0 && votos.length > 0) {
        lider = resultados[0];

        empate = resultados.filter(
            resultado =>
                resultado.votos === lider.votos
        ).length > 1;
    }

    res.render("dashboard", {
        titulo: "Dashboard",
        totalVotos: votos.length,
        totalCandidatos: candidatos.length,
        candidatosConVotos,
        lider,
        empate,
        resultados
    });
});

// Configuración
app.get("/configuracion", (req, res) => {
    res.render("configuracion", {
        titulo: "Configuración",
        mensaje: ""
    });
});

// Reiniciar votación
app.post("/reiniciar", (req, res) => {
    guardarVotos([]);

    res.render("configuracion", {
        titulo: "Configuración",
        mensaje: "La votación fue reiniciada correctamente."
    });
});

app.listen(PORT, () => {
    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );
});