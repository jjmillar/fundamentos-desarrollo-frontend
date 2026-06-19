let arreglo = [];

function ingreso() {
    for(let i=0; i < 3; i++){
        arreglo.push(parseFloat(prompt(`Ingrese el número ${i+1}/3: `)));
    }
}

function burbuja(){               

    alert(arreglo);

    /*for(let i = 0; i < arreglo.length - 1; i++) {
        for(let j = i + 1; j < arreglo.length; j++) {
            if (arreglo[j] > arreglo[i]) {
                let aux = arreglo[i];
                arreglo[i] = arreglo[j];
                arreglo[j] = aux;
            }
        }
    }*/

    let i = 0;
    do {

        let j = i + 1;
        do {

            if (arreglo[j] > arreglo[i]) {
                let aux = arreglo[i];
                arreglo[i] = arreglo[j];
                arreglo[j] = aux;
            }

            j++;
        } while (j < arreglo.length);
        
        i++;
    } while (i < arreglo.length - 1);

    alert(arreglo);
}

function mayor() {
    if (arreglo[0] === arreglo[arreglo.length - 1]) {
        alert("Todos los números son iguales");
    } else {
        alert("No todos los números son iguales");
    }
}

function ciclos() {
    let i;

    for(i=1; i <= 10; i++) {
        console.log(i);
    }

    i = 1;
    while(i <= 10){
        console.log(i);

        i++;
    }

    i = 1;
    do {
        console.log(i);

        i++;
    } while(i <= 10);
}

function comparacion_entre_ciclos() {

    numero = Number(prompt("Ingrese un número"));
    while (numero !== 0) {
        console.log(numero);

        numero = Number(prompt("Ingrese un número"));
    }

    do {
        numero = Number(prompt("Ingrese un número"));

        console.log(numero);
    } while(numero !== 0);

}