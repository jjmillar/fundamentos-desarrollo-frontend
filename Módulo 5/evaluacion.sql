-- ====================================================================
-- EVALUACIÓN DE BASE DE DATOS: TRABAJO CON JOINS Y MODELADO RELACIONAL
-- ====================================================================
-- Este archivo contiene la resolución completa y detallada de la evaluación.
-- Incluye la creación de la base de datos inicial, la resolución de la 
-- PARTE 1 (consultas de JOIN) y el diseño, creación, migración de datos y 
-- consulta final de la PARTE 2 (Modelo Entidad-Relación y Normalización).
-- ====================================================================

-- --------------------------------------------------------------------
-- PARTE 1: DEFINICIÓN DE TABLAS E INSERCIÓN DE DATOS ORIGINALES
-- (Basado en evaluacion.sql)
-- --------------------------------------------------------------------

DROP TABLE IF EXISTS reparto_soltera_otra_vez CASCADE;
CREATE TABLE reparto_soltera_otra_vez
(
    nombre character varying(255) NOT NULL,
    temporadas integer,
    protagonico boolean,
    sueldo integer,
    PRIMARY KEY (nombre)
);

INSERT INTO reparto_soltera_otra_vez (nombre, temporadas, protagonico, sueldo) VALUES 
('Paz Bascuñán', 3, true, 100),
('Pablo Macaya', 3, true, 100),
('Cristián Arriagada', 3, true, 95),
('Josefina Montané', 2, true, 90),
('Loreto Aravena', 3, true, 95),
('Lorena Bosch', 2, true, 90),
('Nicolás Poblete', 2, true, 85),
('Héctor Morales', 3, true, 80),
('Aranzazú Yankovic', 2, true, 80),
('Luis Gnecco', 3, true, 95),
('Catalina Guerra', 3, true, 90),
('Solange Lackington', 2, true, 70),
('Ignacio Garmendia', 2, true, 70),
('Julio González', 3, true, 75),
('Antonella Orsini', 3, true, 70),
('Tamara Acosta', 1, false, 60),
('Silvia Santelices', 1, false, 55),
('Alejandro Trejo', 1, false, 55),
('Grimanesa Jiménez', 1, false, 60);

DROP TABLE IF EXISTS reparto_papi_ricky CASCADE;
CREATE TABLE reparto_papi_ricky
(
    nombre character varying(255) NOT NULL,
    capitulos integer,
    protagonico boolean,
    sueldo integer,
    PRIMARY KEY (nombre)
);

INSERT INTO reparto_papi_ricky (nombre, capitulos, protagonico, sueldo) VALUES 
('Jorge Zabaleta', 135, true, 100),
('Belén Soto', 135, true, 100),
('Tamara Acosta', 135, true, 100),
('María Elena Swett', 135, true, 100),
('Juan Falcón', 135, true, 95),
('Silvia Santelices', 135, true, 85),
('Leonardo Perucci', 135, true, 85),
('Teresita Reyes', 135, true, 80),
('Luis Gnecco', 135, true, 75),
('Alejandro Trejo', 135, true, 65),
('Grimanesa Jiménez', 135, true, 60),
('Remigio Remedy', 135, true, 60),
('María Paz Grandjean', 135, true, 55),
('Héctor Morales', 135, true, 50),
('César Caillet', 135, true, 40),
('José Tomás Guzmán', 135, true, 25),
('Manuel Aguirre', 135, true, 30);


-- ====================================================================
-- RESOLUCIÓN PARTE 1: CONSULTAS JOIN
-- ====================================================================

-- --------------------------------------------------------------------
-- Pregunta 1: Actores que participaron en AMBAS teleseries, su sueldo
-- en cada una y la suma de ambos sueldos, ordenado por nombre del actor.
-- --------------------------------------------------------------------
SELECT 
    s.nombre,
    s.sueldo AS sueldo_en_soltera,
    p.sueldo AS sueldo_en_papi,
    (s.sueldo + p.sueldo) AS sueldo_sumado
FROM reparto_soltera_otra_vez s
INNER JOIN reparto_papi_ricky p ON s.nombre = p.nombre
ORDER BY s.nombre ASC;


-- --------------------------------------------------------------------
-- Pregunta 2: Actores que participaron EXCLUSIVAMENTE en "Soltera otra vez"
-- con un sueldo estrictamente mayor a 90.
-- Explicación: Usamos un NOT EXISTS para excluir a quienes están en 
-- la tabla de Papi Ricky.
-- --------------------------------------------------------------------
SELECT 
    s.nombre,
    s.sueldo
