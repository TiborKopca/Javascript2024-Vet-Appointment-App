//SELECTORS
const pacienteInput = document.querySelector("#paciente");
const propietarioInput = document.querySelector("#propietario");
const emailInput = document.querySelector("#email");
const fechaInput = document.querySelector("#fecha");
const sintomasInput = document.querySelector("#sintomas");

const formulario = document.querySelector("#formulario-cita");
//Selector for the submit button
const formularioInput = document.querySelector(
  '#formulario-cita input[type="submit"]'
);
//Selector for the div container of the appointments
const contenedorCitas = document.querySelector("#citas");

//EVENTS
pacienteInput.addEventListener("change", datosCita);
propietarioInput.addEventListener("change", datosCita);
emailInput.addEventListener("change", datosCita);
fechaInput.addEventListener("change", datosCita);
sintomasInput.addEventListener("change", datosCita);

formulario.addEventListener("submit", submitCita);

document.addEventListener("DOMContentLoaded", cargarDatosLocalStorage);

//AUXILIARY VARIABLE - EDITING
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
  //EDIT EXISTING APPOINTMENT, FIND THE APPOINTMENT OBJECT PASSED, WITH THE ID PROPERTY
  //We pass the new object(data loaded to the form from the array of appointments)
  editar(citaActualizada) {
    //map iterates over each element of the array, and returns a new array with the result of calling the callback function on each element
    this.citas = this.citas.map((cita) =>
      //for each element of the array, we check if the id of the element is the same as the id of the object passed and show it in the DOM with 'mostrar()'
      //if its not the same, we return the element of the array(each element is an object in the array)
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
    editarDatosLocalStorage(citaActualizada);
    this.mostrar();
  }
  //DELETE APPOINTMENT WITH THE ID PASSED
  eliminar(id) {
    // console.log(id);
    //FILTER GENERATES A NEW ARRAY WITHOUT THE ELEMENTS THAT MATCH THE CONDITION
    this.citas = this.citas.filter((cita) => cita.id !== id);
    //DELETE THE APPOINTMENT FROM THE LOCAL STORAGE
    eliminarDatosLocalStorage(id);
    //add code to remove the object from Local Storage
    this.mostrar();
  }
  //SHOW THE APPOINTMENTS IN THE DOM
  mostrar() {
    //CLEAR THE HTML
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }

    //THERE ARE NO APPOINTMENTS => SHOW A MESSAGE
    if (this.citas.length === 0) {
      contenedorCitas.innerHTML =
        '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>';
      return;
    }

    //GENERATE THE APPOINTMENTS from the array
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
        "text-white",
        "normal-case"
      );
      paciente.innerHTML = `<span class="font-bold text-gray-700 uppercase">Paciente: </span> ${cita.paciente}`;

      const propietario = document.createElement("p");
      propietario.classList.add(
        "font-normal",
        "mb-3",
        "text-white",
        "normal-case"
      );
      propietario.innerHTML = `<span class="font-bold text-gray-700 uppercase">Propietario: </span> ${cita.propietario}`;

      const email = document.createElement("p");
      email.classList.add(
        "font-normal",
        "mb-3",
        "text-white",
        "normal-case"
      );
      email.innerHTML = `<span class="font-bold text-gray-700 uppercase">E-mail: </span> ${cita.email}`;

      const fecha = document.createElement("p");
      fecha.classList.add(
        "font-normal",
        "mb-3",
        "text-white",
        "normal-case"
      );
      fecha.innerHTML = `<span class="font-bold text-gray-700 uppercase">Fecha: </span> ${cita.fecha}`;

      const sintomas = document.createElement("p");
      sintomas.classList.add(
        "font-normal",
        "mb-3",
        "text-white",
        "normal-case"
      );
      sintomas.innerHTML = `<span class="font-bold text-gray-700 uppercase">Síntomas: </span> ${cita.sintomas}`;

      //BUTTONS TO DELETE AND EDIT
      //EDIT BUTTON FOR THE APPOINTMENT
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

      //EVENT HANDLER FOR THE EDIT BUTTON ON THE DYNAMICALLY CREATED BUTTON, for each appointment, we clone the object and pass it to the function cargarEdicion
      //without cloning the object, the object data wont be passed to the function cargarEdicion
      //it should work with spread operator too
      const clone = structuredClone(cita);
      btnEditar.onclick = () => cargarEdicion(clone);

      //DELETE BUTTON WITH THE APPOINTMENT ID
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
        'Eliminar <svg fill="none" class="h-5 w-5" viewBox="0 0 24 24"  stroke="white" stroke-width="2" stroke-linejoin="round"><path d="M12.255 10L18.783 3.47251C18.9311 3.32445 19.0485 3.14867 19.1287 2.95521C19.2088 2.76176 19.2501 2.55441 19.2501 2.34501C19.2501 2.13562 19.2088 1.92827 19.1287 1.73482C19.0485 1.54136 18.9311 1.36558 18.783 1.21751C18.635 1.06945 18.4592 0.951997 18.2657 0.871864C18.0723 0.791732 17.8649 0.750488 17.6555 0.750488C17.4461 0.750488 17.2388 0.791732 17.0453 0.871864C16.8519 0.951997 16.6761 1.06945 16.528 1.21751L10 7.74501L3.47253 1.21751C3.17349 0.918482 2.76792 0.750488 2.34503 0.750488C1.92213 0.750488 1.51656 0.918482 1.21753 1.21751C0.918494 1.51655 0.7505 1.92212 0.7505 2.34501C0.7505 2.76791 0.918494 3.17348 1.21753 3.47251L7.74503 10L1.21703 16.5275C1.06896 16.6756 0.951508 16.8514 0.871376 17.0448C0.791244 17.2383 0.75 17.4456 0.75 17.655C0.75 17.8644 0.791244 18.0718 0.871376 18.2652C0.951508 18.4587 1.06896 18.6344 1.21703 18.7825C1.36509 18.9306 1.54087 19.048 1.73433 19.1282C1.92778 19.2083 2.13513 19.2495 2.34453 19.2495C2.55392 19.2495 2.76127 19.2083 2.95472 19.1282C3.14818 19.048 3.32396 18.9306 3.47203 18.7825L10 12.256L16.5275 18.7835C16.839 19.095 17.2475 19.2505 17.655 19.2505C18.0625 19.2505 18.4715 19.095 18.783 18.7835C19.0819 18.4844 19.2499 18.0789 19.2499 17.656C19.2499 17.2332 19.0819 16.8276 18.783 16.5285L12.255 10Z"></path></svg>';

      //DELETE APPOINTMENT BUTTON for the appointment with the id of the object
      btnEliminar.onclick = () => this.eliminar(cita.id);

      const contenedorBotones = document.createElement("DIV");
      contenedorBotones.classList.add("flex", "justify-between", "mt-10");

      //ADDING THE BUTTONS TO THE BUTTON CONTAINER
      contenedorBotones.appendChild(btnEditar);
      contenedorBotones.appendChild(btnEliminar);

      //ADD THE DATA THE DATA TO THE APPOINTMENT
      divCita.appendChild(paciente);
      divCita.appendChild(propietario);
      divCita.appendChild(email);
      divCita.appendChild(fecha);
      divCita.appendChild(sintomas);
      divCita.appendChild(contenedorBotones);
      //ADD THE APPOINTMENT TO THE APPOINTMENTS CONTAINER
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
  let fechaActual = new Date();
  // console.log(`Datenow: ${(fechaActual.setHours(0,0,0,0))}`) //Datenow: 1721907603076
  let fechaDeseada = new Date(citaObj.fecha);
  // console.log(`Fecha: ${fechaDeseada.setHours(0,0,0,0)}`) //Fecha: 1721080800000

  if (fechaActual > fechaDeseada) {
    new Notificacion({
      texto: "La fecha puede ser creada solo en el futuro",
      tipo: "error",
    });
    return;
  }

  //EDITANDO carries boolean value, if true, the appointment is edited, if false, the appointment is newly added
  if (editando) {
    //ADD THE COPY OF THE OBJECT OF THE APPOINTMENT TO THE APPOINTMENTS ARRAY, AND WE LATER CLEAR THE 'citaObj' OBJECT
    citas.editar({ ...citaObj });
    new Notificacion({
      texto: "Guardado Correctamente",
      tipo: "exito",
    });
  } else {
    //ADD THE COPY OF THE OBJECT OF THE APPOINTMENT TO THE APPOINTMENTS ARRAY, AND WE LATER CLEAR THE 'citaObj' OBJECT
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
  //CLEARING THE OBJECT OF THE APPOINTMENT
  reiniciarObjetoCita();

  //BUTTON TEXT CHANGES TO REGISTRAR PACIENTE
  formularioInput.value = "Registrar Paciente";
  editando = false;
}
//VALIDATION FUNCTIONS
function validateEmpty(valor) {
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

  //RESETTING THE OBJECT OF THE APPOINTMENT with Object.assign , we copy empty values to the object
  //THE id is generated with generarId() for the next appointment
  Object.assign(citaObj, {
    id: generarId(),
    paciente: "",
    propietario: "",
    email: "",
    fecha: "",
    sintomas: "",
  });
}

