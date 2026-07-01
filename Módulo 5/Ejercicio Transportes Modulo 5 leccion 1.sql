-- Se crean las tablas camiones y choferes y se establece su relacion a traves del id del camion
CREATE TABLE camiones (
	id_camion SERIAL PRIMARY KEY,
	modelo VARCHAR (100) NOT NULL,
	patente VARCHAR (10) NOT NULL
);

CREATE TABLE choferes (
	id_chofer SERIAL PRIMARY KEY,
	nombre VARCHAR (100) NOT NULL,
	id_camion INT NOT NULL,
	FOREIGN KEY (id_camion) REFERENCES camiones(id_camion)
);

-- Añadimos datos para revisar las tablas
INSERT INTO camiones(modelo, patente)
VALUES
('Scania', 'vvvv56'),
('Ford', 'xxxx38'),
('Man', 'yyyy88'),
('Iveco', 'zzzz21');

-- Revisamos los datos de la tabla para, ademas, revisar el id de los camiones
SELECT * FROM camiones;

-- Añadimos datos a la tabla de choferes con los datos del id del camion
INSERT INTO choferes (nombre, id_camion)
VALUES
('Roberto Chambers', 4),
('Esteban King', 3),
('Edgar Poe', 2),
('Felipe Lovecraft', 1);

-- Revisamos la tabla de choferes
SELECT 
