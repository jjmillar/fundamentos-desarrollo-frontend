const API_BASE = 'http://localhost:3000';

const salidaConductores = document.getElementById('salidaConductores');
const salidaAutomoviles = document.getElementById('salidaAutomoviles');
const salidaAuto = document.getElementById('salidaAuto');
const salidaSolos = document.getElementById('salidaSolos');

async function get(path) {
    const resp = await fetch(`${API_BASE}${path}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
    return resp.json();
}

function renderTable(title, columns, rows) {
    if (!rows || rows.length === 0) return `<div class="card">${title}: sin datos</div>`;
    const headers = columns.map((c) => `<th>${c}</th>`).join('');
    const body = rows
        .map((row) => `<tr>${columns.map((c) => `<td>${row[c] ?? '-'}</td>`).join('')}</tr>`)
        .join('');
    return `<div class="card"><strong>${title}</strong><br/><br/><table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table></div>`;
}

document.getElementById('btnConductores').addEventListener('click', async () => {
    try {
        const data = await get('/conductores');
        salidaConductores.innerHTML = renderTable('Conductores', ['id_conductor', 'nombre', 'edad'], data);
    } catch (e) {
        salidaConductores.innerHTML = `<div class="card">Error: ${e.message}</div>`;
    }
});

document.getElementById('btnAutomoviles').addEventListener('click', async () => {
    try {
        const data = await get('/automoviles');
        salidaAutomoviles.innerHTML = renderTable('Automóviles', ['id_auto', 'patente', 'marca', 'modelo', 'id_conductor'], data);
    } catch (e) {
        salidaAutomoviles.innerHTML = `<div class="card">Error: ${e.message}</div>`;
    }
});

document.getElementById('btnPatente').addEventListener('click', async () => {
    const patente = document.getElementById('patenteInput').value.trim();
    if (!patente) {
        salidaAuto.innerHTML = '<div class="card">Ingresá una patente.</div>';
        return;
    }
    try {
        const data = await get(`/auto?patente=${encodeURIComponent(patente)}`);
        const rows = Array.isArray(data) ? data : [data];
        salidaAuto.innerHTML = renderTable('Automóvil por patente', ['id_auto', 'patente', 'marca', 'modelo', 'id_conductor', 'nombre', 'edad'], rows);
    } catch (e) {
        salidaAuto.innerHTML = `<div class="card">Error: ${e.message}</div>`;
    }
});

document.getElementById('btnInicioPatente').addEventListener('click', async () => {
    const letra = document.getElementById('inicioPatenteInput').value.trim().slice(0, 1);
    if (!letra) {
        salidaAuto.innerHTML = '<div class="card">Ingresá una letra inicial.</div>';
        return;
    }
    try {
        const data = await get(`/auto?iniciopatente=${encodeURIComponent(letra)}`);
        salidaAuto.innerHTML = renderTable('Automóviles por prefijo', ['id_auto', 'patente', 'marca', 'modelo', 'id_conductor', 'nombre', 'edad'], data);
    } catch (e) {
        salidaAuto.innerHTML = `<div class="card">Error: ${e.message}</div>`;
    }
});

document.getElementById('btnSolos').addEventListener('click', async () => {
    try {
        const data = await get('/solitos');
        const html = [
            renderTable('Conductores sin auto', ['tipo', 'id', 'nombre', 'edad', 'patente'], data.conductoresSinAuto || []),
            renderTable('Automóviles sin conductor', ['tipo', 'id', 'nombre', 'edad', 'patente', 'marca', 'modelo'], data.automovilesSinConductor || [])
        ].join('');
        salidaSolos.innerHTML = html || '<div class="card">Sin datos</div>';
    } catch (e) {
        salidaSolos.innerHTML = `<div class="card">Error: ${e.message}</div>`;
    }
});

document.getElementById('btnSinAuto').addEventListener('click', async () => {
    const edadRaw = prompt('Ingresá la edad límite (solo conductores menores a esta edad):');
    if (edadRaw === null) return;
    const edad = parseInt(edadRaw, 10);
    if (Number.isNaN(edad) || edad < 18 || edad > 85) {
        salidaConductores.innerHTML = '<div class="card">Edad inválida. Usá un número entre 18 y 85.</div>';
        return;
    }
    try {
        const data = await get(`/conductoressinauto?edad=${encodeURIComponent(edad)}`);
        salidaConductores.innerHTML = renderTable('Conductores sin auto', ['id_conductor', 'nombre', 'edad'], data);
    } catch (e) {
        salidaConductores.innerHTML = `<div class="card">Error: ${e.message}</div>`;
    }
});
