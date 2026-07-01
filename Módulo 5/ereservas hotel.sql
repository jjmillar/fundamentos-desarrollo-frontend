CREATE TABLE reservas (
	id SERIAL PRIMARY KEY,
	nombre_huesped VARCHAR (20)NOT NULL,
	numero_habitacion INTEGER NOT NULL,
	noches_estadia INTEGER NOT NULL,
	estado_reserva BOOLEAN NOT NULL
);
INSERT INTO reservas (nombre_huesped, numero_habitacion, noches_estadia, estado_reserva)
VALUES
('Juan Perez', 101, 3, TRUE),
('María Soto', 205, 5, FALSE),
('Carlos Muñoz', 118, 2, TRUE),
('Ana González', 302, 7, TRUE),
('Diego Rojas', 410, 1, FALSE),
('Camila Díaz', 223, 4, TRUE),
('Pedro Contreras', 315, 6, FALSE),
('Valentina Flores', 127, 2, TRUE);

SELECT * FROM reservas

SELECT
	id,
    nombre_huesped,
    numero_habitacion,
    noches_estadia,
    CASE
        WHEN estado_reserva THEN 'Reservado'
        ELSE 'Cancelado'
    END AS estado_reserva
FROM reservas;

UPDATE reservas
SET estado_reserva = true
WHERE numero_habitacion IN(205, 315);

DELETE FROM reservas WHERE estado_reserva = false;

UPDATE reservas
SET noches_estadia = 4
WHERE numero_habitacion = 302;

UPDATE reservas
SET noches_estadia = 9
WHERE numero_habitacion = 223;

