-- Se crea la tabla de productos
CREATE TABLE productos (
	id_producto SERIAL PRIMARY KEY,
	nombre VARCHAR (100),
	precio INT,
	stock INT
);

-- Se anhaden productos a la tabla
INSERT INTO productos (nombre, precio, stock) 
VALUES
('Peineta', 5000, 100),
('Cepillo', 6500, 50),
('Pinches', 300, 1500),
('Shampoo', 9000, 50),
('Balsamo', 9500, 50),
('Jabon', 500, 100);

-- Revisamos que la tabla y productos esten correctos
SELECT * FROM productos;

-- Eliminaremos algunos product