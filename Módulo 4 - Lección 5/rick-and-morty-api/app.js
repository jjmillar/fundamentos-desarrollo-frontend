const ENDPOINT = "https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10";

let personajesCache = null;

const estadoListado = document.getElementById("estadoListado");
const listadoPersonajes = document.getElementById("listadoPersonajes");
const agrupadoPorEspecie = document.getElementById("agrupadoPorEspecie");
const personajeSelect = document.getElementById("personajeSelect");
const fichaDetalle = document.getElementById("fichaDetalle");

const btnListar = document.getElementById("btnListar");
const btnAgrupar = document.getElementById("btnAgrupar");
const btnFicha = document.getElementById("btnFicha");

function mostrarPersonajes(lista) {
    listadoPersonajes.innerHTML = "";

    lista.forEach((p) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
            <div class="name">${p.name}</div>
            <div class="meta">ID: ${p.id}</div>
            <div class="meta">Especie: ${p.species}</div>
        `;
        listadoPersonajes.appendChild(card);
    });
}

function cargarPersonajes() {
        btnListar.disabled = true;
        estadoListado.textContent = "Cargando...";

    fetch(ENDPOINT)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la petición: " + response.status);
            }
            return response.json();
        })
        .then((data) => {
                personajesCache = data;
            estadoListado.textContent = "Se cargaron los primeros 10 personajes.";
            mostrarPersonajes(data);

            // poblar select para ficha individual
            personajeSelect.innerHTML = '<option value="">-- seleccionar --</option>';
            data.forEach((p) => {
                const opt = document.createElement("option");
                opt.value = String(p.id);
                opt.textContent = `${p.id} - ${p.name}`;
                personajeSelect.appendChild(opt);
            });

            btnAgrupar.disabled = false;
            btnFicha.disabled = false;
            btnListar.disabled = false;
        })
        .catch((error) => {
            estadoListado.textContent = "Error: " + error.message;
            btnListar.disabled = false;
        });
}

btnListar.addEventListener("click", () => {
    if (personajesCache) {
        mostrarPersonajes(personajesCache);
        estadoListado.textContent = "Mostrando datos en memoria (sin nueva llamada a la API).";
    } else {
        cargarPersonajes();
    }
});

btnAgrupar.addEventListener("click", () => {
    if (!personajesCache) {
        agrupadoPorEspecie.textContent = "Primero debés cargar los personajes.";
        return;
    }

    const grupos = personajesCache.reduce((acum, p) => {
        const especie = p.species || "Unknown";
        if (!acum[especie]) acum[especie] = [];
        acum[especie].push(p);
        return acum;
    }, {});

    const especies = Object.keys(grupos).sort();
    const lineas = especies.map((especie) => {
        const nombres = grupos[especie]
            .sort((a, b) => a.id - b.id)
            .map((p) => `- ${p.name} (ID: ${p.id})`)
            .join("\n");
        return `${especie}\n${nombres}`;
    });

    agrupadoPorEspecie.textContent = lineas.join("\n\n");
});

btnFicha.addEventListener("click", () => {
    if (!personajesCache) {
        fichaDetalle.innerHTML = "<p>Primero debés cargar los personajes.</p>";
        return;
    }

    const id = personajeSelect.value;
    if (!id) {
        fichaDetalle.innerHTML = "<p>Seleccioná un personaje del listado.</p>";
        return;
    }

    const p = personajesCache.find((c) => String(c.id) === String(id));
    if (!p) {
        fichaDetalle.innerHTML = "<p>No se encontró el personaje.</p>";
        return;
    }

    fichaDetalle.innerHTML = `
        <div>
            <img src="${p.image}" alt="${p.name}" />
            <div>
                <div><strong>ID:</strong> ${p.id}</div>
                <div><strong>Nombre:</strong> ${p.name}</div>
                <div><strong>Especie:</strong> ${p.species}</div>
            </div>
        </div>
    `;
});
