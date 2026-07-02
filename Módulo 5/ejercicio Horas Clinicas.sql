	-- PARTE 1 REGISTRO DE CONSULTAS MEDICAS.
	--
	-- Una clínica necesita crear una base de datos para administrar sus citas médicas. 
	-- Como primer paso, cree una tabla llamada Pacientes, donde se registre información básica 
	-- como el nombre del paciente, RUT, teléfono y edad. Además, cree una tabla llamada Medicos, 
	-- donde se almacene el nombre del profesional, su especialidad y el número de consulta donde atiende.
	--
	-- Ingrese al menos 8 pacientes y 5 médicos de prueba. Luego, realice una consulta para visualizar 
	-- todos los registros almacenados en ambas tablas.
	-- 
	-- Se crea tabla de pacientes.
	CREATE TABLE pacientes (
		id_paciente SERIAL PRIMARY KEY,
		nombre VARCHAR(100) NOT NULL,
		apellido VARCHAR(100) NOT NULL,
		rut VARCHAR(20) NOT NULL,
		edad INT NOT NULL,
		telefono INT NOT NULL
	);

	-- Se crea tabla de medicos.
	CREATE TABLE medicos (
		id_medico SERIAL PRIMARY KEY,
		nombre VARCHAR(100) NOT NULL,
		apellido VARCHAR(100) NOT NULL,
		rut VARCHAR(20) NOT NULL,
		edad INT NOT NULL,
		telefono INT NOT NULL,
		especialidad VARCHAR(100) NOT NULL,
		numero_consulta INT NOT NULL UNIQUE
	);

	-- Verificamos que esten correctamente creadas las tablas.
	SELECT * FROM pacientes, medicos;

	-- Agregamos 8 pacientes.
	INSERT INTO pacientes(nombre, apellido, rut, edad, telefono) VALUES 
	('Pedro', 'Alvarez', '17.586.870-6', 37, 22332255),
	('Alfredo', 'Perez', '18.786.850-4', 38, 56985214),
	('Felipe', 'Cea', '7.123.654-6', 51, 45474585),
	('Antonia', 'Figueroa', '22.586.870-6', 25, 25456525),
	('Pilar', 'Cifuentes', '5.955.878-6', 65, 25485295),
	('Carolina', 'Burgos', '12.586.534-k', 49, 25471258),
	('Ignacio', 'Martinez', '19.586.870-6', 34, 56897845),
	('Claudio', 'Alvarez', '20.586.666-6', 33, 45874588);

	-- Agregamos 5 medicos.
	INSERT INTO medicos(nombre, apellido, rut, edad, telefono, especialidad, numero_consulta) VALUES 
	('Federico', 'Nieto', '14.586.870-8', 41, 98653258, 'Traumatologia', 1),
	('Alberto', 'Lemp', '8.546.870-4', 23, 45789652, 'Medicina General', 2),
	('Ricardo', 'Gonzalez', '48.586.456-1', 24, 85423514, 'Broncopulmonar', 3),
	('Nicolas', 'Hernandez', '15.663.840-k', 55, 98652147, 'Cardiopulmonar', 4),
	('Alexis', 'Parra', '14.586.870-6', 13, 33665522, 'Pediatria', 5);

	-- Seleccionamos las tablas completas para verificar el correcto ingreso.
	SELECT * FROM pacientes;
	SELECT * FROM medicos;

	-- PARTE 2 REGISTRO DE CONSULTAS MEDICAS.
	--
	-- La clínica también necesita registrar las salas o consultas donde atienden los médicos. 
	-- Para ello, cree una nueva tabla llamada Consultas, que almacene el número de consulta, 
	-- el piso donde se encuentra y su estado, por ejemplo: Disponible, Ocupada o En mantención.
	-- Ingrese al menos 5 consultas de prueba. Luego, realice una consulta que muestre los médicos junto con 
	-- la información de la consulta donde atienden.
	--
	-- Se crea tabla de consultas.
	CREATE TABLE consultas (
		id_consulta SERIAL PRIMARY KEY,
		nombre_consulta VARCHAR(20) NOT NULL,
		piso_consulta INT NOT NULL,
		estado VARCHAR(50) NOT NULL,
		numero_consulta INT NOT NULL,
		FOREIGN KEY (numero_consulta) REFERENCES medicos(numero_consulta)
	);

	-- Revisamos la tabla consultas.
	SELECT * FROM consultas;

	-- Agregamos 5 consultas a la tabla.
	INSERT INTO consultas (nombre_consulta, piso_consulta, estado, numero_consulta)
	VALUES
	('Sala 1', 1, 'Disponible', 1),
	('Sala 2', 1, 'Disponible', 2),
	('Sala 3', 2, 'Disponible', 3),
	('Sala 4', 2, 'Disponible', 4),
	('Sala 5', 2, 'Disponible', 5);

	-- Revisamos la tabla consultas.
	SELECT * FROM consultas;

	-- Consulta de los medicos con la informacion donde atienden.

	-- PARTE 3 REGISTRO DE CONSULTAS MEDICAS.
	--
	-- Finalmente, la clínica necesita registrar las citas solicitadas por los pacientes. Cree una tabla llamada Citas, 
	-- donde se almacene el paciente (id del paciente), el médico (id del médico), la consulta asignada (id de la consulta),
	-- la fecha de atención y el estado de la cita, por ejemplo: Programada, Atendida o Cancelada.
	--
	-- Ingrese al menos 8 citas de prueba. Luego, realice una consulta que muestre el nombre del paciente, el nombre del 
	-- médico, la especialidad, el número de consulta, la fecha de atención y el estado de la cita.
	--
	-- 