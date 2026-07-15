
# Actividad 2/ Clase 13 Julio

Sistema de Control de Agua de un Estanque: Una empresa agrícola utiliza un estanque para almacenar agua destinada al riego de sus cultivos.

Actualmente, el estanque tiene una capacidad máxima de 5.000 litros y comienza con 3.000 litros de agua.

La aplicación deberá permitir registrar el ingreso y el consumo de agua, manteniendo la información almacenada en un archivo JSON.

**Vista 1: Inicio (/)**
Debe mostrar:
Nombre del sistema.
- Capacidad máxima del estanque.
- Cantidad de agua disponible.
- Total de litros ingresados.
- Total de litros consumidos.

Además, debe mostrar un mensaje según el nivel del estanque:
Más de 3.000 litros → Nivel óptimo.
Entre 1.500 y 3.000 litros → Nivel medio.
Menos de 1.500 litros → Nivel crítico.

**Vista 2: Ingresar agua (/ingresar)**
Crear un formulario que solicite:
- Nombre del operador.
- Cantidad de litros a ingresar.

Al enviar el formulario:
Validar que el nombre no esté vacío.
Validar que la cantidad sea mayor que cero.
No permitir superar la capacidad máxima del estanque.
Actualizar el archivo JSON.
Mostrar un mensaje indicando si la operación fue exitosa.

**Vista 3: Consumir agua (/consumir)**
Crear un formulario que solicite:
- Nombre del operador.
- Cantidad de litros consumidos.

Al enviar el formulario:
Validar que el nombre no esté vacío y que la cantidad sea mayor que cero. No permitir consumir más agua de la disponible.
Actualizar el archivo JSON.
Mostrar un mensaje indicando si la operación fue exitosa. 

