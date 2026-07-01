-- Consulta de creación de tabla "reservas"
CREATE TABLE reservas (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	habitacion VARCHAR(500)  NOT NULL,
	cnt_noches VARCHAR(50)  NOT NULL,
	estado BOOLEAN DEFAULT FALSE
);

--Agrego valores a la tabla reservas
INSERT INTO reservas (nombre, habitacion, cnt_noches, estado) 
VALUES
('Valentina Silva', 104, 3, TRUE),
('Mateo Benítez', 202, 5, FALSE),
('Sofía Alarcón', 101, 2, TRUE),
('Lucas Espinoza', 305, 7, TRUE),
('Florencia Tapia', 210, 1, FALSE);

SELECT * FROM reservas

INSERT INTO reservas (nombre, habitacion, cnt_noches, estado) 
VALUES
('Tomás Yarza', 301, 4, TRUE),
('Isidora Rojas', 105, 2, FALSE),
('Benjamín Castro', 204, 6, TRUE);

SELECT * FROM reservas

--Para eliminar filas usando una condición en común
DELETE FROM reservas 
WHERE estado = FALSE;

SELECT * FROM reservas

-- Para hacer modificaciones
UPDATE reservas 
SET cnt_noches = 2, 
    estado = false
WHERE id = 6;

SELECT * FROM reservas

-- Para hacer modificaciones
UPDATE reservas 
SET cnt_noches = 5, 
    estado = false
WHERE id = 9;

SELECT * FROM reservas

-- Mostrar datos de forma ordenada descendente
SELECT * FROM reservas
ORDER BY id DESC;

-- Mostrar datos de forma ordenada ascendentemente
SELECT * FROM reservas
ORDER BY id ASC;

-- Mostrar datos de forma ordenada ascendente
SELECT * FROM reservas
ORDER BY id ASC;

-- Consulta de creación de tabla "habitación disponible"
CREATE TABLE habitaciones_disponible (
	id SERIAL PRIMARY KEY,
	habitacion VARCHAR(500)  NOT NULL,
	tipo VARCHAR(50)  NOT NULL,
	precio VARCHAR(50)  NOT NULL,
	estado BOOLEAN DEFAULT TRUE
);

--Eliminar tablar
DROP TABLE habitaciones_disponible

-- Consulta de creación de tabla "habitación disponible"
CREATE TABLE habitaciones_disponible (
	id SERIAL PRIMARY KEY,
	habitacion VARCHAR(500)  NOT NULL,
	tipo VARCHAR(50)  NOT NULL,
	precio VARCHAR(50)  NOT NULL,
	estado BOOLEAN DEFAULT TRUE
);

ALTER TABLE reservas 
DROP COLUMN habitacion;

ALTER TABLE reservas 
DROP COLUMN estado;

ALTER TABLE reservas 
ADD COLUMN id_habitacion INTEGER;

SELECT * FROM reservas

--Se establece la relación entre ambas tablas
--fk: Foreign Key (Clave Foránea)
ALTER TABLE reservas
ADD CONSTRAINT fk_reservas_habitaciones_disponible
FOREIGN KEY (id_habitacion)
REFERENCES habitaciones_disponible(id);

SELECT * FROM reservas

--Agrego valores a la tabla habitación disponible
INSERT INTO habitaciones_disponible (habitacion, tipo, precio, estado) 
VALUES
('104', 'Simple', '25000', TRUE),
('202', 'Doble', '45000', FALSE),
('101', 'Simple', '25000', TRUE),
('305', 'Suite', '85000', TRUE),
('210', 'Doble', '45000', FALSE),
('301', 'Suite', '85000', TRUE),
('105', 'Simple', '28000', FALSE),
('204', 'Doble', '48000', TRUE);

SELECT * FROM habitaciones_disponible

SELECT 
    id, 
    habitacion,
	tipo,
	precio,
    CASE 
        WHEN estado = TRUE THEN 'Disponible'
        WHEN estado = FALSE  THEN 'Ocupada'
    END AS estado_habitacion
FROM habitaciones_disponible;

SELECT * FROM reservas

--Eliminar tabla
DROP TABLE reservas

-- Consulta de creación de tabla "reservas"
CREATE TABLE reservas (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(500)  NOT NULL,
	cnt_noches VARCHAR(50)  NOT NULL,
	id_habitacion INTEGER NOT NULL
);

--Se establece la relación entre ambas tablas
--fk: Foreign Key (Clave Foránea)
ALTER TABLE reservas
ADD CONSTRAINT fk_reservas_habitaciones_disponible
FOREIGN KEY (id_habitacion)
REFERENCES habitaciones_disponible(id);

--Agrego valores a la tabla reservas
INSERT INTO reservas (nombre, cnt_noches, id_habitacion) 
VALUES
('Valentina Silva', 3, 3),
('Mateo Benítez', 5, 4),
('Sofía Alarcón', 2, 5),
('Lucas Espinoza', 7, 6),
('Florencia Tapia', 1, 7),
('Tomás Yarza', 4, 8);

SELECT reservas.id_habitacion, habitaciones_disponible.habitacion, reservas.nombre, reservas.cnt_noches, habitaciones_disponible.tipo, habitaciones_disponible.precio, habitaciones_disponible.estado
FROM reservas, habitaciones_disponible
WHERE reservas.id_habitacion=habitaciones_disponible.id;
