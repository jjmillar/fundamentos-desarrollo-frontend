CREATE TABLE ventas (
	id SERIAL PRIMARY KEY,
    vendedor VARCHAR(50),
    monto INT
);

INSERT INTO ventas (vendedor, monto) VALUES ('Juan', 800000);
INSERT INTO ventas (vendedor, monto) VALUES ('Juan', 7800000);
INSERT INTO ventas (vendedor, monto) VALUES ('Juan', 130000);
INSERT INTO ventas (vendedor, monto) VALUES ('María', 1000000);
INSERT INTO ventas (vendedor, monto) VALUES ('María', 99000);
INSERT INTO ventas (vendedor, monto) VALUES ('María', 4600000);

SELECT * FROM ventas;

-- Muestra los vendedores (sin repetir)
SELECT DISTINCT vendedor FROM ventas;

-- Muestra los vendedores (sin repetir)
SELECT vendedor FROM ventas GROUP BY vendedor;

-- Muestra todos los montos de las ventas
SELECT monto from ventas;

-- Muestra la suma de los montos de todas las ventas
SELECT SUM(monto) from ventas;

-- Muestra la suma de los montos de todas las ventas agrupadas por vendedor
SELECT SUM(monto), vendedor FROM ventas GROUP BY vendedor;