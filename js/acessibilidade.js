/* ==========================================
   BOTÃO FLUTUANTE
========================================== */

const imagePath = (fileName) =>
    `${location.pathname.includes("/html/") ? "../img/" : "img/"}${fileName}`;

const acBtn = document.createElement("button");
acBtn.id = "acBtn";
acBtn.innerHTML =
`<img src="${imagePath("acessibilidade.png")}" alt="Abrir painel de acessibilidade">`;

document.body.appendChild(acBtn);

/* ==========================================
   OVERLAY
========================================== */

const acOverlay = document.createElement("div");
acOverlay.id = "acOverlay";

document.body.appendChild(acOverlay);

/* ==========================================
   PAINEL
========================================== */

const acPanel = document.createElement("div");

acPanel.id = "acPanel";

acPanel.innerHTML = `

<div class="acHeader">

    <h2>Acessibilidade</h2>

    <div id="acFecharPainel">
        ✕
    </div>

</div>

<div class="acTitulo">
Leitor de texto
</div>

<div class="acCard">

<div class="acLeitor">

<div id="acPrev" class="acIcon">
<img src="${imagePath("recuar.png")}" alt="Frase anterior">
</div>

<div id="acPlay" class="acIcon">
<img id="playIcon"
src="${imagePath("play.png")}" alt="Reproduzir texto">
</div>

<div id="acNext" class="acIcon">
<img src="${imagePath("avancar.png")}" alt="Frase seguinte">
</div>

<div id="acProgress">

<div id="acProgressBar"></div>

</div>

<div id="acTempo">
0:00
</div>



</div>

</div>

<div class="acTitulo">
Tamanho do texto
</div>

<div class="acCard">

<input
type="range"
id="acSlider"
min="70"
max="200"
value="100"
/>

<div class="acZoomBtns">

<button id="acMenos">
A-
</button>

<button id="acResetZoom">
Reset
</button>

<button id="acMais">
A+
</button>

</div>

</div>

<div class="acTitulo">
Ajuste de cor
</div>

<div class="acCard">

<div class="acCor">

<button id="acClaro">
☀ Modo Claro
</button>

<button id="acEscuro">
🌙 Modo Escuro
</button>

</div>

</div>

<button id="acResetAll">
Repor tudo
</button>

`;

document.body.appendChild(acPanel);

/* ==========================================
   ABRIR E FECHAR
========================================== */
acBtn.addEventListener("click", () => {

    acOverlay.style.display = "block";
    acPanel.style.display = "block";

    document.body.style.overflow = "hidden";

});

acOverlay.addEventListener("click", () => {

    acOverlay.style.display = "none";
    acPanel.style.display = "none";

    document.body.style.overflow = "";

});
/* ==========================================
   ZOOM
========================================== */

const acSlider =
document.getElementById("acSlider");

const acMais =
document.getElementById("acMais");

const acMenos =
document.getElementById("acMenos");

const acResetZoom =
document.getElementById("acResetZoom");

/* valor guardado */

let zoomGuardado =
localStorage.getItem("zoomGlobal") || 100;

acSlider.value = zoomGuardado;

document.body.style.zoom =
zoomGuardado + "%";

/* slider */

acSlider.addEventListener("input", () => {

    document.body.style.zoom =
    acSlider.value + "%";

    localStorage.setItem(
    "zoomGlobal",
    acSlider.value
    );

});

/* A+ */

acMais.addEventListener("click", () => {

    let valor =
    Number(acSlider.value);

    valor += 10;

    if(valor > 200)
        valor = 200;

    acSlider.value = valor;

    document.body.style.zoom =
    valor + "%";

    localStorage.setItem(
    "zoomGlobal",
    valor
    );

});

/* A- */

acMenos.addEventListener("click", () => {

    let valor =
    Number(acSlider.value);

    valor -= 10;

    if(valor < 70)
        valor = 70;

    acSlider.value = valor;

    document.body.style.zoom =
    valor + "%";

    localStorage.setItem(
    "zoomGlobal",
    valor
    );

});

/* RESET */

acResetZoom.addEventListener("click", () => {

    acSlider.value = 100;

    document.body.style.zoom = "100%";

    localStorage.setItem(
    "zoomGlobal",
    100
    );

});

/* ==========================================
   MODO ESCURO
========================================== */

const acEscuro =
document.getElementById("acEscuro");

const acClaro =
document.getElementById("acClaro");

if(localStorage.getItem("modoEscuro") === "1"){

    document.body.classList.add(
    "dark-mode"
    );

}

acEscuro.addEventListener("click", () => {

    document.body.classList.add(
    "dark-mode"
    );

    localStorage.setItem(
    "modoEscuro",
    "1"
    );

});

