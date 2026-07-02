CREATE TABLE paciente (
	id SERIAL PRIMARY KEY,
	nombre_paciente VARCHAR (50) NOT NULL,
	rut_paciente VARCHAR (20)NOT NULL,
	telefono_paciente INTEGER,
	edad_paciente SMALLINT
);

INSERT INTO paciente (nombre_paciente, rut_paciente, telefono_paciente, edad_paciente)
VALUES
('Javiera Morales', '11.234.567-8', '+56987123456', 26),
('Felipe Herrera', '14.876.543-2', '+56991234567', 39),
('Constanza Vega', '16.543.210-5', '+56992345678', 45),
('Matías Sepúlveda', '18.765.432-1', '+56993456789', 33),
('Daniela Fuentes', '13.987.654-7', '+56994567890', 29),
('Ignacio Cárdenas', '17.321.456-K', '+56995678901', 52),
('Francisca Navarrete', '19.654.321-3', '+56996789012', 41),
('Benjamín Castillo', '15.432.198-6', '+56997890123', 18);

ALTER TABLE paciente
ALTER COLUMN telefono_paciente TYPE VARCHAR (15);

ALTER TABLE paciente
RENAME TO pacientes;

CREATE TABLE medicos (
	id SERIAL,
	nombre_medico VARCHAR (20) NOT NULL,
	especialidad VARCHAR (20)NOT NULL,
	numero_consulta INTEGER
);

ALTER TABLE medicos
ADD PRIMARY KEY (id);

INSERT INTO medicos (nombre_medico, especialidad, numero_consulta)
VALUES
('Patricia Rivas', 'Pediatría', 101),
('Ricardo Molina', 'Cardiología', 102),
('Andrea Salinas', 'Dermatología', 103),
('Jorge Fuentes', 'Traumatología', 104),
('Carolina Vargas', 'Neurología', 105);

SELECT * FROM pacientes

SELECT * FROM medicos

SELECT * FROM consultas


SELECT nombre_paciente, edad_paciente
FROM pacientes
WHERE edad_paciente < 30
ORDER BY edad_paciente;

CREATE TABLE consultas (
	id SERIAL PRIMARY KEY,
	numero_consulta INTEGER NOT NULL,
	piso_box INTEGER NOT NULL,
	estado_box VARCHAR (15)
);

INSERT INTO consultas (numero_consulta, piso_box, estado_box)
VALUES
(101, 1, 'Disponible'),
(102, 1, 'Ocupada'),
(103, 2, 'Disponible'),
(104, 2, 'Mantención'),
(105, 3, 'Disponible');

SELECT 
medicos.nombre_medico,
medicos.especialidad,
consultas.numero_consulta,
consultas.piso_box,
consultas.estado_box
FROM medicos, consultas
WHERE medicos.numero_consulta = consultas.id;


UPDATE medicos SET numero_consulta = 5
WHERE numero_consulta = 105;

ALTER TABLE medicos 
ADD CONSTRAINT fk_medicos_consultas
FOREIGN KEY (numero_consulta)
REFERENCES consultas(id);

CREATE TABLE citas(
	id_citas SERIAL PRIMARY KEY,
	id_paciente INTEGER NOT NULL,
	id_medico INTEGER NOT NULL,
	id_consulta INTEGER NOT NULL,
	fecha_atencion DATE NOT NULL,
	estado_cita VARCHAR (20) NOT NULL
);
	ALTER TABLE citas
	ADD CONSTRAINT fk_citas_pacientes
	FOREIGN KEY (id_paciente)
	REFERENCES pacientes(id);

	ALTER TABLE citas
	ADD CONSTRAINT fk_citas_medicos
	FOREIGN KEY (id_medico)
	REFERENCES medicos(id);

	ALTER TABLE citas
	ADD CONSTRAINT fk_citas_consultas
	FOREIGN KEY (id_consulta)
	REFERENCES consultas(id)

