let memoriaValor = 0;
let expresionCompleta = "";
let historial = [];
let modo = "deg"; // deg o rad
let entradaActual = "0";

// Elementos del DOM
const pantallaOperacion = document.getElementById("operacion");
const pantallaResultado = document.getElementById("resultado");
const modoBtn = document.getElementById("modoBtn");
const historialDiv = document.getElementById("historial");
const historialContenido = document.getElementById("historial-contenido");

function actualizarPantalla() {
  pantallaOperacion.textContent =
    expresionCompleta + (entradaActual !== "0" ? entradaActual : "");
  pantallaResultado.textContent = entradaActual;
}

function agregarNumero(numero) {
  if (entradaActual === "0" && numero !== "0") {
    entradaActual = numero;
  } else if (entradaActual !== "0") {
    entradaActual += numero;
  }
  actualizarPantalla();
}

function agregarDecimal() {
  if (!entradaActual.includes(".")) {
    entradaActual += entradaActual === "" ? "0." : ".";
    actualizarPantalla();
  }
}

function agregarOperador(operador) {
  if (entradaActual !== "0") {
    expresionCompleta += entradaActual + " " + operador + " ";
    entradaActual = "0";
    actualizarPantalla();
  } else if (expresionCompleta !== "") {
    // Reemplazar el último operador
    expresionCompleta =
      expresionCompleta.trim().slice(0, -3) + " " + operador + " ";
    actualizarPantalla();
  }
}

function agregarFuncion(funcion) {
  switch (funcion) {
    case "Math.PI":
      entradaActual = Math.PI.toString();
      break;
    case "Math.E":
      entradaActual = Math.E.toString();
      break;
    case "^":
      expresionCompleta += entradaActual + " ^ ";
      entradaActual = "0";
      break;
    case "Math.sqrt(":
      entradaActual = Math.sqrt(parseFloat(entradaActual || "0")).toString();
      break;
    case "!":
      entradaActual = factorial(parseFloat(entradaActual || "1")).toString();
      break;
    case "Math.log10(":
      entradaActual = Math.log10(parseFloat(entradaActual || "1")).toString();
      break;
    case "Math.log(":
      entradaActual = Math.log(parseFloat(entradaActual || "1")).toString();
      break;
    case "Math.pow(10,":
      entradaActual = Math.pow(10, parseFloat(entradaActual || "0")).toString();
      break;
    case "Math.exp(":
      entradaActual = Math.exp(parseFloat(entradaActual || "0")).toString();
      break;
    case "Math.abs(":
      entradaActual = Math.abs(parseFloat(entradaActual || "0")).toString();
      break;
    case "1/":
      entradaActual = (1 / parseFloat(entradaActual || "1")).toString();
      break;
    case "Math.random()":
      entradaActual = Math.random().toString();
      break;
    case "(":
    case ")":
      expresionCompleta += funcion;
      break;
    case "%":
      entradaActual = (parseFloat(entradaActual || "0") / 100).toString();
      break;
  }
  actualizarPantalla();
}

function calcularFuncion(funcionNombre) {
  let valor = parseFloat(entradaActual || "0");
  let resultado;

  let angulo = modo === "deg" ? (valor * Math.PI) / 180 : valor;

  switch (funcionNombre) {
    case "Math.sin":
      resultado = Math.sin(angulo);
      break;
    case "Math.cos":
      resultado = Math.cos(angulo);
      break;
    case "Math.tan":
      resultado = Math.tan(angulo);
      break;
    case "Math.asin":
      resultado = Math.asin(valor);
      if (modo === "deg") resultado = (resultado * 180) / Math.PI;
      break;
    case "Math.acos":
      resultado = Math.acos(valor);
      if (modo === "deg") resultado = (resultado * 180) / Math.PI;
      break;
    case "Math.atan":
      resultado = Math.atan(valor);
      if (modo === "deg") resultado = (resultado * 180) / Math.PI;
      break;
  }

  entradaActual = resultado.toString();
  actualizarPantalla();
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function calcular() {
  try {
    let exprEval = expresionCompleta + entradaActual;
    exprEval = exprEval
      .replace(/\^/g, "**")
      .replace(/×/g, "*")
      .replace(/÷/g, "/");

    let resultado = eval(exprEval);

    historial.push({
      operacion: expresionCompleta + entradaActual,
      resultado: resultado,
    });
    actualizarHistorial();

    entradaActual = resultado.toString();
    expresionCompleta = "";
    actualizarPantalla();

    // Animación de cálculo realizado
    document.querySelector(".calculadora").classList.add("calculo-realizado");
    setTimeout(() => {
      document
        .querySelector(".calculadora")
        .classList.remove("calculo-realizado");
    }, 400);
  } catch (e) {
    entradaActual = "Error";
    expresionCompleta = "";
    actualizarPantalla();
  }
}

function limpiarTodo() {
  entradaActual = "0";
  expresionCompleta = "";
  actualizarPantalla();
}

function borrarUltimo() {
  if (entradaActual.length > 1) {
    entradaActual = entradaActual.slice(0, -1);
  } else {
    entradaActual = "0";
  }
  actualizarPantalla();
}

function memoria(operacion) {
  let valor = parseFloat(entradaActual || "0");

  switch (operacion) {
    case "MC":
      memoriaValor = 0;
      break;
    case "MR":
      entradaActual = memoriaValor.toString();
      break;
    case "M+":
      memoriaValor += valor;
      break;
    case "M-":
      memoriaValor -= valor;
      break;
  }
  actualizarPantalla();
}

function cambiarModo() {
  modo = modo === "deg" ? "rad" : "deg";
  modoBtn.textContent = modo === "deg" ? "DEG" : "RAD";
}

function toggleHistorial() {
  historialDiv.classList.toggle("visible");
}

function actualizarHistorial() {
  historialContenido.innerHTML = "";
  historial
    .slice()
    .reverse()
    .forEach((item) => {
      const div = document.createElement("div");
      div.className = "historial-item";
      div.innerHTML = `<div>${item.operacion}</div><div>= ${item.resultado}</div>`;
      div.onclick = () => {
        expresionCompleta = "";
        entradaActual = item.resultado.toString();
        actualizarPantalla();
        toggleHistorial();
      };
      historialContenido.appendChild(div);
    });
}

// Inicializar pantalla
actualizarPantalla();
