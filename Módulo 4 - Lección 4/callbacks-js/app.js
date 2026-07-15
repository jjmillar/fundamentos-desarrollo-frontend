const salida = document.getElementById("salida");

function log(mensaje) {
    salida.textContent = mensaje;
    console.log(mensaje);
}

// -------------------------------
// 1. Validar número con callback
// -------------------------------
function validar_numero(callback) {
    const dato = prompt("Ingrese un número:");

    if (dato === null) {
        log("Validación cancelada por el usuario.");
        return;
    }

    if (!isNaN(dato)) {
        callback("Correcto: ingresó un número válido.");
    } else {
        callback("Error: usted ingresó caracteres incorrectos.");
    }
}

document.getElementById("btnValidar").addEventListener("click", function () {
    validar_numero(function (mensaje) {
        log(mensaje);
    });
});

// -------------------------------
// 2. Sumatoria de números impares
// -------------------------------
function calcular_y_avisar_despues(numero, callback) {
    let sumatoria = 0;
    for (let i = 1; i <= numero; i++) {
        if (i % 2 !== 0) {
            sumatoria += i;
        }
    }

    setTimeout(() => {
        callback(sumatoria);
    }, 5000);
}

document.getElementById("btnEsperar").addEventListener("click", function () {
    const entrada = prompt("Ingrese un número para calcular la sumatoria de impares:");
    if (entrada === null || isNaN(entrada)) {
        log("Debe ingresar un número válido.");
        return;
    }

    const n = parseInt(entrada, 10);
    log("Calculando... espere 5 segundos.");

    calcular_y_avisar_despues(n, function (resultado) {
        log(`El valor de la sumatoria es ${resultado}. Este resultado se obtuvo hace 5 segundos`);
    });
});

// -------------------------------
// 3. Sumatorias sucesivas
// -------------------------------
function calcular_y_avisar_dependiendo(numero, callback, callback_error) {
    let total = 0;

    for (let k = 1; k <= numero; k++) {
        let parcial = 0;
        for (let i = 1; i <= k; i++) {
            parcial += i;
        }
        total += parcial;
    }

    if (total < 1000) {
        callback(`Las sumatorias sucesivas de ${numero} es ${total}`);
    } else {
        callback_error(
            `El número sobrepasa el objetivo de la función. Resultado obtenido: ${total}`
        );
    }
}

document.getElementById("btnSucesivas").addEventListener("click", function () {
    const entrada = prompt("Ingrese un número para calcular las sumatorias sucesivas:");
    if (entrada === null || isNaN(entrada)) {
        log("Debe ingresar un número válido.");
        return;
    }

    const n = parseInt(entrada, 10);

    calcular_y_avisar_dependiendo(
        n,
        function (mensaje) {
            log(mensaje);
        },
        function (mensajeError) {
            log(mensajeError);
        }
    );
});
