-- C1. Crear tabla reservas del hotel
-- SERIAL = autogeneración *podemos dejar abierta la asignación
-- PRIMARY KEY = llave , sin datos repetidos. Más eficiente uso numérico

	CREATE TABLE Hotel (
	id SERIAL PRIMARY KEY,
	nombre_huesped VARCHAR(50) NOT NULL,
	numero_habitacion INTEGER,
	cantidad_noches INTEGER,
	reservas BOOLEAN
	);

	SELECT * FROM Hotel

-- C2. Integrar reservas

	INSERT INTO Hotel (nombre_huesped, numero_habitacion, cantidad_noches, reservas)
	VALUES ('Meridio',123,2,TRUE),
	('Juana',134,4,FALSE), ('Juan',145,5,TRUE),
	('Camila',145,5,TRUE), ('Pedro',156,3,FALSE),
	('María',167,1,TRUE), ('Diego',178,4,FALSE),
	('Valentina',189,2,TRUE);

-- C5. Eliminar algún estado

	DELETE FROM Hotel
	WHERE reservas = FALSE;

-- C4. Integrar cambio estado

	UPDATE Hotel
	SET reservas = FALSE
	WHERE nombre_huesped = 'Juan';
	
	UPDATE Hotel
	SET cantidad_noches = 4
	WHERE nombre_huesped = 'Valentina';
	
	UPDATE Hotel
	SET cantidad_noches = 10
	WHERE nombre_huesped = 'María';
	
	SELECT * FROM Hotel;

-- EXTENSIÓN. PARTE 2

-- C5. Tabla 2, detalles habitaciones

	CREATE TABLE Habitaciones(
	id SERIAL PRIMARY KEY,
	numero_habitacion INTEGER,
	tipo_habitacion VARCHAR(30),
	precio_noche INTEGER,
	estado VARCHAR(20)
	);
	
	SELECT * FROM Habitaciones;

-- C6. Ingresar al menos 5 habitaciones

	INSERT INTO Habitaciones (numero_habitacion,tipo_habitacion,precio_noche,estado)
	VALUES (123,'Individual',45000,'Disponible'),
	(134,'Doble',65000,'Ocupada'), (145,'Suite',95000,'Ocupada'),
	(156,'Familiar',85000,'Disponible'), (167,'Matrimonial',70000,'Disponible');

	SELECT * FROM Habitaciones;

-- C7. Vincular información.  

-- Se pide: datos de la habitación (Tabla2) con visualizando 
-- el nombre del huésped (Tabla 1)
-- Tengo la misma información, número_habitación


	ALTER TABLE Hotel
	ADD CONSTRAINT fk_habitacion
	FOREIGN KEY (numero_habitacion)
	REFERENCES Habitaciones(numero_habitacion);
	
	ALTER TABLE Habitaciones
	ADD CONSTRAINT uq_numero_habitacion
	UNIQUE (numero_habitacion);

-- ERROR Al ejecutar la referencia me sale que el número de 
-- habitación 189 no existe no está presente. 
-- Exite en una sola tabla, lo veo al revisar Hotel, es de Valentina.

	SELECT * FROM Hotel;
	SELECT * FROM Habitaciones;
	
	INSERT INTO Habitaciones (numero_habitacion,tipo_habitacion,precio_noche,estado)
	VALUES (178,'Suite',98000,'Disponible'),(189,'Doble',65000,'Disponible');
	
	ALTER TABLE Hotel
	ADD CONSTRAINT fk_habitacion
	FOREIGN KEY (numero_habitacion)
	REFERENCES Habitaciones(numero_habitacion);

	SELECT * FROM Hotel;

-- Mostrar información

	SELECT Hotel.nombre_huesped, Habitaciones.numero_habitacion, 
	Habitaciones.tipo_habitacion,Habitaciones.precio_noche
	FROM Hotel, Habitaciones
	WHERE Hotel.numero_habitacion = Habitaciones.numero_habitacion;
