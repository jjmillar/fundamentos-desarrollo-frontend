-- Creamos la tabla de productos y establecemos PK.
CREATE TABLE productos (
	ID_Producto VARCHAR(10) PRIMARY KEY,
	nombre_producto VARCHAR(100),
	valor_producto int
);

-- Creamos la tabla de Comunas y establecemos PK.
CREATE TABLE comunas (
	ID_Comuna VARCHAR(10) PRIMARY KEY,
	nombre_comuna VARCHAR(100) NOT NULL
);