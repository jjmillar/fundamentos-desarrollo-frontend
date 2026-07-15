const API = 'http://localhost:3000/api';
const salida = document.getElementById('salida');
const estado = document.getElementById('estado');

function setEstado(msg, isError = false) {
  estado.textContent = msg || '';
  estado.className = isError ? 'estado error' : 'estado';
}

function limpiar() {
  salida.innerHTML = '';
}

async function request(path, options = {}) {
  const resp = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const text = await resp.text();
  let data = text;
  try {
    const parsed = JSON.parse(text);
    data = parsed;
  } catch (_) {}
  if (!resp.ok) {
    const mensaje = data && data.error ? data.error : `HTTP ${resp.status}`;
    throw new Error(mensaje);
  }
  return data;
}

function renderClientes(clientes) {
  if (!Array.isArray(clientes) || !clientes.length) {
    salida.innerHTML = '<div class="card">Sin datos</div>';
    return;
  }
  salida.innerHTML = clientes.map(c => {
    const rut = c.rut || '';
    const nombre = c.nombre || '';
    const cuentas = c.cuentas || {};
    const rutInfo = cuentas.rut && cuentas.rut.numero ? `RUT ${cuentas.rut.numero} ($${Number(cuentas.rut.saldo || 0).toLocaleString('es-CL')})` : 'Sin RUT';
    const ahorro = (cuentas.ahorro || []).map(a => `${a.numero} ($${Number(a.saldo || 0).toLocaleString('es-CL')})`).join(', ') || 'Sin ahorro';
    return `<div class="card"><strong>${nombre}</strong><br/>RUT: ${rut}<br/>Cuenta RUT: ${rutInfo}<br/>Ahorro: ${ahorro}</div>`;
  }).join('');
}

document.getElementById('btnListar').addEventListener('click', async () => {
  limpiar();
  try {
    const data = await request('/clientes');
    renderClientes(data);
  } catch (e) {
    setEstado('Error: ' + e.message, true);
  }
});

document.getElementById('btnListarRut').addEventListener('click', async () => {
  limpiar();
  try {
    const data = await request('/clientes/rut');
    renderClientes(data);
  } catch (e) {
    setEstado('Error: ' + e.message, true);
  }
});

document.getElementById('formCliente').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = {
    rut: String(fd.get('rut') || '').trim(),
    nombre: String(fd.get('nombre') || '').trim(),
    tipoCuenta: String(fd.get('tipoCuenta') || '').trim()
  };
  setEstado('Creando cliente...');
  try {
    const data = await request('/clientes', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    setEstado('Cliente creado');
    const cliente = data.cliente || data;
    renderClientes([cliente]);
  } catch (e) {
    setEstado('Error: ' + e.message, true);
  }
});

document.getElementById('formCuenta').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const rut = String(fd.get('rut') || '').trim();
  const tipoCuenta = String(fd.get('tipoCuenta') || '').trim();
  setEstado('Agregando cuenta...');
  try {
    const data = await request(`/clientes/${encodeURIComponent(rut)}/cuentas`, {
      method: 'POST',
      body: JSON.stringify({ tipoCuenta })
    });
    setEstado('Cuenta agregada');
    const cliente = data.cliente || data;
    renderClientes([cliente]);
  } catch (e) {
    setEstado('Error: ' + e.message, true);
  }
});

document.getElementById('formEliminar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const rut = String(fd.get('rut') || '').trim();
  const tipo = String(fd.get('tipo') || '').trim().toLowerCase();
  const numeroCuenta = String(fd.get('numeroCuenta') || '').trim();
  setEstado('Eliminando...');
  try {
    if (tipo === 'cliente') {
      const data = await request(`/clientes/${encodeURIComponent(rut)}`, { method: 'DELETE' });
      setEstado(data.mensaje || 'Cliente eliminado');
    } else if (tipo === 'rut') {
      const data = await request(`/clientes/${encodeURIComponent(rut)}/cuentas/rut`, { method: 'DELETE' });
      setEstado(data.mensaje || 'Cuenta RUT eliminada');
      const cliente = data.cliente || data;
      renderClientes([cliente]);
    } else if (tipo === 'ahorro') {
      if (!numeroCuenta) {
        throw new Error('Ingresá el número de la cuenta de ahorro a eliminar.');
      }
      const data = await request(`/clientes/${encodeURIComponent(rut)}/cuentas/ahorro/${encodeURIComponent(numeroCuenta)}`, { method: 'DELETE' });
      setEstado(data.mensaje || 'Cuenta de ahorro eliminada');
      const cliente = data.cliente || data;
      renderClientes([cliente]);
    } else {
      setEstado('Seleccioná un tipo de eliminación.', true);
    }
  } catch (e) {
    setEstado('Error: ' + e.message, true);
  }
});
