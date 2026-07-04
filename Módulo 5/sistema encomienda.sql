CREATE TABLE clientes (
	id_cliente SERIAL PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL
);

CREATE TABLE sucursales (
	id_sucursal SERIAL PRIMARY KEY,
	direccion VARCHAR(100),
	telefono VARCHAR(15),
	web VARCHAR(50)	
);

CREATE TABLE encomiendas (
	id_encomienda SERIAL PRIMARY KEY,
	id_cliente INT,
	id_sucursal INT,
	direccion VARCHAR(100) NOT NULL,
	valor INT NOT NULL,
	codigo VARCHAR(15) NOT NULL,
	remitente VARCHAR(100) NOT NULL,
	fecha_envio DATE NOT NULL,
	FOREIGN KEY (id_cliente)
	REFERENCES clientes(id_cliente),
	FOREIGN KEY (id_sucursal)
	REFERENCES sucursales(id_sucursal)
);