FROM reparto_soltera_otra_vez s
WHERE s.sueldo > 90
  AND NOT EXISTS (
      SELECT 1 
      FROM reparto_papi_ricky p 
      WHERE p.nombre = s.nombre
  )
ORDER BY s.nombre;


-- --------------------------------------------------------------------
-- Pregunta 3: Actores con sueldo inferior a 85 que actuaron en 
-- CUALQUIERA de las dos teleseries, pero NO EN LAS DOS (Diferencia Simétrica).
-- Explicación: Se utiliza un FULL OUTER JOIN para identificar los registros
-- que no tienen coincidencia en la otra tabla (uno de los nombres es NULL).
-- Se filtra que el sueldo sea menor a 85.
-- --------------------------------------------------------------------
SELECT 
    COALESCE(s.nombre, p.nombre) AS nombre,
    COALESCE(s.sueldo, p.sueldo) AS sueldo,
    CASE 
        WHEN s.nombre IS NOT NULL THEN 'Soltera otra vez'
        ELSE 'Papi Ricky'
    END AS teleserie_origen
FROM reparto_soltera_otra_vez s
FULL OUTER JOIN reparto_papi_ricky p ON s.nombre = p.nombre
WHERE (s.nombre IS NULL OR p.nombre IS NULL) -- Excluye a los que están en ambas
  AND COALESCE(s.sueldo, p.sueldo) < 85
ORDER BY nombre;


-- ====================================================================
-- PARTE 2: MODELO ENTIDAD-RELACIÓN Y NORMALIZACIÓN
-- ====================================================================

/*
-----------------------------------------------------------------------
1. EXPLICACIÓN DEL DISEÑO DE BASE DE DATOS Y TERMINACIÓN DEL DIAGRAMA
-----------------------------------------------------------------------
El problema original presentaba redundancia y falta de normalización (tablas separadas por teleserie).
Para mejorar este sistema, implementamos una base de datos relacional normalizada en Tercera Forma Normal (3FN):

A. Tabla "actores" (Entidad Fuerte):
   - Almacena de manera única a cada actor del universo de producción.
   - Atributos:
     * actor_id (PK, SERIAL/INT): Identificador único autoincremental del actor.
     * nombre (VARCHAR(255) UNIQUE NOT NULL): Nombre completo del actor.

B. Tabla "teleseries" (Entidad Fuerte):
   - Almacena los metadatos generales de cada producción televisiva.
   - Atributos:
     * teleserie_id (PK, SERIAL/INT): Identificador único de la teleserie.
     * titulo (VARCHAR(255) UNIQUE NOT NULL): Título comercial (ej. "Soltera otra vez").
     * tipo_duracion (VARCHAR(50) NOT NULL): Indica si la duración se mide en 'temporadas' o 'capitulos'.
     * duracion (INTEGER NOT NULL): Cantidad numérica que representa la duración.

C. Tabla "reparto_actores" (Entidad Débil de Asociación N:M):
   - Tabla de unión (junction table) que resuelve la relación Muchos a Muchos entre Actores y Teleseries.
   - Permite registrar que un actor participa en múltiples teleseries y que cada teleserie cuenta con múltiples actores,
     cada uno con un sueldo y un rol (protagonico) específico para esa producción concreta.
   - Atributos:
     * actor_id (FK -> actores.actor_id): Identificador del actor participante.
     * teleserie_id (FK -> teleseries.teleserie_id): Identificador de la teleserie.
     * protagonico (BOOLEAN NOT NULL): Indica si el rol de ese actor en esa producción específica es protagónico (TRUE) o secundario (FALSE).
     * sueldo (INTEGER NOT NULL): El sueldo negociado de ese actor exclusivamente para esa producción.
     * PRIMARY KEY (actor_id, teleserie_id): Clave primaria compuesta para asegurar que un actor no se repita en una misma teleserie.

CARDINALIDADES Y RELACIONES DEL DIAGRAMA:
- Un actor puede participar en 0 o muchas teleseries -> Relación de actores a reparto_actores: (1 a N).
- Una teleserie puede tener de 1 a muchos actores -> Relación de teleseries a reparto_actores: (1 a N).
- La relación conceptual entre actores y teleseries es de Muchos a Muchos (N:M).
*/

-- --------------------------------------------------------------------
-- 2. SCRIPTS DE CREACIÓN DE TABLAS NORMALIZADAS Y LLAVES
-- --------------------------------------------------------------------

