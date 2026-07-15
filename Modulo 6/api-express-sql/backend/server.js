const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

const initSql = `
CREATE TABLE IF NOT EXISTS conductores (
    id_conductor INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    edad INTEGER NOT NULL CHECK (edad BETWEEN 18 AND 85)
);

CREATE TABLE IF NOT EXISTS automoviles (
    id_auto INTEGER PRIMARY KEY,
    patente TEXT NOT NULL UNIQUE,
    marca TEXT,
    modelo TEXT,
    id_conductor INTEGER,
    CONSTRAINT fk_automovil_conductor
        FOREIGN KEY (id_conductor)
        REFERENCES conductores(id_conductor)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

INSERT OR IGNORE INTO conductores (id_conductor, nombre, edad) VALUES (1, 'Ana García', 78);
INSERT OR IGNORE INTO conductores (id_conductor, nombre, edad) VALUES (2, 'Luis Pérez', 25);
INSERT OR IGNORE INTO conductores (id_conductor, nombre, edad) VALUES (3, 'Maria Soto', 40);
INSERT OR IGNORE INTO conductores (id_conductor, nombre, edad) VALUES (4, 'Carlos Ruiz', 80);
INSERT OR IGNORE INTO conductores (id_conductor, nombre, edad) VALUES (5, 'Elena Torres', 32);

INSERT OR IGNORE INTO automoviles (id_auto, patente, marca, modelo, id_conductor) VALUES (101, 'ABC123', 'Toyota', 'Corolla', 1);
INSERT OR IGNORE INTO automoviles (id_auto, patente, marca, modelo, id_conductor) VALUES (102, 'BCD234', 'Ford', 'Focus', 1);
INSERT OR IGNORE INTO automoviles (id_auto, patente, marca, modelo, id_conductor) VALUES (103, 'DEG345', 'Honda', 'Civic', 2);
INSERT OR IGNORE INTO automoviles (id_auto, patente, marca, modelo, id_conductor) VALUES (104, 'FGH456', 'VW', 'Golf', NULL);
INSERT OR IGNORE INTO automoviles (id_auto, patente, marca, modelo, id_conductor) VALUES (105, 'HIJ567', 'Fiat', 'Palio', 3);
INSERT OR IGNORE INTO automoviles (id_auto, patente, marca, modelo, id_conductor) VALUES (106, 'JKL678', 'Chevrolet', 'Cruze', NULL);
INSERT OR IGNORE INTO automoviles (id_auto, patente, marca, modelo, id_conductor) VALUES (107, 'LMN789', 'Toyota', 'Yaris', 5);
INSERT OR IGNORE INTO automoviles (id_auto, patente, marca, modelo, id_conductor) VALUES (108, 'MNO890', 'Ford', 'Fiesta', 5);
INSERT OR IGNORE INTO automoviles (id_auto, patente, marca, modelo, id_conductor) VALUES (109, 'OPQ901', 'Honda', 'Fit', 5);
`;

db.exec(initSql, (err) => {
  if (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
  console.log('Database initialized');
});

app.get('/conductores', (req, res) => {
  db.all('SELECT * FROM conductores ORDER BY id_conductor', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener conductores' });
    }
    res.json(rows);
  });
});

app.get('/automoviles', (req, res) => {
  db.all('SELECT * FROM automoviles ORDER BY patente', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener automóviles' });
    }
    res.json(rows);
  });
});

app.get('/conductoressinauto', (req, res) => {
  const edad = parseInt(req.query.edad, 10);
  if (Number.isNaN(edad) || edad < 18 || edad > 85) {
    return res.status(400).json({ error: 'Parámetro edad inválido. Debe ser un número entre 18 y 85.' });
  }

  const sql = `
    SELECT c.*
    FROM conductores c
    LEFT JOIN automoviles a ON a.id_conductor = c.id_conductor
    WHERE c.edad < ? AND a.id_conductor IS NULL
    ORDER BY c.id_conductor
  `;
  db.all(sql, [edad], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener conductores sin automóvil' });
    }
    res.json(rows);
  });
});

app.get('/solitos', (req, res) => {
  const sqlConductores = `
    SELECT 'conductor' AS tipo, c.id_conductor AS id, c.nombre, c.edad, NULL AS patente
    FROM conductores c
    LEFT JOIN automoviles a ON a.id_conductor = c.id_conductor
    WHERE a.id_conductor IS NULL
    ORDER BY c.id_conductor
  `;

  const sqlAutomoviles = `
    SELECT 'automovil' AS tipo, a.id_auto AS id, NULL AS nombre, NULL AS edad, a.patente, a.marca, a.modelo
    FROM automoviles a
    LEFT JOIN conductores c ON c.id_conductor = a.id_conductor
    WHERE a.id_conductor IS NULL
    ORDER BY a.patente
  `;

  db.all(sqlConductores, (err1, conductores) => {
    if (err1) {
      console.error(err1);
      return res.status(500).json({ error: 'Error al obtener datos solitos' });
    }
    db.all(sqlAutomoviles, (err2, automoviles) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'Error al obtener datos solitos' });
      }
      res.json({
        conductoresSinAuto: conductores,
        automovilesSinConductor: automoviles,
      });
    });
  });
});

app.get('/auto', (req, res) => {
  if (req.query.patente) {
    const sql = `
      SELECT a.*, c.nombre, c.edad
      FROM automoviles a
      LEFT JOIN conductores c ON c.id_conductor = a.id_conductor
      WHERE a.patente = ?
      ORDER BY a.patente
    `;
    db.get(sql, [req.query.patente], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener automóvil por patente' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Automóvil no encontrado' });
      }
      res.json(row);
    });
    return;
  }

  if (req.query.iniciopatente) {
    const letra = String(req.query.iniciopatente).trim().slice(0, 1);
    const sql = `
      SELECT a.*, c.nombre, c.edad
      FROM automoviles a
      LEFT JOIN conductores c ON c.id_conductor = a.id_conductor
      WHERE UPPER(a.patente) LIKE ?
      ORDER BY a.patente
    `;
    db.all(sql, [letra + '%'], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener automóviles por prefijo' });
      }
      res.json(rows);
    });
    return;
  }

  res.status(400).json({ error: 'Debe enviar patente o iniciopatente.' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
