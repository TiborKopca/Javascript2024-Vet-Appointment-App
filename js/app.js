//SELECTORS
const pacienteInput = document.querySelector("#paciente");
const propietarioInput = document.querySelector("#propietario");
const emailInput = document.querySelector("#email");
const fechaInput = document.querySelector("#fecha");
const sintomasInput = document.querySelector("#sintomas");

const formulario = document.querySelector("#formulario-cita");
const formularioInput = document.querySelector(
  '#formulario-cita input[type="submit"]'
);
const contenedorCitas = document.querySelector("#citas");

//EVENTS
pacienteInput.addEventListener("change", datosCita);
propietarioInput.addEventListener("change", datosCita);
emailInput.addEventListener("change", datosCita);
fechaInput.addEventListener("change", datosCita);
sintomasInput.addEventListener("change", datosCita);

formulario.addEventListener("submit", submitCita);

document.addEventListener("DOMContentLoaded", cargarDatosLocalStorage);

let editando = false;

//OBJECT LITERAL OF APPOINTMENT
const citaObj = {
  id: generarId(),
  paciente: "",
  propietario: "",
  email: "",
  fecha: "",
  sintomas: "",
};

class Notificacion {
  constructor({ texto, tipo }) {
    this.texto = texto;
    this.tipo = tipo;
    this.mostrar();
  }

