const campos = [
  { id: "nombre", nombre: "Nombre" },
  { id: "direccion", nombre: "Dirección" },
  { id: "email", nombre: "Email" },
  { id: "fono", nombre: "Fono" },
];

function validarFormulario() {
  let vacios = [];

  for (let i = 0; i < campos.length; i++) {
    let input = document.getElementById(campos[i].id);

    if (input.value.trim() === "") {
      vacios.push(campos[i].nombre);
      input.classList.add("is-invalid");
    } else {
      input.classList.remove("is-invalid");
    }
  }

  mostrarResultado(vacios);
}

function mostrarResultado(campos) {
  let resultado = document.getElementById("resultado");

  if (campos.length > 0) {
    resultado.innerHTML =
      "<div class='alert alert-danger'>" +
      "<strong>Campos vacíos:</strong> " +
      campos.join("<br>") +
      "</div>";
  } else {
    resultado.innerHTML =
      "<div class='alert alert-success'>" + "Formulario enviado!" + "</div>";
  }
}

function vaciarFormulario() {
  for (let i = 0; i < campos.length; i++) {
    let input = document.getElementById(campos[i].id);

    input.value = "";
    input.classList.remove("is-invalid");
  }

  document.getElementById("resultado").innerHTML = "";
}