//GENERATING A RANDOM ID FOR THE APPOINTMENT - random math function, 36 base, substring(will delete first 2 digits), date.now, concatenate and parse to string
function generarId() {
  return Math.random().toString(36).substring(2) + Date.now();
}

//EDITING THE APPOINTMENT, the cita object is passed to the function from the button event handler
function cargarEdicion(cita) {
//the edited object
  Object.assign(citaObj, cita);
  id = cita.id;
  pacienteInput.value = cita.paciente;
  propietarioInput.value = cita.propietario;
  emailInput.value = cita.email;
  fechaInput.value = cita.fecha;
  sintomasInput.value = cita.sintomas;
//SET AUX VARIABLE TO TRUE - TO EXECUTE EDIT CODE IN THE FUNCTION 'submitCita'
  editando = true;

  
  //BUTTON TEXT CHANGES TO SAVE CHANGES
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
}

//SAVING DATA TO LOCAL STORAGE
function guardarDatosLocalStorage() {
  //stores objects of citas in an an array
  localStorage.setItem("citas", JSON.stringify(citas.citas));

  //make code to read existing and add new data
}

//DELETE DATA FROM LOCAL STORAGE
function eliminarDatosLocalStorage(id) {
    console.log(id);
  //reads the JSON object from local storage
  const citasfromJSON = JSON.parse(localStorage.getItem("citas")) || [];
  console.log(citasfromJSON); //object

  if (citasfromJSON !== null) {
    //for each object in the array
    for (index in citasfromJSON) {
      // console.log(citasfromJSON[index]);
      let cita = citasfromJSON[index];
      if (cita.id === id) {
        //delete the object from the array
        citasfromJSON.splice(index, 1);
        // console.log(citasfromJSON);

        //STORE UPDATED DATA IN LOCAL STORAGE
        guardarDatosLocalStorage();
      }
    }
  } else {
    console.log("No hay Citas");
  }
//   console.log(citas);
}

//EDIT DATA FROM LOCAL STORAGE
function editarDatosLocalStorage(citaActualizada) {
  //reads the JSON object from local storage
  const citasfromJSON = JSON.parse(localStorage.getItem("citas")) || [];
//   console.log(citasfromJSON); //object
  if (citasfromJSON !== null) {
    //for each object in the array
    for (index in citasfromJSON) {
      // console.log(citasfromJSON[index]);
      let cita = citasfromJSON[index];
      if (cita.id === id) {
        //update the object with the new data
        citasfromJSON[index] = { ...cita, ...citaActualizada };
        // console.log(citasfromJSON);

        //STORE UPDATED DATA IN LOCAL STORAGE
        guardarDatosLocalStorage();
      }
    }
  }}