  mostrar() {
    //NOTIFICATION CREATION + GENERAL STYLES, 'alert' class is used to remove duplicate notifications
    const alerta = document.createElement("DIV");
    alerta.classList.add(
      "text-center",
      "w-full",
      "p-3",
      "text-white",
      "my-5",
      "alert",
      "uppercase",
      "font-bold",
      "text-sm"
    );

    //DUPLICATE ALERTS REMOVAL, if there is a previous notification with the class 'alert', it will be removed
    const alertaPrevia = document.querySelector(".alert");
    alertaPrevia?.remove();

    //ERROR / NO ERROR CLASSES
    this.tipo === "error"
      ? alerta.classList.add("bg-red-500")
      : alerta.classList.add("bg-green-500");

    //ERROR MESSAGE TEXT TO THE ELEMENT
    alerta.textContent = this.texto;

    //INSERTING IN THE DOM
    formulario.parentElement.insertBefore(alerta, formulario);

    //REMOVE AFTER 3 SECONDS
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

class AdminCitas {
  constructor() {
    this.citas = [];
  }
  //ADDING A CITA WITH A SPREAD OPERATOR / OR WITH A PUSH METHOD
  agregar(cita) {
    this.citas = [...this.citas, cita];
    this.mostrar();
  }

  editar(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
    this.mostrar();
  }

  eliminar(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
    //add code to remove the object from Local Storage
    this.mostrar();
  }

  mostrar() {
    // Limpiar el HTML
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }

    // Si hay citas
    if (this.citas.length === 0) {
      contenedorCitas.innerHTML =
        '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>';
      return;
    }

    // Generando las citas
    this.citas.forEach((cita) => {
      const divCita = document.createElement("div");
      divCita.classList.add(
        "mx-5",
        "my-10",
        "bg-white",
        "shadow-md",
        "px-5",
        "py-10",
        "rounded-xl",
        "p-3",
        "glass"
      );

      const paciente = document.createElement("p");
      paciente.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;

      const propietario = document.createElement("p");
      propietario.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;

      const email = document.createElement("p");
      email.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;

      const fecha = document.createElement("p");
      fecha.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;

      const sintomas = document.createElement("p");
      sintomas.classList.add(
        "font-normal",
        "mb-3",
        "text-gray-700",
        "normal-case"
      );
      sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

      // Botones de Eliminar y editar
      const btnEditar = document.createElement("button");
      btnEditar.classList.add(
        "py-2",
        "px-10",
        "bg-teal-500",
        "hover:bg-teal-500",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2",
        "btn-editar"
      );
      btnEditar.innerHTML =
        'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
      const clone = structuredClone(cita);
      btnEditar.onclick = () => cargarEdicion(clone);

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add(
        "py-2",
        "px-10",
        "bg-red-600",
        "hover:bg-red-700",
        "text-white",
        "font-bold",
        "uppercase",
        "rounded-lg",
        "flex",
        "items-center",
        "gap-2"
      );
      btnEliminar.innerHTML =
        'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      btnEliminar.onclick = () => this.eliminar(cita.id);

      const contenedorBotones = document.createElement("DIV");
      contenedorBotones.classList.add("flex", "justify-between", "mt-10");

      contenedorBotones.appendChild(btnEditar);
      contenedorBotones.appendChild(btnEliminar);

      // Agregar al HTML
      divCita.appendChild(paciente);
      divCita.appendChild(propietario);
      divCita.appendChild(email);
      divCita.appendChild(fecha);
      divCita.appendChild(sintomas);
      divCita.appendChild(contenedorBotones);
      contenedorCitas.appendChild(divCita);
    });
  }
}

//PASSING DATA ON INPUT CHANGE TO OBJECT 'citaObj' DYNAMICALLY ACORDING THE NAME OF THE INPUT FIELD
function datosCita(e) {
  //this is the name of each of the input fields in the form, on each change of the input field, the data is passed to the object 'citaObj'
  // console.log(e.target.name)
  // console.log(e.target.value)

  //FILLING EACH PROPERTY OF THE OBJECT 'citaObj' WITH THE DATA OF EACH INPUT FIELD VALUES
  citaObj[e.target.name] = e.target.value;
}

//INSTANCIATING THE ADMIN CITAS CLASS
const citas = new AdminCitas();
console.log(citas);

//SUBMITTING THE FORM
function submitCita(e) {
  e.preventDefault();

  //FORM VALIDATION USING OBJECT DESTRUCTURING
//   const { paciente, propietario, email, fecha, sintomas } = citaObj;
//   if (!paciente || !propietario || !email || !fecha || !sintomas) {
//     new Notificacion({
//       texto: "Todos los campos son obligatorios(destructuring)",
//       tipo: "error",
//     });
//     return;
//   }

//VALIDATION OF ALL INPUT FIELDS OF THE FORM WITH .some() ==> returns true/false
  if (Object.values(citaObj).some(validateEmpty)) {
    new Notificacion({
      texto: "Todos los campos son obligatorios",
      tipo: "error",
    });
    return;
  }

//VALIDATION OF THE DATE FIELD
let fechaActual = new Date()
// console.log(`Datenow: ${(fechaActual.setHours(0,0,0,0))}`) //Datenow: 1721907603076
let fechaDeseada = new Date(citaObj.fecha)
// console.log(`Fecha: ${fechaDeseada.setHours(0,0,0,0)}`) //Fecha: 1721080800000

  if(fechaActual > fechaDeseada){
    new Notificacion({
      texto: "La fecha puede ser creada solo en el futuro",
      tipo: "error",
    });
    return;
  }

  if (editando) {
    citas.editar({ ...citaObj });
    new Notificacion({
      texto: "Guardado Correctamente",
      tipo: "exito",
    });
  } else {
    citas.agregar({ ...citaObj });
    new Notificacion({
      texto: "Paciente Registrado",
      tipo: "exito",
    });
  }

  //CLEARING THE FORM
  formulario.reset();
  
  //STORE DATA IN LOCAL STORAGE
  guardarDatosLocalStorage();

  reiniciarObjetoCita();

  formularioInput.value = "Registrar Paciente";
  editando = false;
}
//VALIDATION FUNCTIONS
function validateEmpty(valor){
    return valor.trim() === "";
}

//CLEAR OBJECT
function reiniciarObjetoCita() {
  // Reiniciar el objeto
  // citaObj.id = generarId()
  // citaObj.paciente = '';
  // citaObj.propietario = '';
  // citaObj.email = '';
  // citaObj.fecha = '';
  // citaObj.sintomas = '';

  Object.assign(citaObj, {
    id: generarId(),
    paciente: "",
    propietario: "",
    email: "",
    fecha: "",
    sintomas: "",
  });
}

function generarId() {
  return Math.random().toString(36).substring(2) + Date.now();
}

function cargarEdicion(cita) {
  Object.assign(citaObj, cita);

  pacienteInput.value = cita.paciente;
  propietarioInput.value = cita.propietario;
  emailInput.value = cita.email;
  fechaInput.value = cita.fecha;
  sintomasInput.value = cita.sintomas;

  editando = true;

  formularioInput.value = "Guardar Cambios";
}

//LOADING DATA FROM LOCAL STORAGE
function cargarDatosLocalStorage() {
  //reads the JSON object from local storage
  const citasfromJSON = JSON.parse(localStorage.getItem("citas")) || [];
  console.log(citasfromJSON); //object

  if (citasfromJSON !== null) {
    //for each object in the array
    for (index in citasfromJSON) {
      // console.log(citasfromJSON[index]);
      let cita = citasfromJSON[index];
      citas.agregar({ ...cita });
      new Notificacion({
        texto: "Mostrando Datos Local Storage",
        tipo: "exito",
      });
    }
  } else {
    console.log("No hay Citas");
  }
  console.log(citas);

  //   console.log(dataLoaded);
  // citas.forEach(cita => {
  //     citas.push(cita)
  // })
}

//SAVING DATA TO LOCAL STORAGE
function guardarDatosLocalStorage() {
  //stores objects of citas in an an array
  localStorage.setItem("citas", JSON.stringify(citas.citas));

  //make code to read existing and add new data
}