acClaro.addEventListener("click", () => {

    document.body.classList.remove(
    "dark-mode"
    );

    localStorage.setItem(
    "modoEscuro",
    "0"
    );

}); 

const acFecharPainel =
document.getElementById(
"acFecharPainel"
);

acFecharPainel.addEventListener(
"click",
() => {

    acPanel.style.display = "none";

    acOverlay.style.display = "none";

    document.body.style.overflow = "";

}
);

/* ==========================================
   LEITOR DE TEXTO
========================================== */

const acPlay =
document.getElementById("acPlay");

const acPrev =
document.getElementById("acPrev");

const acNext =
document.getElementById("acNext");

const acProgress =
document.getElementById("acProgress");

const acProgressBar =
document.getElementById("acProgressBar");

const acTempo =
document.getElementById("acTempo");


/* ==========================================
   TEXTO DA PÁGINA
========================================== */

let textoPagina =
document.body.innerText;


/* ==========================================
   FRASES
========================================== */

let frases =
textoPagina.split(
    /(?<=[.!?])\s+/
).filter(frase => frase.trim() !== "");


let fraseAtual = 0;


/* ==========================================
   SPEECH
========================================== */

let utterance;

let pausado = false;

let aLer = false;


/* ÍCONES */

const PLAY_ICON =
imagePath("play.png");

const PAUSE_ICON =
imagePath("pausa.png");


/* ==========================================
   TEMPO TOTAL
========================================== */

const totalPalavras =
textoPagina.split(/\s+/).length;


/* velocidade aproximada:
   100 palavras por minuto */

const tempoTotalSeg =
Math.round(
    (totalPalavras / 100) * 60
);


/* ==========================================
   ANIMAÇÃO DA BARRA
========================================== */

let animacaoProgresso = null;

let inicioFrase = 0;

let duracaoFrase = 0;


/* ==========================================
   FORMATAR TEMPO
========================================== */

function formatarTempo(seg){

    seg = Math.max(0, Math.round(seg));

    let m =
    Math.floor(seg / 60);

    let s =
    seg % 60;

    return `${m}:${s
        .toString()
        .padStart(2,"0")}`;
}


/* ==========================================
   TEMPO INICIAL
========================================== */

acTempo.innerText =
formatarTempo(
    tempoTotalSeg
);


/* ==========================================
   PARAR ANIMAÇÃO
========================================== */

function pararAnimacao(){

    if(animacaoProgresso){

        cancelAnimationFrame(
            animacaoProgresso
        );

        animacaoProgresso = null;
    }
}


/* ==========================================
   PROGRESSO INICIAL DA FRASE
========================================== */

function atualizarProgresso(){

    const percent =
    (fraseAtual / frases.length) * 100;

    acProgressBar.style.width =
    percent + "%";


    const lido =
    Math.round(
        (fraseAtual / frases.length)
        * tempoTotalSeg
    );


    const restante =
    tempoTotalSeg - lido;


    acTempo.innerText =
    formatarTempo(
        restante
    );
}


/* ==========================================
   ANIMAR BARRA ENQUANTO FALA
========================================== */

function animarProgresso(){

    pararAnimacao();

    inicioFrase =
    performance.now();


    function atualizar(){

        if(!aLer || pausado){

            return;
        }


        const agora =
        performance.now();


        const tempoPassado =
        agora - inicioFrase;


        let progressoFrase =
        tempoPassado / duracaoFrase;


        if(progressoFrase > 1){

            progressoFrase = 1;

        }


        /*
        Calcula o progresso total:

        frases anteriores
        +
        progresso da frase atual
        */

        const progressoTotal =
        (
            fraseAtual +
            progressoFrase
        ) / frases.length;


        const percent =
        progressoTotal * 100;


        acProgressBar.style.width =
        percent + "%";


        /*
        Atualiza o tempo restante
        */

        const tempoLido =
        progressoTotal *
        tempoTotalSeg;


        const restante =
        tempoTotalSeg -
        tempoLido;


        acTempo.innerText =
        formatarTempo(
            restante
        );


        if(progressoFrase < 1){

            animacaoProgresso =
            requestAnimationFrame(
                atualizar
            );

        }

    }


    animacaoProgresso =
    requestAnimationFrame(
        atualizar
    );
}


/* ==========================================
   LER FRASE
========================================== */

