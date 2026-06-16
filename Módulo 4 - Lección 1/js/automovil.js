class Automovil {
  #velocidad;

  constructor() {
    this.#velocidad = 0;
  }

  acelerar(cantidad) {
    this.#velocidad = Math.min(this.#velocidad + cantidad, 250);
  }

  frenar(cantidad) {
    this.#velocidad = Math.max(this.#velocidad - cantidad, 0);
  }

  getVelocidad() {
    return this.#velocidad;
  }
}
