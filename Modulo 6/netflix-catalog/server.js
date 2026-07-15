const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const PELICULAS_FILE = path.join(DATA_DIR, 'peliculas.json');
const SERIES_FILE = path.join(DATA_DIR, 'series.json');

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

function parseBoolean(value) {
  const v = String(value || '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'serie';
}

app.get('/api/catalogo', async (req, res) => {
  try {
    const tipo = String(req.query.tipo || '').trim().toLowerCase();
    if (tipo === 'pelicula' || tipo === 'películas') {
      const data = await readJson(PELICULAS_FILE);
      return res.json(data);
    }
    if (tipo === 'serie' || tipo === 'series') {
      const data = await readJson(SERIES_FILE);
      return res.json(data);
    }
    return res.status(400).json({ error: 'Parámetro tipo inválido. Usa ?tipo=pelicula o ?tipo=serie.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al leer catálogo' });
  }
});

app.post('/api/catalogo', async (req, res) => {
  try {
    const tipo = String(req.query.tipo || '').trim().toLowerCase();
    if (tipo === 'pelicula' || tipo === 'películas') {
      const { nombre, director, anio } = req.body || {};
      if (!nombre || director === undefined || anio === undefined) {
        return res.status(400).json({ error: 'Datos inválidos para película' });
      }
      const data = await readJson(PELICULAS_FILE);
      data.push({ nombre: String(nombre), director: String(director), anio: Number(anio) });
      await writeJson(PELICULAS_FILE, data);
      return res.status(201).json({ mensaje: 'Película agregada', item: data[data.length - 1] });
    }
    if (tipo === 'serie' || tipo === 'series') {
      const { nombre, anio, temporadas } = req.body || {};
      if (!nombre || anio === undefined || temporadas === undefined) {
        return res.status(400).json({ error: 'Datos inválidos para serie' });
      }
      const data = await readJson(SERIES_FILE);
      data.push({ nombre: String(nombre), anio: Number(anio), temporadas: Number(temporadas) });
      await writeJson(SERIES_FILE, data);
      return res.status(201).json({ mensaje: 'Serie agregada', item: data[data.length - 1] });
    }
    return res.status(400).json({ error: 'Parámetro tipo inválido. Usa ?tipo=pelicula o ?tipo=serie.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al guardar en catálogo' });
  }
});

app.delete('/api/catalogo', async (req, res) => {
  try {
    const { nombre, tipo } = req.query;
    if (!nombre || !tipo) {
      return res.status(400).json({ error: 'Faltan parámetros: nombre y tipo.' });
    }
    const tipoLower = String(tipo).trim().toLowerCase();
    const filePath = tipoLower === 'serie' || tipoLower === 'series' ? SERIES_FILE : PELICULAS_FILE;
    if (!filePath) {
      return res.status(400).json({ error: 'Tipo inválido. Usa tipo=pelicula o tipo=serie.' });
    }
    const data = await readJson(filePath);
    const antes = data.length;
    const filtrado = data.filter((item) => String(item.nombre).toLowerCase() !== String(nombre).trim().toLowerCase());
    if (filtrado.length === antes) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    await writeJson(filePath, filtrado);
    return res.json({ mensaje: 'Eliminado', eliminados: antes - filtrado.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al eliminar del catálogo' });
  }
});

const soloPermitidos = {
  '/api/catalogo': ['GET', 'POST', 'DELETE'],
};

app.use((req, res) => {
  const metodos = soloPermitidos[req.path];
  if (metodos && !metodos.includes(req.method)) {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  return res.status(404).json({ error: 'Endpoint no encontrado' });
});

app.listen(PORT, () => {
  console.log(`Servidor Netflix Catalog escuchando en http://localhost:${PORT}`);
});
