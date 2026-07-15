-- ============================================================
-- Base de datos: Conductores y Automóviles
-- ============================================================

DROP TABLE IF EXISTS automoviles;
DROP TABLE IF EXISTS conductores;
DROP SEQUENCE IF EXISTS seq_conductor_id;
DROP SEQUENCE IF EXISTS seq_auto_id;

CREATE TABLE conductores (
    id_conductor INT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    edad INT NOT NULL CHECK (edad BETWEEN 18 AND 85)
);

CREATE TABLE automoviles (
    id_auto INT PRIMARY KEY,
    marca VARCHAR(255),
    patente VARCHAR(255) NOT NULL UNIQUE,
    id_conductor INT,
    nombre_conductor VARCHAR(255),
    CONSTRAINT fk_automovil_conductor
        FOREIGN KEY (id_conductor)
        REFERENCES conductores(id_conductor)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE SEQUENCE seq_conductor_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_auto_id START WITH 1 INCREMENT BY 1;

INSERT INTO conductores (id_conductor, nombre, edad) VALUES (1, 'Don Pepe', 55);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (2, 'Pedro', 25);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (3, 'Maria', 33);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (4, 'Francisco', 19);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (5, 'Camilo', 29);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (6, 'Andres', 35);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (7, 'Mario', 48);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (8, 'Felipe', 33);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (9, 'Paulina', 30);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (10, 'Heriberto', 45);
INSERT INTO conductores (id_conductor, nombre, edad) VALUES (11, 'Manuel', 50);

INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (1, 'Ford', 'HXJH55', 8, 'Felipe');
INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (2, 'Toyota', 'HLSA26', 2, 'Pedro');
INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (3, 'Mercedes', 'JFTS47', 3, 'Maria');
INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (4, 'Chevrolet', 'RTPP97', 4, 'Francisco');
INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (5, 'Nissan', 'SDTR51', 1, 'Don Pepe');
INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (6, 'Mazda', 'RDCS19', 4, 'Francisco');
INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (7, 'Kia', 'KDTZ28', 1, 'Don Pepe');
INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (8, 'Jeep', 'FFDF88', 9, 'Paulina');
INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (9, 'Suzuki', 'DRTS41', 10, 'Heriberto');
INSERT INTO automoviles (id_auto, marca, patente, id_conductor, nombre_conductor) VALUES (10, 'Honda', 'BXVZ67', 11, 'Manuel');
