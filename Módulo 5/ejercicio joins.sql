--CONSULTA 2:

SELECT
m.nombre,
m.especialidad,
c.numero_consulta,
c.piso,
c.estado
FROM Medicos m, Consultas c
WHERE m.numero_consulta = c.numero_consulta;

-- JOIN
SELECT
m.nombre,
m.especialidad,
c.numero_consulta,
c.piso,
c.estado
FROM Medicos m
JOIN Consultas c
	ON m.numero_consulta = c.numero_consulta;

    SELECT
    p.nombre AS paciente,
    p.edad,
    m.nombre AS medico,
    m.especialidad,
    c.numero_consulta,
    c.piso,
    ci.fecha_atencion,
    ci.estado
FROM Citas ci
INNER JOIN Pacientes p
    ON ci.id_paciente = p.id_paciente
INNER JOIN Medicos m
    ON ci.id_medico = m.id_medico
INNER JOIN Consultas c
    ON ci.id_consulta = c.id_consulta
WHERE ci.estado = 'Programada'
AND p.edad >= 60
AND c.piso = 1;

--CONSULTA 3 join:
SELECT
    p.nombre AS paciente,
    p.edad,
    m.nombre AS medico,
    m.especialidad,
    c.numero_consulta,
    c.piso,
    ci.fecha_atencion,
    ci.estado
FROM Citas ci
INNER JOIN Pacientes p
ON ci.id_paciente = p.id_paciente
AND p.edad <= 60
INNER JOIN Medicos m
ON ci.id_medico = m.id_medico
INNER JOIN Consultas c
ON ci.id_consulta = c.id_consulta
AND c.piso = 1
AND ci.estado = 'Programada';