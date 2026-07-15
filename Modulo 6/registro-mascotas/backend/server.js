const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const DATA_FILE = path.join(__dirname, '..', 'data', 'mascotas.json');

async function readMascotas() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeMascotas(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/mascotas', async (req, res) => {
  try {
    const data = await readMascotas();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al leer mascotas' });
  }
});

app.get('/api/mascotas/buscar', async (req, res) => {
  try {
    const nombre = req.query.nombre;
    const rut = req.query.rut;

    if (!nombre && !rut) {
      return res.status(400).json({ error: 'Debe enviar el parámetro nombre o rut.' });
    }

    const data = await readMascotas();

    if (nombre) {
      const encontrada = data.find(m => m.nombre.toLowerCase() === String(nombre).trim().toLowerCase());
      if (!encontrada) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
      }
      return res.json(encontrada);
    }

    if (rut) {
      const resultados = data.filter(m => m.rutDueno === String(rut).trim());
      return res.json(resultados);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar mascotas' });
  }
});

app.post('/api/mascotas', async (req, res) => {
  try {
    const { nombre, rutDueno } = req.body || {};
    if (!nombre || !rutDueno) {
      return res.status(400).json({ error: 'Faltan datos: nombre y rutDueno.' });
    }

    const data = await readMascotas();
    const existe = data.find(m => m.nombre.toLowerCase() === String(nombre).trim().toLowerCase());
    if (existe) {
      return res.status(409).json({ error: 'Ya existe una mascota con ese nombre.' });
    }

    const nuevaMascota = {
      nombre: String(nombre).trim(),
      rutDueno: String(rutDueno).trim()
    };

    data.push(nuevaMascota);
    await writeMascotas(data);

    res.status(201).json(nuevaMascota);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear mascota' });
  }
});

app.delete('/api/mascotas', async (req, res) => {
  try {
    const nombre = req.query.nombre;
    const rut = req.query.rut;

    if (!nombre && !rut) {
      return res.status(400).json({ error: 'Debe enviar el parámetro nombre o rut.' });
    }

    const data = await readMascotas();

    if (nombre) {
      const nuevos = data.filter(m => m.nombre.toLowerCase() !== String(nombre).trim().toLowerCase());
      if (nuevos.length === data.length) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
      }
      await writeMascotas(nuevos);
      return res.json({ mensaje: 'Mascota eliminada', eliminados: data.length - nuevos.length });
    }

    if (rut) {
      const antes = data.length;
      const nuevos = data.filter(m => m.rutDueno !== String(rut).trim());
      if (nuevos.length === antes) {
        return res.status(404).json({ error: 'No hay mascotas asociadas a ese RUT.' });
      }
      await writeMascotas(nuevos);
      return res.json({ mensaje: 'Mascotas eliminadas', eliminados: antes - nuevos.length });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar mascota' });
  }
});

app.listen(PORT, () => {
  console.log(`Registro Civil de Mascotas escuchando en http://localhost:${PORT}`);
});
