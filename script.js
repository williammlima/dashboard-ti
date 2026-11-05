let dados = JSON.parse(localStorage.getItem('chamados')) || [];

let indiceEdicao = -1;

const META_MENSAL = 60;
const META_DIARIA = 1;

function salvar() {
    localStorage.setItem('chamados', JSON.stringify(dados));
}

function atualizarDashboard() {

    let totalConcluidos = dados.reduce(
        (total, item) => total + Number(item.qtd || 0),
        0
    );

    let pendentes = Math.max(
        META_MENSAL - totalConcluidos,
        0
    );

    let percentual =
        (totalConcluidos / META_MENSAL) * 100;

    percentual = Math.min(percentual, 100);

    document.getElementById('total').textContent =
        META_MENSAL;

    document.getElementById('concluidos').textContent =
        totalConcluidos;

    document.getElementById('pendentes').textContent =
        pendentes;

    document.getElementById('percentual').textContent =
        percentual.toFixed(1) + '%';

    document.getElementById('barra').style.width =
        percentual + '%';

    document.getElementById('txtProgresso').textContent =
        `${totalConcluidos} de ${META_MENSAL} chamados concluídos`;

    document.getElementById('ultimaAtualizacao').textContent =
        new Date().toLocaleString('pt-BR');

    atualizarTabela();

    salvar();
}

function atualizarTabela() {

    const tabela =
        document.getElementById('tabela');

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

    let html = '';

    dados.forEach((item, indice) => {

        let status =
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
                        onclick="editarRegistro(${indice})"
                        title="Editar">
                        ✏️
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirRegistro(${indice})"
                        title="Excluir">
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
        document.getElementById('data').value;

    const qtd = parseInt(
        document.getElementById('quantidade').value
    );

    if (!data) {
        alert('Informe a data.');
        return;
    }

    if (isNaN(qtd) || qtd < 0) {
        alert('Informe uma quantidade válida.');
        return;
    }

    if (indiceEdicao >= 0) {

        dados[indiceEdicao] = {
            data,
            qtd
        };

        indiceEdicao = -1;

        document.getElementById('btnSalvar').innerHTML =
            'Atualizar';

    } else {

        dados.push({
            data,
            qtd
        });
    }

    document.getElementById('data').value = '';
    document.getElementById('quantidade').value = '';

    atualizarDashboard();
}

function editarRegistro(indice) {

    if (
        indice < 0 ||
        indice >= dados.length
    ) {
        return;
    }

    document.getElementById('data').value =
        dados[indice].data;

    document.getElementById('quantidade').value =
        dados[indice].qtd;

    indiceEdicao = indice;

    document.getElementById('btnSalvar').innerHTML =
        'Salvar Alteração';
}

function excluirRegistro(indice) {

    if (
        indice < 0 ||
        indice >= dados.length
    ) {
        return;
    }

    const confirmar = confirm(
        'Deseja realmente excluir este registro?'
    );

    if (!confirmar) {
        return;
    }

    dados.splice(indice, 1);

    if (indiceEdicao === indice) {
        indiceEdicao = -1;
    }

    atualizarDashboard();
}

function limparTudo() {

    const confirmar = confirm(
        'Deseja apagar todos os registros?'
    );

    if (!confirmar) {
        return;
    }

    dados = [];

    indiceEdicao = -1;

    localStorage.removeItem('chamados');

    document.getElementById('data').value = '';
    document.getElementById('quantidade').value = '';

    atualizarDashboard();
}

window.onload = function () {
    atualizarDashboard();
};
