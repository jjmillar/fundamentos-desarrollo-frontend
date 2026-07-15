class UsuariosService {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.usuarios = [];
        this.cargada = false;
        this._cargar();
    }

    _cargar() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", this.endpoint, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 200) {
                    try {
                        this.usuarios = JSON.parse(xhr.responseText);
                        this.cargada = true;
                        resolve(this.usuarios);
                    } catch (e) {
                        reject(new Error("Error parseando JSON: " + e.message));
                    }
                } else {
                    reject(new Error("Error en la petición: " + xhr.status));
                }
            };
            xhr.onerror = () => reject(new Error("Error de red en XMLHttpRequest"));
            xhr.send();
        });
    }

    esperarCarga() {
        return this.cargada;
    }

    _buscarPorNombre(nombre) {
        const n = String(nombre || "").trim().toLowerCase();
        if (!n) return null;
        return this.usuarios.find((u) => String(u.name).toLowerCase() === n) || null;
    }

    listarNombres() {
        if (!this.cargada) return [];
        return this.usuarios.map((u) => u.name);
    }

    infoBasicaPorNombre(nombre) {
        const u = this._buscarPorNombre(nombre);
        if (!u) return null;
        return { username: u.username, email: u.email };
    }

    direccionPorNombre(nombre) {
        const u = this._buscarPorNombre(nombre);
        if (!u) return null;
        const a = u.address || {};
        return {
            street: a.street || "",
            suite: a.suite || "",
            city: a.city || "",
            zipcode: a.zipcode || "",
            geo: a.geo ? { lat: a.geo.lat, lng: a.geo.lng } : null,
        };
    }

    infoAvanzadaPorNombre(nombre) {
        const u = this._buscarPorNombre(nombre);
        if (!u) return null;
        return {
            phone: u.phone || "",
            website: u.website || "",
            company: u.company || null,
        };
    }

    listarCompanias() {
        if (!this.cargada) return [];
        return this.usuarios
            .filter((u) => u.company && u.company.name)
            .map((u) => ({
                company: u.company.name,
                catchphrase: u.company.catchPhrase || "",
            }));
    }

    listarNombresOrdenados() {
        if (!this.cargada) return [];
        return this.usuarios
            .map((u) => u.name)
            .slice()
            .sort((a, b) => a.localeCompare(b));
    }
}

const ENDPOINT = "https://jsonplaceholder.typicode.com/users";
const servicio = new UsuariosService(ENDPOINT);

const salida = document.getElementById("salida");

function mostrar(texto) {
    console.log(texto);
    salida.textContent = texto;
}

function pedirNombre(mensaje) {
    return prompt(mensaje);
}

document.getElementById("btnNombres").addEventListener("click", () => {
    if (!servicio.esperarCarga()) {
        mostrar("Cargando datos... intentá de nuevo en un instante.");
        return;
    }
    const nombres = servicio.listarNombres();
    mostrar("Usuarios:\n" + nombres.join("\n"));
});

document.getElementById("btnInfoBasica").addEventListener("click", () => {
    if (!servicio.esperarCarga()) {
        mostrar("Cargando datos... intentá de nuevo en un instante.");
        return;
    }
    const nombre = pedirNombre("Ingresá el nombre del usuario:");
    if (nombre === null) return;
    const info = servicio.infoBasicaPorNombre(nombre);
    if (!info) {
        mostrar("Usuario no encontrado.");
        return;
    }
    const texto = `Username: ${info.username}\nCorreo: ${info.email}`;
    console.log(texto);
    mostrar(texto);
});

document.getElementById("btnDireccion").addEventListener("click", () => {
    if (!servicio.esperarCarga()) {
        mostrar("Cargando datos... intentá de nuevo en un instante.");
        return;
    }
    const nombre = pedirNombre("Ingresá el nombre del usuario:");
    if (nombre === null) return;
    const dir = servicio.direccionPorNombre(nombre);
    if (!dir) {
        mostrar("Usuario no encontrado.");
        return;
    }
    const geoTexto = dir.geo ? `Lat: ${dir.geo.lat}, Lng: ${dir.geo.lng}` : "Geo: -";
    const texto = `Street: ${dir.street}\nSuite: ${dir.suite}\nCity: ${dir.city}\nZipcode: ${dir.zipcode}\n${geoTexto}`;
    console.log(texto);
    mostrar(texto);
});

document.getElementById("btnInfoAvanzada").addEventListener("click", () => {
    if (!servicio.esperarCarga()) {
        mostrar("Cargando datos... intentá de nuevo en un instante.");
        return;
    }
    const nombre = pedirNombre("Ingresá el nombre del usuario:");
    if (nombre === null) return;
    const info = servicio.infoAvanzadaPorNombre(nombre);
    if (!info) {
        mostrar("Usuario no encontrado.");
        return;
    }
    const companiaTexto = info.company
        ? `Nombre: ${info.company.name}\nCatchPhrase: ${info.company.catchPhrase || "-"}\nBS: ${info.company.bs || "-"}`
        : "Compañía: -";

    const texto = `Phone: ${info.phone}\nWebsite: ${info.website}\nCompañía:\n${companiaTexto}`;
    console.log(texto);
    mostrar(texto);
});

document.getElementById("btnCompanias").addEventListener("click", () => {
    if (!servicio.esperarCarga()) {
        mostrar("Cargando datos... intentá de nuevo en un instante.");
        return;
    }
    const lista = servicio.listarCompanias();
    const texto = lista
        .map((c) => `${c.company}\n - Catchphrase: ${c.catchphrase}`)
        .join("\n");
    console.log(texto);
    mostrar(texto || "Sin compañías.");
});

document.getElementById("btnNombresOrden").addEventListener("click", () => {
    if (!servicio.esperarCarga()) {
        mostrar("Cargando datos... intentá de nuevo en un instante.");
        return;
    }
    const nombres = servicio.listarNombresOrdenados();
    mostrar("Usuarios ordenados:\n" + nombres.join("\n"));
});
