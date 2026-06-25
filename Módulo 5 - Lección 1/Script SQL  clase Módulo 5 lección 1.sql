
-- Consulta de creación de tabla CLIENTES
CREATE TABLE clientes (
id SERIAL PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
rut VARCHAR(12) NOT NULL,
direccion VARCHAR(100) NOT NULL,
email VARCHAR(75) NOT NULL,
fono1 VARCHAR(15),
fono2 VARCHAR(15),
comuna VARCHAR(50),
pais VARCHAR(50)
);

--Insertamos Datos a la tabla
INSERT INTO clientes (nombre, rut, direccion, email, fono1, comuna, pais) 
VALUES ('Juan', '11111111-1', 'Calle Larga 100', 'juan@gmail.com', '987654321', 'La Serena', 'Chile');

INSERT INTO clientes (nombre, rut, direccion, email, fono1, fono2, comuna, pais) 
VALUES ('maría', '22222222-2', 'Avda. Principal 230', 'maria@gmail.com', '982576474', '981336612', 'Punta Arenas', 'Chile');

INSERT INTO clientes (nombre, rut, direccion, email, fono1, comuna, pais) 
VALUES ('Pedro', '33333333-3', 'Street...', 'pedro@gmail.com', '912367389', 'Chicago', 'EEUU');


-- Esta consulta obtiene todos los registros de la tabla CLIENTES
SELECT * FROM clientes;

/* Mostrar solos los datos en que el pais sea distinto de Chile
   Ordenados por nombre*/
SELECT nombre, rut, direccion, comuna FROM clientes WHERE pais<>'Chile' ORDER BY nombre;

--Se crea una nueva tabla pais
CREATE TABLE pais (
id SERIAL PRIMARY KEY,
nombre VARCHAR(50)
);

--Insertamos Datos a la tabla
INSERT INTO pais (nombre) VALUES ('Chile');

INSERT INTO pais (nombre) VALUES ('EEUU');

-- Revisamos  como quedo
SELECT * FROM pais;

-- Agregamos la columna id_pais a la tabla clientes

ALTER TABLE clientes
ADD COLUMN id_pais INTEGER;


--Actualizar los registros existentes

UPDATE clientes
SET id_pais = 1
WHERE pais = 'Chile';

UPDATE clientes
SET id_pais = 2
WHERE pais = 'EEUU';

/* O se puede usar el Modificar(UPDATE) donde busca el país de cada cliente y guarda su ID en la columna id_pais 
UPDATE clientes
SET id_pais = paises.id
FROM pais paises
WHERE clientes.pais = paises.nombre;
*/
-- Revisamos  como quedo
SELECT * FROM clientes;

-- Eliminar la columna redundante
ALTER TABLE clientes
DROP COLUMN pais;

-- Revisamos  como quedo
SELECT * FROM clientes;

--Se establece la relación entre ambas tablas
ALTER TABLE clientes
ADD CONSTRAINT fk_clientes_pais
FOREIGN KEY (id_pais)
REFERENCES pais(id);

-- Se ingresa un dato erroneo
INSERT INTO clientes (nombre, rut, direccion, email, fono1, comuna, id_pais) 
VALUES ('Manuel', '44444444-4', 'Calle...', 'manuel@gmail.com', '917738272', 'Buenos Aires', 90);

-- Crear primero el país correspondiente

INSERT INTO pais(nombre)
VALUES ('Argentina');

-- Vemos la tabla
SELECT * FROM pais;

-- Agregamos el dato correcto

SELECT * FROM clientes;
INSERT INTO clientes (nombre, rut, direccion, email, fono1, comuna, id_pais) 
VALUES ('Manuel', '44444444-4', 'Calle...', 'manuel@gmail.com', '917738272', 'Buenos Aires', 3);

-- Revisamos  como quedo
SELECT * FROM clientes; 

-- Modificamos el nombre de la tabla
ALTER TABLE pais
RENAME TO paises;

-- Seleccionamos los datos a mostrar de la tabla clientes
SELECT nombre, email, id_pais FROM clientes order by nombre;

--Relacionamos las tablas mostrando el nombre del Pais

SELECT clientes.nombre, clientes.email, paises.nombre 
FROM clientes, paises 
WHERE clientes.id_pais=paises.id -- Se establece cuál es la relación entre las tablas 
ORDER BY clientes.nombre;