function lerFrase(indice){

    pararAnimacao();

    atualizarProgresso();

    speechSynthesis.cancel();


    const texto =
    frases[indice];


    /*
    Calculamos aproximadamente
    quanto tempo esta frase demora
    */

    const palavras =
    texto.split(/\s+/).length;


    /*
    100 palavras/minuto
    */

    duracaoFrase =
    (palavras / 100) * 60 * 1000;


    /*
    Como o speech está a 0.85,
    aumentamos ligeiramente o tempo
    */

    duracaoFrase =
    duracaoFrase / 0.85;


    /*
    Criar leitura
    */

    utterance =
    new SpeechSynthesisUtterance(
        texto
    );


    utterance.lang =
    "pt-PT";


    utterance.rate =
    0.85;


    /* ==================================
       QUANDO TERMINA A FRASE
    ================================== */

    utterance.onend = () => {

        pararAnimacao();


        if(!pausado){

            /*
            Coloca a barra exatamente
            no início da próxima frase
            */

            fraseAtual++;


            if(
                fraseAtual <
                frases.length
            ){

                lerFrase(
                    fraseAtual
                );

            }

            else{

                /*
                Terminou tudo
                */

                aLer = false;

                acProgressBar.style.width =
                "100%";

                acTempo.innerText =
                "0:00";

                document.getElementById(
                    "playIcon"
                ).src =
                PLAY_ICON;
            }

        }

    };


    /*
    Começa a falar
    */

    speechSynthesis.speak(
        utterance
    );


    /*
    Começa a animação da barra
    */

    animarProgresso();
}


/* ==========================================
   PLAY / PAUSE
========================================== */

acPlay.addEventListener(
"click",
() => {


    /* ==============================
       COMEÇAR
    ============================== */

    if(!aLer){

        fraseAtual = 0;

        pausado = false;

        aLer = true;


        document.getElementById(
            "playIcon"
        ).src =
        PAUSE_ICON;


        atualizarProgresso();


        lerFrase(
            fraseAtual
        );


        return;
    }


    /* ==============================
       PAUSAR
    ============================== */

    if(!pausado){

        speechSynthesis.pause();

        pausado = true;


        pararAnimacao();


        document.getElementById(
            "playIcon"
        ).src =
        PLAY_ICON;

    }


    /* ==============================
       CONTINUAR
    ============================== */

    else{

        speechSynthesis.resume();

        pausado = false;


        /*
        Reinicia a contagem da frase
        a partir do ponto atual
        */

        inicioFrase =
        performance.now();


        animarProgresso();


        document.getElementById(
            "playIcon"
        ).src =
        PAUSE_ICON;
    }

});


/* ==========================================
   RECUAR
========================================== */

acPrev.addEventListener(
"click",
() => {


    if(fraseAtual <= 0){

        return;

    }


    pararAnimacao();

    speechSynthesis.cancel();


    fraseAtual--;

    pausado = false;

    aLer = true;


    document.getElementById(
        "playIcon"
    ).src =
    PAUSE_ICON;


    atualizarProgresso();


    lerFrase(
        fraseAtual
    );

});


/* ==========================================
   AVANÇAR
========================================== */

acNext.addEventListener(
"click",
() => {


    if(
        fraseAtual >=
        frases.length - 1
    ){

        return;

    }


    pararAnimacao();

    speechSynthesis.cancel();


    fraseAtual++;

    pausado = false;

    aLer = true;


    document.getElementById(
        "playIcon"
    ).src =
    PAUSE_ICON;


    atualizarProgresso();


    lerFrase(
        fraseAtual
    );

});


/* ==========================================
   CLICAR NA BARRA
========================================== */

acProgress.addEventListener(
"click",
(e) => {


    const rect =
    acProgress
    .getBoundingClientRect();


    const x =
    e.clientX -
    rect.left;


    let percent =
    x / rect.width;


    /*
    Garantir que fica entre 0 e 1
    */

    percent =
    Math.max(
        0,
        Math.min(
            1,
            percent
        )
    );


    fraseAtual =
    Math.floor(
        percent *
        frases.length
    );


    /*
    Evitar ultrapassar
    a última frase
    */

    if(
        fraseAtual >=
        frases.length
    ){

        fraseAtual =
        frases.length - 1;

    }


    pausado = false;

    aLer = true;


    document.getElementById(
        "playIcon"
    ).src =
    PAUSE_ICON;


    pararAnimacao();

    speechSynthesis.cancel();


    atualizarProgresso();


    lerFrase(
        fraseAtual
    );

});


/* ==========================================
   REPOR TUDO
========================================== */

const acResetAll =
document.getElementById(
    "acResetAll"
);


acResetAll.addEventListener(
"click",
() => {


    speechSynthesis.cancel();


    pararAnimacao();


    document.body.style.zoom =
    "100%";


    acSlider.value =
    100;


    document.body.classList.remove(
        "dark-mode"
    );


    localStorage.removeItem(
        "zoomGlobal"
    );


    localStorage.removeItem(
        "modoEscuro"
    );


    fraseAtual = 0;

    pausado = false;

    aLer = false;


    document.getElementById(
        "playIcon"
    ).src =
    PLAY_ICON;


    atualizarProgresso();

});

