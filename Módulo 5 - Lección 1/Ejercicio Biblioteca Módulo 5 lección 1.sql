CREATE TABLE Autores (
    id_autor INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50)
);

CREATE TABLE Libros (
    id_libro INT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    anio_publicacion INT,
    id_autor INT,
    FOREIGN KEY (id_autor) REFERENCES Autores(id_autor)
);

ALTER TABLE Autores
ADD fecha_nacimiento DATE;

ALTER TABLE Libros
ADD genero VARCHAR(50);

INSERT INTO Autores
(id_autor, nombre, nacionalidad, fecha_nacimiento)
VALUES
(1, 'Miguel de Cervantes', 'Española', '1547-09-29'),s
(2, 'Jane Austen', 'Inglesa', '1775-12-16'),
(3, 'Victor Hugo', 'Francesa', '1802-02-26'),
(4, 'Fiodor Dostoyevski', 'Rusa', '1821-11-11'),
(5, 'Gabriel Garcia Marquez', 'Colombiana', '1927-03-06'),
(6, 'J. K. Rowling', 'Britanica', '1965-07-31');

INSERT INTO Libros
(id_libro, titulo, anio_publicacion, genero, id_autor)
VALUES
(101, 'Don Quijote de la Mancha', 1605, 'Novela', 1),
(102, 'Orgullo y prejuicio', 1813, 'Romance', 2),
(103, 'Los Miserables', 1862, 'Novela historica', 3),
(104, 'Crimen y castigo', 1866, 'Novela psicologica', 4),
(105, 'Cien años de soledad', 1967, 'Realismo magico', 5),
(106, 'Harry Potter y la piedra filosofal', 1997, 'Fantasia', 6);

SELECT * FROM Autores;
SELECT * FROM Libros;

SELECT
    L.id_libro,
    L.titulo,
    L.genero,
    L.anio_publicacion,
    A.nombre AS autor
FROM Libros L
INNER JOIN Autores A
ON L.id_autor = A.id_autor;

SELECT
    L.titulo,
    A.nombre AS autor
FROM Libros L
INNER JOIN Autores A
ON L.id_autor = A.id_autor
ORDER BY A.nombre;