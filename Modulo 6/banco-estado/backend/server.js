const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const DATA_DIR = path.join(__dirname, '..', 'data');
const CLIENTES_FILE = path.join(DATA_DIR, 'clientes.json');
const CUENTAS_FILE = path.join(DATA_DIR, 'cuentas.json');

async function readJson(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function buscarClientePorRut(clientes, rut) {
  return clientes.find(c => c.rut === rut);
}

function generarNumeroCuenta(tipo, cuentas) {
  const max = cuentas
    .filter(c => c.tipo === tipo)
    .reduce((m, c) => Math.max(m, parseInt(c.numero, 10) || 0), 0);
  return String(max + 1).padStart(3, '0');
}

app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await readJson(CLIENTES_FILE);
    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al leer clientes' });
  }
});

app.get('/api/clientes/rut', async (req, res) => {
  try {
    const clientes = await readJson(CLIENTES_FILE);
    const soloRut = clientes.map(c => ({
      rut: c.rut,
      nombre: c.nombre,
      cuentaRut: c.cuentas.rut || null
    }));
    res.json(soloRut);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al leer clientes' });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const { rut, nombre, tipoCuenta } = req.body || {};
    if (!rut || !nombre || !tipoCuenta) {
      return res.status(400).json({ error: 'Faltan datos: rut, nombre y tipoCuenta (rut o ahorro).' });
    }

    const clientes = await readJson(CLIENTES_FILE);
    const cuentas = await readJson(CUENTAS_FILE);

    if (buscarClientePorRut(clientes, rut)) {
      return res.status(409).json({ error: 'Ya existe un cliente con ese RUT.' });
    }

    const numeroCuenta = generarNumeroCuenta(tipoCuenta, cuentas);
    const nuevaCuenta = {
      numero: numeroCuenta,
      tipo: tipoCuenta,
      rutCliente: rut,
      saldo: 0
    };
    cuentas.push(nuevaCuenta);

    const nuevoCliente = {
      rut,
      nombre,
      cuentas: {
        rut: tipoCuenta === 'rut' ? nuevaCuenta : { numero: null, saldo: 0 },
        ahorro: tipoCuenta === 'ahorro' ? [nuevaCuenta] : []
      }
    };

    if (tipoCuenta === 'rut') {
      nuevoCliente.cuentas.rut = nuevaCuenta;
    } else {
      nuevoCliente.cuentas.rut = { numero: null, saldo: 0 };
    }

    clientes.push(nuevoCliente);

    await writeJson(CLIENTES_FILE, clientes);
    await writeJson(CUENTAS_FILE, cuentas);

    res.status(201).json({ cliente: nuevoCliente, cuenta: nuevaCuenta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

app.post('/api/clientes/:rut/cuentas', async (req, res) => {
  try {
    const { rut } = req.params;
    const { tipoCuenta } = req.body || {};
    if (!tipoCuenta || (tipoCuenta !== 'rut' && tipoCuenta !== 'ahorro')) {
      return res.status(400).json({ error: 'tipoCuenta debe ser rut o ahorro.' });
    }

    const clientes = await readJson(CLIENTES_FILE);
    const cuentas = await readJson(CUENTAS_FILE);

    const cliente = buscarClientePorRut(clientes, rut);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    if (tipoCuenta === 'rut') {
      if (cliente.cuentas.rut && cliente.cuentas.rut.numero) {
        return res.status(409).json({ error: 'El cliente ya tiene cuenta RUT.' });
      }
      const numeroCuenta = generarNumeroCuenta('rut', cuentas);
      const nuevaCuenta = {
        numero: numeroCuenta,
        tipo: 'rut',
        rutCliente: rut,
        saldo: 0
      };
      cuentas.push(nuevaCuenta);
      cliente.cuentas.rut = nuevaCuenta;
    } else {
      const numeroCuenta = generarNumeroCuenta('ahorro', cuentas);
      const nuevaCuenta = {
        numero: numeroCuenta,
        tipo: 'ahorro',
        rutCliente: rut,
        saldo: 0
      };
      cuentas.push(nuevaCuenta);
      cliente.cuentas.ahorro = cliente.cuentas.ahorro || [];
      cliente.cuentas.ahorro.push(nuevaCuenta);
    }

    await writeJson(CLIENTES_FILE, clientes);
    await writeJson(CUENTAS_FILE, cuentas);

    res.status(201).json({ cliente, cuenta: tipoCuenta === 'rut' ? cliente.cuentas.rut : cuentas.find(c => c.numero === generarNumeroCuenta(tipoCuenta, cuentas)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar cuenta' });
  }
});

app.delete('/api/clientes/:rut', async (req, res) => {
  try {
    const { rut } = req.params;
    const clientes = await readJson(CLIENTES_FILE);
    const cuentas = await readJson(CUENTAS_FILE);

    const cliente = buscarClientePorRut(clientes, rut);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    const actualizados = clientes.filter(c => c.rut !== rut);
    const cuentasFiltradas = cuentas.filter(c => c.rutCliente !== rut);

    await writeJson(CLIENTES_FILE, actualizados);
    await writeJson(CUENTAS_FILE, cuentasFiltradas);

    res.json({ mensaje: 'Cliente y cuentas eliminados' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

app.delete('/api/clientes/:rut/cuentas/rut', async (req, res) => {
  try {
    const { rut } = req.params;
    const clientes = await readJson(CLIENTES_FILE);
    const cuentas = await readJson(CUENTAS_FILE);

    const cliente = buscarClientePorRut(clientes, rut);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }
    if (!cliente.cuentas.rut || !cliente.cuentas.rut.numero) {
      return res.status(404).json({ error: 'El cliente no tiene cuenta RUT.' });
    }

    const numeroCuenta = cliente.cuentas.rut.numero;
    cliente.cuentas.rut = { numero: null, saldo: 0 };

    const cuentasActualizadas = cuentas.filter(c => !(c.tipo === 'rut' && c.rutCliente === rut && c.numero === numeroCuenta));

    await writeJson(CLIENTES_FILE, clientes);
    await writeJson(CUENTAS_FILE, cuentasActualizadas);

    res.json({ mensaje: 'Cuenta RUT eliminada', cliente });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cuenta RUT' });
  }
});

app.delete('/api/clientes/:rut/cuentas/ahorro/:numero', async (req, res) => {
  try {
    const { rut, numero } = req.params;
    const clientes = await readJson(CLIENTES_FILE);
    const cuentas = await readJson(CUENTAS_FILE);

    const cliente = buscarClientePorRut(clientes, rut);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    const cuenta = cuentas.find(c => c.tipo === 'ahorro' && c.rutCliente === rut && c.numero === numero);
    if (!cuenta) {
      return res.status(404).json({ error: 'Cuenta de ahorro no encontrada.' });
    }

    cliente.cuentas.ahorro = (cliente.cuentas.ahorro || []).filter(c => c.numero !== numero);
    const cuentasActualizadas = cuentas.filter(c => !(c.tipo === 'ahorro' && c.rutCliente === rut && c.numero === numero));

    await writeJson(CLIENTES_FILE, clientes);
    await writeJson(CUENTAS_FILE, cuentasActualizadas);

    res.json({ mensaje: 'Cuenta de ahorro eliminada', cliente });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cuenta de ahorro' });
  }
});

app.listen(PORT, () => {
  console.log(`BancoEstado escuchando en http://localhost:${PORT}`);
});
