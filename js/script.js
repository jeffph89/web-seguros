// =========================================================
// AÑO DINÁMICO EN EL FOOTER
// =========================================================
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();

// =========================================================
// MENÚ MÓVIL
// =========================================================
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav-principal");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    navToggle.setAttribute("aria-expanded", abierto ? "true" : "false");
  });

  // Cierra el menú al elegir una sección (mejor experiencia en móvil)
  nav.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      nav.classList.remove("abierto");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// =========================================================
// FAQ - ACORDEÓN ACCESIBLE
// =========================================================
document.querySelectorAll(".faq-pregunta").forEach((boton) => {
  boton.addEventListener("click", () => {
    const respuesta = document.getElementById(boton.getAttribute("aria-controls"));
    const abierta = boton.getAttribute("aria-expanded") === "true";

    boton.setAttribute("aria-expanded", abierta ? "false" : "true");
    if (respuesta) respuesta.hidden = abierta;
  });
});

// =========================================================
// AL PULSAR "Solicitar información" EN UNA TARJETA,
// PRESELECCIONA EL TIPO DE SEGURO EN EL FORMULARIO
// =========================================================
document.querySelectorAll(".btn-card[data-seguro]").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    const select = document.getElementById("seguro");
    if (select) select.value = enlace.dataset.seguro;
  });
});

// =========================================================
// ENVÍO DEL FORMULARIO (EmailJS)
// =========================================================
emailjs.init({
  publicKey: "ALLnLWpYb7h9srCWE",
});

const formulario = document.getElementById("formulario");
const estado = document.getElementById("form-estado");
const botonEnviar = formulario ? formulario.querySelector("button[type=submit]") : null;
const textoBoton = botonEnviar ? botonEnviar.querySelector(".texto-boton") : null;

function mostrarEstado(mensaje, tipo) {
  if (!estado) return;
  estado.textContent = mensaje;
  estado.className = "form-estado " + tipo;
}

function telefonoValido(valor) {
  return /^[0-9 +()-]{9,15}$/.test(valor.trim());
}

if (formulario) {
  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    mostrarEstado("", "");

    // Honeypot: si el campo oculto tiene contenido, es casi seguro un robot.
    // Se simula un envío correcto para no darle pistas al bot.
    const trampa = formulario.querySelector("input[name=web]");
    if (trampa && trampa.value.trim() !== "") {
      formulario.reset();
      mostrarEstado("Solicitud enviada correctamente.", "ok");
      return;
    }

    const telefono = formulario.telefono.value;
    if (!telefonoValido(telefono)) {
      mostrarEstado("Revisa el teléfono: usa entre 9 y 15 dígitos.", "error");
      formulario.telefono.focus();
      return;
    }

    if (botonEnviar) botonEnviar.disabled = true;
    if (textoBoton) textoBoton.textContent = "Enviando...";

    emailjs
      .sendForm("service_5wppfxk", "template_9khvsaa", this)
      .then(() => {
        mostrarEstado("¡Gracias! Tu solicitud se ha enviado correctamente. Te contactaré pronto.", "ok");
        formulario.reset();
      })
      .catch((error) => {
        console.error(error);
        mostrarEstado("No se ha podido enviar. Escríbeme por WhatsApp o inténtalo de nuevo en unos minutos.", "error");
      })
      .finally(() => {
        if (botonEnviar) botonEnviar.disabled = false;
        if (textoBoton) textoBoton.textContent = "Solicitar asesoramiento";
      });
  });
}
