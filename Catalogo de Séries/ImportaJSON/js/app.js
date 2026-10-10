
let series = [];

const listaSeries = document.getElementById("listaSeries");
const status = document.getElementById("status");
const btnBuscar = document.getElementById("btnBuscar");
const btnTotal = document.getElementById("btnTotal");
const btnAntiga = document.getElementById("btnAntiga");
const btnRecente = document.getElementById("btnRecente");
const botoesGenero = document.querySelectorAll(".btnGenero");
const pesquisa = document.getElementById("pesquisa");
const btnOrdenar = document.getElementById("btnOrdenar");

let generoSelecionado = "Todos";
let ordenarPorAno = false;

async function carregarSeries() {

    try {

        status.textContent = "Carregando séries... aguarde um momento!";

        
        const resposta = await fetch("../../series.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o JSON.");
        }


        series = await resposta.json();

        status.textContent = `${series.length} séries carregadas!`;

        mostrarSeries(series);

    } catch (erro) {

        status.textContent = `Erro: ${erro.message}`;

    }
}

function mostrarSeries(lista) {

    listaSeries.innerHTML = "";

    if (lista.length === 0) {
        listaSeries.innerHTML = "<p>Nenhuma série encontrada.</p>";
        return;
    }

    lista.forEach((serie) => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <h2>${serie.titulo}</h2>
            <p><strong>Ano:</strong> ${serie.ano}</p>
            <p><strong>Gênero:</strong> ${serie.genero}</p>
            <p><strong>Temporadas:</strong> ${serie.temporadas}</p>
            <img src="ImportaJSON/${serie.imagem}"
                 alt="Pôster de ${serie.titulo}"
                 width="200">
        `;

        listaSeries.appendChild(card);

    });
}

function mostrarTotal() {

    status.textContent = `${series.length} séries cadastradas.`;

}

function mostrarAntigos() {

    const anoMaisAntigo = Math.min(
        ...series.map((serie) => serie.ano)
    );

    const antigos = series.filter(
        (serie) => serie.ano === anoMaisAntigo
    );

    status.textContent =
        `Série mais antiga: ${antigos[0].titulo} (${antigos[0].ano}).`;

}

function mostrarRecentes() {

    const anoMaisRecente = Math.max(
        ...series.map((serie) => serie.ano)
    );

    const recentes = series.filter(
        (serie) => serie.ano === anoMaisRecente
    );

    status.textContent =
        `Série mais recente: ${recentes[0].titulo} (${recentes[0].ano}).`;

}

function filtrarSeries() {
    const texto = pesquisa.value.toLowerCase().trim();
    const ano = anoPesquisa.value;

    let resultado = series.filter((serie) => {
        const tituloCombina =
            serie.titulo.toLowerCase().includes(texto);

        const generoCombina =
            generoSelecionado === "Todos" ||
            serie.genero.toLowerCase().includes(
                generoSelecionado.toLowerCase()
            );

        const anoCombina =
            ano === "" || serie.ano.toString() === ano;

        return tituloCombina && generoCombina && anoCombina;
    });

    if (ordenarPorAno) {
        resultado.sort((a, b) => a.ano - b.ano);
    }

    mostrarSeries(resultado);

    status.textContent =
        `${resultado.length} série(s) encontrada(s).`;
}

btnBuscar.addEventListener("click", carregarSeries);
btnTotal.addEventListener("click", mostrarTotal);
btnAntiga.addEventListener("click", mostrarAntigos);
btnRecente.addEventListener("click", mostrarRecentes);
pesquisa.addEventListener("input", carregarSeries);

botoesGenero.forEach((botao) => {
    botao.addEventListener("click", () => {
        generoSelecionado = botao.dataset.genero;
        filtrarSeries();
    });
});

btnOrdenar.addEventListener("click", () => {
    ordenarPorAno = true;
    filtrarSeries();
})

carregarSeries();