INSERT INTO citas (id_paciente, id_medico, id_consulta, fecha_atencion, estado_cita)
VALUES
(1, 1, 1, '2026-07-10', 'Agendada'),
(2, 2, 2, '2026-07-10', 'Confirmada'),
(3, 3, 3, '2026-07-11', 'Agendada'),
(4, 4, 4, '2026-07-11', 'Cancelada'),
(5, 5, 5, '2026-07-12', 'Confirmada'),
(6, 1, 2, '2026-07-12', 'Agendada'),
(7, 2, 3, '2026-07-13', 'Confirmada'),
(8, 3, 5, '2026-07-13', 'Agendada');

SELECT * FROM citas

SELECT 
pacientes.nombre_paciente,
medicos.nombre_medico,
medicos.especialidad,
consultas.numero_consulta,
citas.fecha_atencion,
citas.estado_cita
FROM pacientes, medicos, consultas, citas
WHERE pacientes.id = citas.id_paciente
AND medicos.id = citas.id_medico
AND consultas.id = citas.id_consulta
ORDER BY medicos.nombre_medico;

CREATE TABLE recepcionistas (
    id SERIAL PRIMARY KEY,
    nombre_recepcionista VARCHAR(30) NOT NULL,
    turno VARCHAR(10) NOT NULL,
    numero_habitacion INTEGER NOT NULL
);

INSERT INTO recepcionistas
(nombre_recepcionista, turno, numero_consulta)
VALUES
('Sofía López', 'Mañana', 101),
('Marco Díaz', 'Tarde', 105),
('Elena Rojas', 'Tarde', 102);


ALTER TABLE recepcionistas
RENAME COLUMN numero_habitacion TO numero_consulta;

INSERT INTO recepcionistas
(nombre_recepcionista, turno, numero_consulta)
SELECT DISTINCT
    'Recepcionista Part time',
    'Mañana',
    numero_consulta
FROM consultas
WHERE numero_consulta IN (102, 103, 104);

SELECT DISTINCT turno
FROM recepcionistas;

SELECT DISTINCT numero_consulta
FROM recepcionistas;

SELECT * FROM recepcionistas

DROP TABLE recepcionistas;

DELETE FROM citas
WHERE estado_cita = 'Cancelada';

SELECT * FROM citas

UPDATE citas
SET estado_cita = 'Confirmada'
WHERE id_paciente IN (1, 6, 8);

SELECT DISTINCT especialidad
FROM medicos

SELECT DISTINCT estado_cita
FROM citas

SELECT DISTINCT piso_box
FROM consultas

SELECT * FROM medicos

INSERT INTO consultas (numero_consulta, piso_box, estado_box)
VALUES
(106, 3, 'Disponible');

INSERT INTO medicos (nombre_medico, especialidad, numero_consulta)
VALUES
('Luis Ramírez', 'Medicina General', 6);

SELECT id, numero_consulta
FROM consultas
WHERE numero_consulta = 106;

INSERT INTO citas (id_paciente, id_medico, id_consulta, fecha_atencion, estado_cita)
SELECT
    pacientes.id,
    medicos.id,
    consultas.id,
    '2026-07-20',
    'Agendada'
FROM pacientes, medicos, consultas
WHERE pacientes.edad_paciente > 30
AND medicos.especialidad = 'Medicina General'
AND consultas.numero_consulta = medicos.numero_consulta;

INSERT INTO citas (id_paciente, id_medico, id_consulta, fecha_atencion, estado_cita)
VALUES
(2, 8, 6, '2026-07-20', 'Agendada');

SELECT 
pacientes.nombre_paciente,
pacientes.rut_paciente,
pacientes.telefono_paciente,
medicos.nombre_medico,
medicos.especialidad,
consultas.numero_consulta,
consultas.piso_box,
citas.fecha_atencion,
citas.estado_cita
FROM pacientes, medicos, consultas, citas
WHERE pacientes.id = citas.id_paciente
AND medicos.id = citas.id_medico
AND consultas.id = citas.id_consulta
ORDER BY pacientes.nombre_paciente;