const STORAGE_KEY = "dashboard_chamados_v1";

let dados = [];

try {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (dadosSalvos) {
        dados = JSON.parse(dadosSalvos);
    }
} catch (erro) {
    console.error("Erro ao carregar dados:", erro);
    dados = [];
}

let indiceEdicao = -1;

const META_MENSAL = 60;
const META_DIARIA = 1;
const TOTAL_ATIVOS = 60;

function salvar() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(dados)
        );
    } catch (erro) {
        console.error(
            "Erro ao salvar dados:",
            erro
        );
    }
}

function atualizarDashboard() {

    const totalConcluidos = dados.reduce(
        (total, item) =>
            total + Number(item.qtd || 0),
        0
    );

    const pendentes = Math.max(
        META_MENSAL - totalConcluidos,
        0
    );

    const percentual = Math.min(
        (totalConcluidos / META_MENSAL) * 100,
        100
    );

    document.getElementById("totalAtivos").textContent =
        TOTAL_ATIVOS;

    document.getElementById("total").textContent =
        META_MENSAL;

    document.getElementById("concluidos").textContent =
        totalConcluidos;

    document.getElementById("pendentes").textContent =
        pendentes;

    document.getElementById("percentual").textContent =
        percentual.toFixed(1) + "%";

    document.getElementById("barra").style.width =
        percentual + "%";

    document.getElementById("txtProgresso").textContent =
        `${totalConcluidos} de ${META_MENSAL} chamados concluídos`;

    document.getElementById("ultimaAtualizacao").textContent =
        new Date().toLocaleString("pt-BR");

    atualizarTabela();
}

function atualizarTabela() {

    const tabela =
        document.getElementById("tabela");

    if (!tabela) return;

    if (dados.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhum registro encontrado
                </td>
            </tr>
        `;

        return;
    }

    let html = "";

    dados.forEach((item, indice) => {

        const status =
            Number(item.qtd) >= META_DIARIA
                ? '<span class="ok">✓ Meta atingida</span>'
                : '<span class="alerta">⚠ Abaixo da meta</span>';

        html += `
            <tr>
                <td>${item.data}</td>
                <td>${item.qtd}</td>
                <td>${status}</td>
                <td>
                    <button
                        class="btn-editar"
                        onclick="editarRegistro(${indice})">
                        ✏️
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirRegistro(${indice})">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    });

    tabela.innerHTML = html;
}

function adicionarRegistro() {

    const data =
        document.getElementById("data").value;

    const qtd = parseInt(
        document.getElementById("quantidade").value
    );

    if (!data) {
        alert("Informe a data.");
        return;
    }

    if (isNaN(qtd) || qtd < 0) {
        alert("Informe uma quantidade válida.");
        return;
    }

    if (indiceEdicao >= 0) {

        dados[indiceEdicao] = {
            data,
            qtd
        };

        indiceEdicao = -1;

        document.getElementById("btnSalvar").innerHTML =
            '<i class="fas fa-save"></i> Atualizar';

    } else {

        dados.push({
            data,
            qtd
        });
    }

    salvar();

    document.getElementById("data").value = "";
    document.getElementById("quantidade").value = "";

    atualizarDashboard();
}

function editarRegistro(indice) {

    document.getElementById("data").value =
        dados[indice].data;

    document.getElementById("quantidade").value =
        dados[indice].qtd;

    indiceEdicao = indice;

    document.getElementById("btnSalvar").innerHTML =
        '<i class="fas fa-save"></i> Salvar Alteração';
}

function excluirRegistro(indice) {

    if (
        !confirm(
            "Deseja realmente excluir este registro?"
        )
    ) {
        return;
    }

    dados.splice(indice, 1);

    salvar();

    atualizarDashboard();
}

function limparTudo() {

    if (
        !confirm(
            "Deseja apagar todos os registros?"
        )
    ) {
        return;
    }

    dados = [];

    indiceEdicao = -1;

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("data").value = "";
    document.getElementById("quantidade").value = "";

    atualizarDashboard();
}

window.addEventListener("load", () => {
    atualizarDashboard();
});
