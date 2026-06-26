-- Se crea la tabla de productos
CREATE TABLE productos (
	id_producto SERIAL PRIMARY KEY,
	nombre VARCHAR (100), -- Duda por el NOT NULL.
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

-- Eliminaremos algunos productos que ya no se venden
DELETE FROM productos WHERE id_producto IN (1,2,3);

-- Revisamos que los productos se hayan eliminado
SELECT * FROM productos;

-- Modificamos el stock y precio de algunos productos
UPDATE productos SET precio = 10000 WHERE id_producto = 4; -- Se actualiza el precio del shampoo que deberia quedar en $10.000
UPDATE productos SET stock = productos.stock - 3 WHERE id_producto = 5; -- Se disminuye el stock de Balsamos, quedando en 47

-- Se Consulta para verificar que las modificaciones se hayan aplicado
SELECT * FROM productos ORDER BY id_producto;



