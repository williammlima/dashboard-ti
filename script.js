let dados = JSON.parse(localStorage.getItem('chamados')) || [];

let indiceEdicao = -1;

const META_MENSAL = 60;
const META_DIARIA = 4;

function salvar() {
    localStorage.setItem(
        'chamados',
        JSON.stringify(dados)
    );
}

function atualizarDashboard() {

    let totalConcluidos = 0;

    dados.forEach(item => {
        totalConcluidos += Number(item.qtd) || 0;
    });

    let pendentes =
        Math.max(META_MENSAL - totalConcluidos, 0);

    let percentual =
        (totalConcluidos / META_MENSAL) * 100;

    if (percentual > 100) {
        percentual = 100;
    }

    document.getElementById('total').innerText =
        META_MENSAL;

    document.getElementById('concluidos').innerText =
        totalConcluidos;

    document.getElementById('pendentes').innerText =
        pendentes;

    document.getElementById('percentual').innerText =
        percentual.toFixed(1) + '%';

    document.getElementById('barra').style.width =
        percentual + '%';

    document.getElementById('txtProgresso').innerText =
        `${totalConcluidos} de ${META_MENSAL} chamados concluídos`;

    document.getElementById(
        'ultimaAtualizacao'
    ).innerText =
        new Date().toLocaleString('pt-BR');

    atualizarTabela();

    salvar();
}

function atualizarTabela() {

    let html = '';

    dados.forEach((item, indice) => {

        let status =
            item.qtd >= META_DIARIA
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

                    <i class="fas fa-edit"></i>

                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirRegistro(${indice})">

                    <i class="fas fa-trash"></i>

                </button>

            </td>

        </tr>
        `;
    });

    document.getElementById('tabela').innerHTML =
        html;
}

function adicionarRegistro() {

    let data =
        document.getElementById('data').value;

    let qtd =
        parseInt(
            document.getElementById('quantidade').value
        );

    if (!data || isNaN(qtd)) {

        alert('Preencha todos os campos.');

        return;
    }

    if (indiceEdicao >= 0) {

        dados[indiceEdicao] = {
            data: data,
            qtd: qtd
        };

        indiceEdicao = -1;

        document.getElementById('btnSalvar').innerHTML =
            '<i class="fas fa-save"></i> Atualizar';

    } else {

        dados.push({
            data: data,
            qtd: qtd
        });

    }

    document.getElementById('data').value = '';
    document.getElementById('quantidade').value = '';

    atualizarDashboard();
}

function editarRegistro(indice) {

    document.getElementById('data').value =
        dados[indice].data;

    document.getElementById('quantidade').value =
        dados[indice].qtd;

    indiceEdicao = indice;

    document.getElementById('btnSalvar').innerHTML =
        '<i class="fas fa-save"></i> Salvar Alteração';
}

function excluirRegistro(indice) {

    if (confirm('Deseja realmente excluir este registro?')) {

        dados.splice(indice, 1);

        atualizarDashboard();
    }
}

function limparTudo() {

    if (confirm('Deseja apagar todos os registros?')) {

        dados = [];

        localStorage.removeItem('chamados');

        atualizarDashboard();
    }
}

atualizarDashboard();