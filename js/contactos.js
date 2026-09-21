const form = document.querySelector("form");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    let valido = true;

    const nome = document.getElementById("nome");
    const contacto = document.getElementById("contacto");
    const assunto = document.getElementById("assunto");
    const mensagem = document.getElementById("mensagem");

    const sucesso = document.getElementById("sucesso");

    // esconder mensagens anteriores
    document.querySelectorAll(".erro").forEach(erro => {
        erro.style.display = "none";
    });

    sucesso.style.display = "none";

    // remover bordas vermelhas antigas
    [nome, contacto, assunto, mensagem].forEach(campo => {
        campo.style.borderColor = "#d1d5db";
    });

    // validações
    if (nome.value.trim() === "") {
        nome.nextElementSibling.style.display = "block";
        nome.style.borderColor = "red";
        valido = false;
    }

    if (contacto.value.trim() === "") {
        contacto.nextElementSibling.style.display = "block";
        contacto.style.borderColor = "red";
        valido = false;
    }

    if (assunto.value.trim() === "") {
        assunto.nextElementSibling.style.display = "block";
        assunto.style.borderColor = "red";
        valido = false;
    }

    if (mensagem.value.trim() === "") {
        mensagem.nextElementSibling.style.display = "block";
        mensagem.style.borderColor = "red";
        valido = false;
    }

    // sucesso
    if (valido) {

        sucesso.textContent = "Mensagem enviada com sucesso!";
        sucesso.style.display = "inline";

        form.reset();
    }
});