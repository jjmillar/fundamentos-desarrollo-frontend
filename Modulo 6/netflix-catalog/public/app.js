const API = 'http://localhost:3000/api/catalogo';
let catalogo = [];
let tipoActual = null;

const listado = document.getElementById('listado');
const estado = document.getElementById('estado');
const tituloListado = document.getElementById('tituloListado');

async function cargar(tipo) {
  tipoActual = tipo;
  estado.textContent = '';
  try {
    const resp = await fetch(`${API}?tipo=${encodeURIComponent(tipo)}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    catalogo = await resp.json();
    render();
  } catch (e) {
    estado.textContent = 'Error: ' + e.message;
  }
}

function render() {
  const campo = document.getElementById('ordenarPor').value.trim().toLowerCase();
  const datos = catalogo.slice().sort((a, b) => {
    if (campo === 'anio' || campo === 'temporadas') return (a[campo] || 0) - (b[campo] || 0);
    if (campo === 'director') return String(a.director || '').localeCompare(String(b.director || ''));
    return String(a.nombre || '').localeCompare(String(b.nombre || ''));
  });

  if (!datos.length) {
    listado.innerHTML = '<div class="item">Sin datos</div>';
    return;
  }

  listado.innerHTML = datos.map((item, i) => {
    const detalle = tipoActual === 'pelicula' || tipoActual === 'películas'
      ? `${item.director} - ${item.anio}`
      : `${item.anio} - ${item.temporadas} temporadas`;
    return `<div class="item" data-index="${i}"><strong>${item.nombre}</strong><br/>${detalle}</div>`;
  }).join('');
}

document.getElementById('btnPeliculas').addEventListener('click', () => {
  tipoActual = 'pelicula';
  tituloListado.textContent = 'Películas';
  cargar('pelicula');
});

document.getElementById('btnSeries').addEventListener('click', () => {
  tipoActual = 'serie';
  tituloListado.textContent = 'Series';
  cargar('serie');
});

document.getElementById('btnOrdenar').addEventListener('click', render);

document.getElementById('btnEliminar').addEventListener('click', async () => {
  if (!tipoActual) return;
  const seleccionado = listado.querySelector('[data-index]');
  if (!seleccionado) {
    estado.textContent = 'Seleccioná un elemento de la lista.';
    return;
  }
  const idx = Number(seleccionado.getAttribute('data-index'));
  const item = catalogo[idx];
  if (!item) return;
  try {
    const resp = await fetch(`${API}?nombre=${encodeURIComponent(item.nombre)}&tipo=${encodeURIComponent(tipoActual)}`, { method: 'DELETE' });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error || 'Error eliminando');
    }
    await cargar(tipoActual);
  } catch (e) {
    estado.textContent = 'Error: ' + e.message;
  }
});

document.getElementById('formPelicula').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = {
    nombre: String(fd.get('nombre') || '').trim(),
    director: String(fd.get('director') || '').trim(),
    anio: Number(fd.get('anio')),
  };
  if (!body.nombre || !body.director || Number.isNaN(body.anio)) {
    estado.textContent = 'Completá nombre, director y año.';
    return;
  }
  try {
    const resp = await fetch(`${API}?tipo=pelicula`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error || 'Error creando película');
    }
    e.target.reset();
    await cargar('pelicula');
    tituloListado.textContent = 'Películas';
    tipoActual = 'pelicula';
  } catch (e) {
    estado.textContent = 'Error: ' + e.message;
  }
});

document.getElementById('formSerie').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = {
    nombre: String(fd.get('nombre') || '').trim(),
    anio: Number(fd.get('anio')),
    temporadas: Number(fd.get('temporadas')),
  };
  if (!body.nombre || Number.isNaN(body.anio) || Number.isNaN(body.temporadas)) {
    estado.textContent = 'Completá nombre, año y temporadas.';
    return;
  }
  try {
    const resp = await fetch(`${API}?tipo=serie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error || 'Error creando serie');
    }
    e.target.reset();
    await cargar('serie');
    tituloListado.textContent = 'Series';
    tipoActual = 'serie';
  } catch (e) {
    estado.textContent = 'Error: ' + e.message;
  }
});
