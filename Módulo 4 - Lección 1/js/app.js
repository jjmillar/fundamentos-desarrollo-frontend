const auto = new Automovil();

const velocidad = document.getElementById("velocidad");
const cantidad = document.getElementById("cantidad");

function actualizarVista() {
  velocidad.textContent = `Velocidad: ${auto.getVelocidad()} Km/h`;
}

function acelerar() {
  auto.acelerar(Number(cantidad.value));
  actualizarVista();
}

function frenar() {
  auto.frenar(Number(cantidad.value));
  actualizarVista();
}
    