/* ==========================================
   BOTÃO PESQUISA NO HEADER
========================================== */

const nav = document.querySelector("header nav");

/* criar botão */
const searchHeaderBtn = document.createElement("button");
searchHeaderBtn.id = "searchHeaderBtn";
searchHeaderBtn.innerHTML = `<img src="${imagePath("search.png")}" alt="Pesquisar">`;

/* inserir ao lado do último link (Contactos) */
nav.appendChild(searchHeaderBtn);

/* ==========================================
   MODAL
========================================== */

const searchOverlay = document.createElement("div");
searchOverlay.id = "searchOverlay";
document.body.appendChild(searchOverlay);

const searchModal = document.createElement("div");
searchModal.id = "searchModal";

searchModal.innerHTML = `
  <div class="searchHeader">
    <h3>Pesquisar</h3>
    <div id="closeSearch">✕</div>
  </div>

  <input type="text" id="searchInput" placeholder="O que procuras?">
  <button id="searchBtn">Pesquisar</button>

  <div id="searchResults"></div>
`;

document.body.appendChild(searchModal);

/* ELEMENTOS */
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");
const closeSearch = document.getElementById("closeSearch");

/* ABRIR */
searchHeaderBtn.addEventListener("click", () => {
  searchOverlay.style.display = "block";
  searchModal.style.display = "block";
  searchInput.focus();
});

/* FECHAR */
function fecharSearch() {
  searchOverlay.style.display = "none";
  searchModal.style.display = "none";
  searchInput.value = "";
  searchResults.innerHTML = "";
}

searchOverlay.addEventListener("click", fecharSearch);
closeSearch.addEventListener("click", fecharSearch);

/* ==========================================
   PÁGINAS
========================================== */

const paginas = [
  { titulo: "Início", url: "../index.html" },
  { titulo: "Empresa", url: "../html/empresa.html" },
  { titulo: "Serviços", url: "../html/servicos.html" },
  { titulo: "Portfólio", url: "../html/portfolio.html" },
  { titulo: "Parceiros", url: "../html/parceiros.html" },
  { titulo: "Contactos", url: "../html/contactos.html" }
];

/* NORMALIZAR */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* REMOVER HTML */
function removerHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/* DESTACAR */
function destacarTexto(texto, termo) {
  const regex = new RegExp(`(${termo})`, "gi");
  return texto.replace(regex, `<span class="mark">$1</span>`);
}

/* PESQUISA */
async function pesquisar() {
  const termoOriginal = searchInput.value.trim();
  const termo = normalizar(termoOriginal);

  searchResults.innerHTML = "";

  if (!termo) {
    searchResults.innerHTML = `<p>Escreve algo para pesquisar.</p>`;
    return;
  }

  let encontrou = false;

  for (const pagina of paginas) {
    try {
      const res = await fetch(pagina.url);
      const html = await res.text();

      const textoOriginal = removerHTML(html);
      const texto = normalizar(textoOriginal);

      if (texto.includes(termo)) {
        encontrou = true;

        const index = texto.indexOf(termo);
        const inicio = Math.max(0, index - 80);
        const fim = Math.min(textoOriginal.length, index + 120);

        let excerto = textoOriginal.substring(inicio, fim);
        excerto = destacarTexto(excerto, termoOriginal);

        const div = document.createElement("div");
        div.classList.add("searchItem");

        div.innerHTML = `
          <h4>${pagina.titulo}</h4>
          <p>... ${excerto} ...</p>
        `;

        div.addEventListener("click", () => {
          window.location.href = `${pagina.url}?pesquisa=${encodeURIComponent(termoOriginal)}`;
        });

        searchResults.appendChild(div);
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (!encontrou) {
    searchResults.innerHTML = `<p>Nenhum resultado encontrado.</p>`;
  }
}

/* BOTÃO */
searchBtn.addEventListener("click", pesquisar);

/* ENTER */
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") pesquisar();
});

/* DESTACAR NA PÁGINA */
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const termo = params.get("pesquisa");

  if (!termo) return;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    if (node.parentElement.tagName === "SCRIPT") return;

    const regex = new RegExp(termo, "gi");

    if (regex.test(node.nodeValue)) {
      const span = document.createElement("span");
      span.innerHTML = node.nodeValue.replace(
        regex,
        `<span class="mark">$&</span>`
      );

      const wrapper = document.createElement("span");
      wrapper.innerHTML = span.innerHTML;

      node.replaceWith(wrapper);
    }
  });
});
