DROP TABLE IF EXISTS Director CASCADE;
DROP TABLE IF EXISTS Equipo CASCADE;
DROP TABLE IF EXISTS Jugador CASCADE;
DROP TABLE IF EXISTS Partido CASCADE;

CREATE TABLE Director (
    id_director INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50)
);

CREATE TABLE Equipo (
    id_equipo INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
    ciudad VARCHAR(50),
    id_director INT,
    FOREIGN KEY (id_director) REFERENCES Director(id_director)
);

CREATE TABLE Jugador (
    id_jugador INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
    posicion VARCHAR(50),
    edad INT,
    numero_camiseta INT,
    id_equipo INT,
    FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo)
);

CREATE TABLE Partido (
	id_partido INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	equipo_local INT,
	equipo_visitante INT,
    FOREIGN KEY (equipo_local) REFERENCES Equipo(id_equipo),
    FOREIGN KEY (equipo_visitante) REFERENCES Equipo(id_equipo),
	goles_local INT,
	goles_visitante INT,
	fecha_partido DATE
);

ALTER TABLE Director
ADD fecha_nacimiento DATE;

ALTER TABLE Director
ADD anios_experiencia INT;

ALTER TABLE Equipo
ADD estadio VARCHAR(100);

ALTER TABLE Equipo
ADD anio_fundacion INT;




INSERT INTO Director
(nombre, nacionalidad, fecha_nacimiento, anios_experiencia)
VALUES
('Ricardo Gareca','Argentina','1958-02-10',30),
('Manuel Pellegrini','Chile','1953-09-16',35),
('Marcelo Gallardo','Argentina','1976-01-18',15),
('Pep Guardiola','España','1971-01-18',18),
('Carlo Ancelotti','Italia','1959-06-10',32);

INSERT INTO Equipo
(nombre, ciudad, id_director, estadio, anio_fundacion)
VALUES
('Colo-Colo','Santiago',1,'Monumental',1925),
('Universidad de Chile','Santiago',2,'Estadio Nacional',1927),
('River Plate','Buenos Aires',3,'Más Monumental',1901),
('Manchester City','Manchester',4,'Etihad Stadium',1880),
('Real Madrid','Madrid',5,'Santiago Bernabéu',1902);

INSERT INTO Jugador
(nombre, posicion, edad, numero_camiseta, id_equipo)
VALUES
('Arturo Vidal','Mediocampista',39,23,1),
('Charles Aránguiz','Mediocampista',37,20,2),
('Franco Armani','Arquero',39,1,3),
('Erling Haaland','Delantero',26,9,4),
('Kylian Mbappé','Delantero',27,9,5);

INSERT INTO Partido
(equipo_local, equipo_visitante, goles_local, goles_visitante, fecha_partido)
VALUES
(1, 2, 3, 0, '2025-06-10'),
(3, 2, 1, 2, '2024-02-05'),
(4, 1, 0, 2, '2024-07-22'),
(4, 5, 3, 2, '2026-02-01');

SELECT * FROM Director;
SELECT * FROM Equipo;
SELECT * FROM Jugador;


SELECT
    E.nombre AS equipo,
    E.ciudad,
    E.estadio,
    D.nombre AS director
FROM Equipo E
INNER JOIN Director D
ON E.id_director = D.id_director;


SELECT
    J.nombre AS jugador,
    J.posicion,
    J.edad,
    E.nombre AS equipo
FROM Jugador J
INNER JOIN Equipo E
ON J.id_equipo = E.id_equipo;


SELECT
    EL.nombre AS equipo_local,
    EV.nombre AS equipo_visitante,
    P.goles_local,
    P.goles_visitante,
    P.fecha_partido
FROM Partido P
INNER JOIN Equipo EL
ON P.equipo_local = EL.id_equipo
INNER JOIN Equipo EV
ON P.equipo_visitante = EV.id_equipo;