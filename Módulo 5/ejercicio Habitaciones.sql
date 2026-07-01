CREATE TABLE Recepcionistas(
    id_recepcionista SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    turno VARCHAR(20),
    numero_habitacion INT
);

-- INSERTAR REGISTROS MANUALMENTE

INSERT INTO Recepcionistas(nombre, turno, numero_habitacion)
VALUES
('Sofía Martínez','Mañana',101),
('Luis González','Tarde',103),
('Carolina Silva','Noche',104);

-- INSERT INTO ... SELECT

INSERT INTO Recepcionistas(nombre, turno, numero_habitacion)
SELECT
    'Sofía Martínez',
    'Mañana',
    numero_habitacion
FROM Habitaciones
WHERE numero_habitacion >=104;

-- ===========================================
-- CONSULTAS FINALES
-- ===========================================

-- DISTINTOS TURNOS

SELECT  turno
FROM Recepcionistas
GROUP BY turno
ORDER BY turno;

-- DISTINTOS TIPOS DE HABITACIÓN

SELECT DISTINCT tipo_habitacion
FROM Habitaciones;

-- VER TODAS LAS TABLAS

SELECT * FROM Reservas;

SELECT * FROM Habitaciones;

SELECT * FROM Recepcionistas;