-- Muestro todos los registros de la tabla CHOFERES
SELECT * FROM choferes;

-- Modifica el registro con ID = 2 de la tabla CHOFERES, asignando un nuevo valor para el campo TELEFONO
UPDATE choferes SET telefono = 123456789 WHERE id = 2;

-- Muestro únicamente el registro cuyo ID = 2
SELECT * FROM choferes WHERE id = 2;

-- Elimina el registro con ID = 2 de la tabla CHOFERES.
DELETE FROM choferes WHERE id = 2;

-- Agrego un nuevo campo: ESTADO
ALTER TABLE choferes
ADD COLUMN estado BOOLEAN;

-- Actualizo el estado de TODOS los registros a true
UPDATE choferes SET estado = TRUE;

-- En la práctica, los registros importantes no se eliminan, se inhabilitan con un cambio de estado
UPDATE choferes SET estado = FALSE WHERE id = 1;