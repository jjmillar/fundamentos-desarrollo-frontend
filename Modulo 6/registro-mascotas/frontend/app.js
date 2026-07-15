const API = 'http://localhost:3000/api/mascotas';
const salidaEstado = document.getElementById('estado');
const listadoGeneral = document.getElementById('listadoGeneral');
const resultadoBusqueda = document.getElementById('resultadoBusqueda');
const resultadoEliminar = document.getElementById('resultadoEliminar');

function setEstado(msg, isError = false) {
  salidaEstado.textContent = msg || '';
  salidaEstado.className = isError ? 'estado error' : 'estado';
}

function renderMascota(m) {
  return `<div class="card"><strong>${m.nombre}</strong><br/>RUT dueño: ${m.rutDueno}</div>`;
}

function renderMascotas(items) {
  if (!Array.isArray(items) || !items.length) {
    return '<div class="card">Sin datos</div>';
  }
  return items.map(renderMascota).join('');
}

document.getElementById('btnListar').addEventListener('click', async () => {
  setEstado('Cargando mascotas...');
  listadoGeneral.innerHTML = '';
  try {
    const resp = await axios.get(API);
    listadoGeneral.innerHTML = renderMascotas(resp.data);
    setEstado(`Se encontraron ${resp.data.length} mascota(s)`);
  } catch (e) {
    const mensaje = e.response && e.response.data && e.response.data.error ? e.response.data.error : e.message;
    setEstado('Error: ' + mensaje, true);
  }
});

document.getElementById('formBuscar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const nombre = String(fd.get('nombre') || '').trim();
  const rut = String(fd.get('rut') || '').trim();

  if (!nombre && !rut) {
    setEstado('Ingresá nombre o RUT para buscar.', true);
    return;
  }

  setEstado('Buscando...');
  resultadoBusqueda.innerHTML = '';
  try {
    const resp = await axios.get(`${API}/buscar`, { params: { nombre, rut } });
    const datos = Array.isArray(resp.data) ? resp.data : [resp.data];
    resultadoBusqueda.innerHTML = renderMascotas(datos);
    setEstado(`Se encontraron ${datos.length} resultado(s)`);
  } catch (e) {
    const mensaje = e.response && e.response.data && e.response.data.error ? e.response.data.error : e.message;
    setEstado('Error: ' + mensaje, true);
  }
});

document.getElementById('formAgregar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = {
    nombre: String(fd.get('nombre') || '').trim(),
    rutDueno: String(fd.get('rutDueno') || '').trim()
  };
  if (!body.nombre || !body.rutDueno) {
    setEstado('Completá nombre y RUT del dueño.', true);
    return;
  }

  setEstado('Agregando mascota...');
  try {
    const resp = await axios.post(API, body);
    setEstado('Mascota agregada');
    listadoGeneral.innerHTML = renderMascota(resp.data);
  } catch (e) {
    const mensaje = e.response && e.response.data && e.response.data.error ? e.response.data.error : e.message;
    setEstado('Error: ' + mensaje, true);
  }
});

document.getElementById('formEliminar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const tipo = String(fd.get('tipo') || '').trim();
  const valor = String(fd.get('valor') || '').trim();

  if (!tipo || !valor) {
    setEstado('Seleccioná tipo de eliminación e ingresá el valor.', true);
    return;
  }

  setEstado('Eliminando...');
  try {
    const resp = await axios.delete(API, { params: { [tipo]: valor } });
    setEstado(resp.data.mensaje || 'Eliminado');
    resultadoEliminar.innerHTML = `<div class="card">Eliminados: ${resp.data.eliminados || '?'}</div>`;
  } catch (e) {
    const mensaje = e.response && e.response.data && e.response.data.error ? e.response.data.error : e.message;
    setEstado('Error: ' + mensaje, true);
  }
});
