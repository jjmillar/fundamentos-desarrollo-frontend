-- Producto Cartesiano
SELECT 	m.nombre AS Médico,
		c.numero_consulta AS Consulta
FROM 	medicos m, consultas c
WHERE	m.numero_consulta = c.numero_consulta;

-- JOIN
SELECT  m.nombre AS Médico,
		c.numero_consulta AS Consulta
FROM 	medicos m
INNER JOIN 	consultas c
ON		m.numero_consulta = c.numero_consulta;

-- Producto Cartesiano
SELECT
    p.nombre AS paciente, p.rut, p.telefono, m.nombre AS medico, m.especialidad, c.numero_consulta,
    c.piso, ci.fecha_atencion, ci.estado
FROM citas ci, pacientes p, medicos m, consultas c
WHERE ci.id_paciente = p.id_paciente
AND ci.id_medico = m.id_medico
AND ci.id_consulta = c.id_consulta;

-- JOINs
SELECT
    p.nombre AS paciente, p.rut, p.telefono, m.nombre AS medico, m.especialidad, c.numero_consulta,
    c.piso, ci.fecha_atencion, ci.estado
FROM citas ci
INNER JOIN pacientes p
	ON ci.id_paciente = p.id_paciente
INNER JOIN medicos m
	ON ci.id_medico = m.id_medico
INNER JOIN consultas c
	ON ci.id_consulta = c.id_consulta;

    -- Intersección entre tablas
SELECT  m.nombre AS Médico,
		c.numero_consulta AS Consulta
FROM 	medicos m
INNER JOIN 	consultas c
ON		m.numero_consulta = c.numero_consulta;

-- Intersección entre tablas + los registros que se encuentran solo en la primera tabla 
SELECT  m.nombre AS Médico,
		c.numero_consulta AS Consulta
FROM 	medicos m
LEFT JOIN 	consultas c
ON		m.numero_consulta = c.numero_consulta;

-- Intersección entre tablas + los registros que se encuentran solo en la segunda tabla
SELECT  m.nombre AS Médico,
		c.numero_consulta AS Consulta
FROM 	medicos m
RIGHT JOIN 	consultas c
ON		m.numero_consulta = c.numero_consulta;

-- Intersección entre tablas + los registros que se encuentran solo en la primera tabla + los registros que 
-- se encuentran solo en la segunda tabla 
SELECT  m.nombre AS Médico,
		c.numero_consulta AS Consulta
FROM 	medicos m
FULL JOIN 	consultas c
ON		m.numero_consulta = c.numero_consulta;