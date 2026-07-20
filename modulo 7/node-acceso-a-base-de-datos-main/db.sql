-- Crear base de datos de nombre: empresa

-- 2. Crear la tabla de nombre: empleados

CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    sueldo INTEGER NOT NULL
);

-- 3. Agregar algunos registros a la tabla empleados 

INSERT INTO empleados (nombre, cargo, sueldo)
VALUES
    ('Ana Torres', 'Desarrolladora', 1200000),
    ('Carlos Soto', 'Diseñador UX', 950000),
    ('María González', 'Jefa de proyectos', 1500000);

SELECT * FROM empleados;