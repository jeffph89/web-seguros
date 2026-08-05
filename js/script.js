emailjs.init({
    publicKey: "ALLnLWpYb7h9srCWE",
});

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function (e) {

    e.preventDefault();

    emailjs.sendForm(
        "service_5wppfxk",
        "template_9khvsaa",
        this
    )
    .then(() => {

        alert("Solicitud enviada correctamente.");

        formulario.reset();

    })
    .catch((error) => {

        console.log(error);

        alert("Ha ocurrido un error al enviar el formulario.");

    });

});