-- Eliminar tablas normalizadas en caso de que existan para permitir re-ejecución limpia
DROP TABLE IF EXISTS reparto_actores CASCADE;
DROP TABLE IF EXISTS actores CASCADE;
DROP TABLE IF EXISTS teleseries CASCADE;

-- Crear Tabla Actores
CREATE TABLE actores (
    actor_id SERIAL,
    nombre character varying(255) NOT NULL,
    CONSTRAINT listado_actores_pkey PRIMARY KEY (actor_id),
    CONSTRAINT actor_nombre_unico UNIQUE (nombre)
);

-- Crear Tabla Teleseries
CREATE TABLE teleseries (
    teleserie_id SERIAL,
    titulo character varying(255) NOT NULL,
    tipo_duracion character varying(50) NOT NULL, -- 'temporadas' o 'capitulos'
    duracion integer NOT NULL,
    CONSTRAINT teleseries_pkey PRIMARY KEY (teleserie_id),
    CONSTRAINT teleserie_titulo_unico UNIQUE (titulo)
);

-- Crear Tabla de Unión: Reparto Actores (Relación N:M con atributos de asociación)
CREATE TABLE reparto_actores (
    actor_id integer NOT NULL,
    teleserie_id integer NOT NULL,
    protagonico boolean NOT NULL,
    sueldo integer NOT NULL,
    CONSTRAINT reparto_actores_pkey PRIMARY KEY (actor_id, teleserie_id),
    CONSTRAINT fk_reparto_actor FOREIGN KEY (actor_id) 
        REFERENCES actores (actor_id) ON DELETE CASCADE,
    CONSTRAINT fk_reparto_teleserie FOREIGN KEY (teleserie_id) 
        REFERENCES teleseries (teleserie_id) ON DELETE CASCADE
);


-- --------------------------------------------------------------------
-- POBLAR LAS NUEVAS TABLAS (MIGRACIÓN DE DATOS DINÁMICA E INTELIGENTE)
-- Explicación: Para evitar la escritura manual propensa a errores y 
-- mantener integridad con los datos de las tablas previas, migramos el 
-- contenido usando sentencias SQL INSERT INTO ... SELECT.
-- --------------------------------------------------------------------

-- A. Insertar las producciones en la tabla 'teleseries'
INSERT INTO teleseries (titulo, tipo_duracion, duracion) VALUES
('Soltera otra vez', 'temporadas', 3),
('Papi Ricky', 'capitulos', 135);

-- B. Insertar todos los actores únicos presentes en ambos repartos originales
INSERT INTO actores (nombre)
SELECT DISTINCT nombre 
FROM (
    SELECT nombre FROM reparto_soltera_otra_vez
    UNION
    SELECT nombre FROM reparto_papi_ricky
) AS todos_los_actores
ORDER BY nombre;

-- C. Poblar la tabla de asociación 'reparto_actores' con la data de "Soltera otra vez"
INSERT INTO reparto_actores (actor_id, teleserie_id, protagonico, sueldo)
SELECT 
    a.actor_id,
    (SELECT teleserie_id FROM teleseries WHERE titulo = 'Soltera otra vez'),
    r.protagonico,
    r.sueldo
FROM reparto_soltera_otra_vez r
INNER JOIN actores a ON r.nombre = a.nombre;

-- D. Poblar la tabla de asociación 'reparto_actores' con la data de "Papi Ricky"
INSERT INTO reparto_actores (actor_id, teleserie_id, protagonico, sueldo)
SELECT 
    a.actor_id,
    (SELECT teleserie_id FROM teleseries WHERE titulo = 'Papi Ricky'),
    r.protagonico,
    r.sueldo
FROM reparto_papi_ricky r
INNER JOIN actores a ON r.nombre = a.nombre;

-- Visualización de control de las nuevas tablas pobladas
SELECT * FROM actores;
SELECT * FROM teleseries;
SELECT * FROM reparto_actores;


-- --------------------------------------------------------------------
-- 3. CONSULTA MULTITABLA (JOIN): Mostrar todas las teleseries y sus
-- actores de reparto asociados (excluyendo roles secundarios, i.e., protagonico = TRUE).
-- --------------------------------------------------------------------
SELECT 
    t.titulo AS teleserie,
    a.nombre AS actor,
    r.protagonico,
    r.sueldo,
    t.tipo_duracion,
    t.duracion
FROM reparto_actores r
INNER JOIN teleseries t ON r.teleserie_id = t.teleserie_id
INNER JOIN actores a ON r.actor_id = a.actor_id
WHERE r.protagonico = TRUE
ORDER BY t.titulo ASC, a.nombre ASC;
