const secreto = Math.floor(Math.random() * 10) + 1;
const maxIntentos = 3;
let usados = [];
let intentosRestantes = maxIntentos;

const historialEl = document.getElementById("historial");
const boton = document.getElementById("jugarBtn");

boton.disabled = true;

function yaUsado(numero, lista) {
    return lista.includes(numero);
}

function mostrarHistorial() {
    historialEl.innerHTML = usados.length
        ? "Intentos: " + usados.join(", ")
        : "Historial: -";
}

function pedirNumero() {
    let entrada;
    let valido = false;

    // Insistir hasta que sea 1..10
    while (!valido) {
        entrada = prompt("Ingresá un número del 1 al 10:");

        if (entrada === null) {
            alert("Juego cancelado. Volvé a jugar cuando quieras.");
            boton.disabled = false;
            return null;
        }

        const n = parseInt(entrada, 10);

        if (isNaN(n) || n < 1 || n > 10) {
            alert("Número fuera de rango. Solo se permiten valores entre 1 y 10.");
            continue;
        }

        valido = true;
        return n;
    }
}

function jugar() {
    boton.disabled = true;
    usados = [];
    intentosRestantes = maxIntentos;
    mostrarHistorial();
    historialEl.innerHTML = "Intentos: -";

    console.log("Número secreto:", secreto);

    while (intentosRestantes > 0) {
        const numero = pedirNumero();
        if (numero === null) return;

        if (yaUsado(numero, usados)) {
            alert("Ese número ya lo usaste. Elegí otro sin perder el intento.");
            continue;
        }

        usados.push(numero);
        mostrarHistorial();

        if (numero === secreto) {
            alert("¡Adivinaste! 🎉");
            console.log("¡Ganaste en", usados.length, "intento(s)!");
            boton.disabled = false;
            return;
        }

        intentosRestantes--;
        if (intentosRestantes > 0) {
            alert("Incorrecto. Te quedan " + intentosRestantes + " intento(s).");
        }
    }

    alert("Sin aciertos. El número era: " + secreto);
    console.log("Perdiste. El número era:", secreto);
    boton.disabled = false;
}

boton.addEventListener("click", jugar);
