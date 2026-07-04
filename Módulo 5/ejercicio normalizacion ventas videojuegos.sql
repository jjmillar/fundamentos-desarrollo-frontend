CREATE TABLE clientes (
	id_cliente SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	telefono VARCHAR(20),
	ciudad VARCHAR(40)
);

CREATE TABLE ventas (
	id_venta SERIAL PRIMARY KEY,
	fecha DATE NOT NULL,
	id_cliente INT NOT NULL,
	total INT NOT NULL,
	FOREIGN KEY (id_cliente)
	REFERENCES clientes(id_cliente)
);

CREATE TABLE productos (
	id_producto SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	precio INT NOT NULL
);

CREATE TABLE detalle_venta (
	id_detalle SERIAL PRIMARY KEY,
	id_venta INT NOT NULL,
	id_producto INT NOT NULL,
	cantidad INT NOT NULL,
	subtotal INT NOT NULL,
	FOREIGN KEY (id_venta)
	REFERENCES ventas(id_venta),
	FOREIGN KEY (id_producto)
	REFERENCES productos(id_producto)
);