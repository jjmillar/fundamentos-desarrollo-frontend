-- ====================================================================
-- ACTIVIDAD 4 - RESOLUCIÓN DE EJERCICIO DE FINANZAS PERSONALES
-- ====================================================================
-- Este archivo contiene la creación de la tabla, la inserción de los
-- datos iniciales y la resolución detallada de las 10 preguntas planteadas
-- en la guía del ejercicio.
-- ====================================================================

-- --------------------------------------------------------------------
-- PUNTO DE PARTIDA: CREACIÓN DE TABLA E INSERCIÓN DE DATOS INICIALES
-- (Basado en actividad4.sql)
-- --------------------------------------------------------------------

DROP TABLE IF EXISTS finanzas_personales CASCADE;

CREATE TABLE finanzas_personales
(
    nombre character varying(20) COLLATE pg_catalog."default" NOT NULL,
    me_debe integer,
    cuotas_cobrar integer,
    le_debo integer,
    cuotas_pagar integer,
    CONSTRAINT finanzas_personales_pkey PRIMARY KEY (nombre)
);

-- Inserción de los registros iniciales
INSERT INTO finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar)
VALUES ('tía carmen', 0, 0, 5000, 1);

INSERT INTO finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar)
VALUES ('papá', 0, 0, 15000, 3);

INSERT INTO finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar)
VALUES ('nacho', 10000, 2, 7000, 1);

INSERT INTO finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar)
VALUES ('almacén esquina', 0, 0, 13000, 2);

INSERT INTO finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar)
VALUES ('vicios varios', 0, 0, 35000, 35);

INSERT INTO finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar)
VALUES ('compañero trabajo', 50000, 5, 0, 0);

-- Visualización de la tabla base inicial
SELECT * FROM finanzas_personales;


-- ====================================================================
-- RESOLUCIÓN DE CONSULTAS Y OPERACIONES (PREGUNTAS 1 A 10)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. ¿A quién(es) le debe más dinero y cuánto?
-- Explicación: Buscamos la fila o filas donde el valor de 'le_debo' sea 
-- igual al máximo valor existente en dicha columna.
-- --------------------------------------------------------------------
SELECT 
    nombre, 
    le_debo AS total_deuda_maxima
FROM finanzas_personales
WHERE le_debo = (SELECT MAX(le_debo) FROM finanzas_personales);


-- --------------------------------------------------------------------
-- 2. ¿Quién(es) le debe más dinero a ud. y cuánto?
-- Explicación: Buscamos la fila o filas donde el valor de 'me_debe' sea 
-- igual al máximo valor existente en dicha columna.
-- --------------------------------------------------------------------
SELECT 
    nombre, 
    me_debe AS total_por_cobrar_maximo
FROM finanzas_personales
WHERE me_debe = (SELECT MAX(me_debe) FROM finanzas_personales);


-- --------------------------------------------------------------------
-- 3. ¿Cuánto dinero debe en total?
-- Explicación: Sumamos toda la columna 'le_debo'.
-- --------------------------------------------------------------------
SELECT 
    SUM(le_debo) AS total_dinero_adeudado
FROM finanzas_personales;


-- --------------------------------------------------------------------
-- 4. ¿Cuánto dinero debe en promedio?
-- Explicación: Obtenemos el promedio de la columna 'le_debo'. 
-- Se incluye el promedio general y el promedio solo de las personas a 
-- las que efectivamente se les debe (le_debo > 0).
-- --------------------------------------------------------------------
SELECT 
    ROUND(AVG(le_debo), 2) AS promedio_deuda_general,
    ROUND(AVG(le_debo) FILTER (WHERE le_debo > 0), 2) AS promedio_deuda_activa
FROM finanzas_personales;


-- --------------------------------------------------------------------
-- 5. Suponiendo que no puede pagar más de una cuota al mes. 
-- ¿Cuántos meses demoraría en saldar su deuda?
-- Explicación: Si se paga un máximo de una cuota mensual por deuda de 
-- forma paralela, el tiempo total para saldar todas las deudas será el 
-- número máximo de cuotas que tiene la deuda más larga.
-- Adicionalmente, se presenta el cálculo convertido a años y meses.
-- --------------------------------------------------------------------
SELECT 
    MAX(cuotas_pagar) AS meses_totales,
    MAX(cuotas_pagar) / 12 AS anos,
    MAX(cuotas_pagar) % 12 AS meses_restantes
FROM finanzas_personales;


-- --------------------------------------------------------------------
-- 6. Suponga que logra cobrar todo lo que le deben en un mismo día y 
-- decide usar todo eso para pagar lo que se pueda de su deuda.
--
-- o ¿A cuánto ascendería su nueva deuda reducida?
-- o ¿Cuánto tendría que pagar mensualmente para pagar todo lo que 
--   resta en las cuotas ya acordadas?
--
-- Explicación: 
-- - La nueva deuda reducida es el total de la deuda menos todo lo cobrado.
-- - La cuota mensual resultante de distribuir la deuda restante entre 
--   el total de cuotas acordadas.
-- --------------------------------------------------------------------
SELECT 
    -- Nueva deuda reducida
    (SUM(le_debo) - SUM(me_debe)) AS nueva_deuda_reducida,
    
    -- Cuota mensual si se distribuye el saldo restante equitativamente 
    -- entre la suma total de cuotas a pagar (42 cuotas en total).
    ROUND((SUM(le_debo) - SUM(me_debe))::numeric / SUM(cuotas_pagar), 2) AS valor_cuota_promedio_restante
FROM finanzas_personales;


-- --------------------------------------------------------------------
-- 7. Insertar un nuevo registro en la tabla: 'pareja'.
-- Explicación: Se agrega el registro correspondiente a la llamada telefónica.
-- Me_debe = 0, cuotas_cobrar = 0, le_debo = 50000, cuotas_pagar = 1.
-- --------------------------------------------------------------------
INSERT INTO finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar)
VALUES ('pareja', 0, 0, 50000, 1);

-- Visualización de control tras la inserción de la pareja
SELECT * FROM finanzas_personales;


-- --------------------------------------------------------------------
-- 8. ¿De cuánto será la cuota a pagar este mes? (Con el nuevo registro)
-- Explicación: La cuota mensual individual de cada deuda es (le_debo / cuotas_pagar).
-- El pago de este mes es la suma de las cuotas mensuales de todas las deudas activas.
-- --------------------------------------------------------------------
SELECT 
    SUM(le_debo / cuotas_pagar) AS cuota_mes_total
FROM finanzas_personales 
WHERE cuotas_pagar > 0;


-- --------------------------------------------------------------------
-- 9. Realizar el update en la tabla.
-- Explicación: La señora del almacén nos permite pagar en 13 cuotas 
-- en lugar de las 2 cuotas acordadas inicialmente. Actualizamos el 
-- registro de 'almacén esquina'.
-- --------------------------------------------------------------------
UPDATE finanzas_personales 
SET cuotas_pagar = 13 
WHERE nombre = 'almacén esquina';

-- Visualización de control tras la actualización del almacén
SELECT * FROM finanzas_personales;


-- --------------------------------------------------------------------
-- 10. Ahora con este pequeño pero importante ajuste ¿De cuánto será 
-- la cuota a pagar este mes?
-- Explicación: Recalculamos la suma de las cuotas mensuales vigentes 
-- después de haber flexibilizado la deuda del almacén de la esquina.
-- --------------------------------------------------------------------
SELECT 
    SUM(le_debo / cuotas_pagar) AS cuota_mes_total_ajustada
FROM finanzas_personales 
WHERE cuotas_pagar > 0;
