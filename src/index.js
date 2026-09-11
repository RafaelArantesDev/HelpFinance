// ========= SELEÇÃO DE ELEMENTOS ============

const form = document.getElementById("form");
const totalEntradas = document.getElementById("value-entrada");
const totalSaldo = document.getElementById("value-total");
const totalSaidas = document.getElementById("value-saida");

const inputDesc = document.getElementById("descricao");
const inputValor = document.getElementById("valor");
const inputData = document.getElementById("data-transacao");
const inputTipo = document.getElementById("tipo");
const inputCategoria = document.getElementById("categoria");

const filtroTipo = document.getElementById("filtro-tipo");
const campoHistorico = document.getElementById("lista-transacoes");

// ========= DADOS ============

const historico = [];

historico.push(...carregarHistorico());

listHistorico(historico);
atualizarDados(historico);

// ========= FUNÇÕES ============

function listHistorico(historicoTransacoes) {
  historicoTransacoes.forEach((item) => {
    criarLinha(item);
  });
}

function criarLinha(transacao) {
  const tr = document.createElement("tr");

  tr.dataset.id = transacao.id;

  const tdCategoria = document.createElement("td");
  tdCategoria.innerText = transacao.categoria;
  tdCategoria.classList.add("novosTh");

  const tdDescricao = document.createElement("td");
  tdDescricao.innerText = transacao.descricao;
  tdDescricao.classList.add("novosTh");

  const tdValor = document.createElement("td");
  tdValor.innerText = formatarValor(transacao.valor);
  tdValor.classList.add("novosTh");

  const tdTipo = document.createElement("td");
  tdTipo.innerText = transacao.tipo;
  tdTipo.classList.add("novosTh");

  const tdData = document.createElement("td");
  tdData.innerText = transacao.data;
  tdData.classList.add("novosTh");

  const tdBtn = document.createElement("td");

  const btnExcluir = document.createElement("button");
  btnExcluir.className = "excluir";
  btnExcluir.innerText = "Excluir";

  tdBtn.appendChild(btnExcluir);

  tr.append(
    tdDescricao,
    tdValor,
    tdCategoria,
    tdData,
    tdTipo,
    tdBtn
  );

  campoHistorico.appendChild(tr);
}

function calcEntradas(historico) {
  const valorTotal = historico.reduce((acc, item) => {
    if (item.tipo === "entradas") {
      return acc + item.valor;
    }

    return acc;
  }, 0);

  totalEntradas.innerText = `R$ ${formatarValor(valorTotal)}`;
}

function calcSaidas(historico) {
  const valorTotal = historico.reduce((acc, item) => {
    if (item.tipo === "saidas") {
      return acc + item.valor;
    }

    return acc;
  }, 0);

  totalSaidas.innerText = `R$ -${formatarValor(valorTotal)}`;
}

function calcTotal(historico) {
  const valorTotal = historico.reduce((acc, item) => {
    if (item.tipo === "entradas") {
      return acc + item.valor;
    }

    if (item.tipo === "saidas") {
      return acc - item.valor;
    }

    return acc;
  }, 0);

  totalSaldo.innerText = `R$ ${formatarValor(valorTotal)}`;
}

function atualizarDados(historico) {
  calcEntradas(historico);
  calcSaidas(historico);
  calcTotal(historico);
}

function filtrarTransacoes(historico, tipo) {
  const historicoFiltrado = historico.filter((item) => {
    if (tipo === "todas") {
      return true;
    }

    return item.tipo === tipo;
  });

  return historicoFiltrado;
}

function salvaHistorico(historico) {
  localStorage.setItem("historico", JSON.stringify(historico));
}

function carregarHistorico() {
  const dados = localStorage.getItem("historico");

  if (dados !== null) {
    return JSON.parse(dados);
  }

  return [];
}

function limparTabela() {
  campoHistorico.innerHTML = "";
}

function limparInputs() {
  inputCategoria.value = "";
  inputData.value = "";
  inputDesc.value = "";
  inputTipo.value = "";
  inputValor.value = "";
}

// ========= TRATAMENTO DO VALOR ============

function validarTeclaValor(event) {
  const teclasPermitidas = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    ",",
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Home",
    "End"
  ];

  // Permite atalhos como Ctrl+C, Ctrl+V, Ctrl+A
  if (event.ctrlKey || event.metaKey) {
    return;
  }

  if (!teclasPermitidas.includes(event.key)) {
    event.preventDefault();
  }
}

function validarFormatoValor(valor) {
  /*
    Aceita:
    500
    500,50
    1250,50
    1.250,50
    12.546,34
    1.250.000,50
  */

  const padraoMonetario =
    /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/;

  return padraoMonetario.test(valor);
}

function converterValor(valor) {
  const valorNormalizado = valor
    .replaceAll(".", "")
    .replace(",", ".");

  return Number(valorNormalizado);
}

function formatarValor(valor) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

// ========= EVENTOS ============

inputValor.addEventListener("keydown", validarTeclaValor);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputs = document.querySelectorAll(
    "input, select.select"
  );

  let preenchidos = true;

  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      preenchidos = false;
    }
  });

  if (!preenchidos) {
    console.log("Ainda faltam campos para preencher");
    return;
  }

  if (!validarFormatoValor(inputValor.value)) {
    alert(
      "Digite um valor válido. Exemplos: 500,00 | 1250,50 | 1.250,50"
    );

    inputValor.focus();

    return;
  }

  const valorConvertido =
    converterValor(inputValor.value);

  const transacoes = {
    id: crypto.randomUUID(),
    descricao: inputDesc.value,
    valor: valorConvertido,
    tipo: inputTipo.value,
    categoria: inputCategoria.value,
    data: inputData.value
  };

  historico.push(transacoes);

  criarLinha(transacoes);

  atualizarDados(historico);

  salvaHistorico(historico);

  limparInputs();
});

filtroTipo.addEventListener("change", () => {
  limparTabela();

  const filtro = filtrarTransacoes(
    historico,
    filtroTipo.value
  );

  listHistorico(filtro);
});

campoHistorico.addEventListener("click", (e) => {
  const targetEl = e.target;

  if (targetEl.classList.contains("excluir")) {
    const parentEl = targetEl.closest("tr");

    const id = parentEl.dataset.id;

    const indice = historico.findIndex((item) => {
      return id === item.id;
    });

    if (indice >= 0) {
      parentEl.remove();

      historico.splice(indice, 1);

      salvaHistorico(historico);

      atualizarDados(historico);
    }
  }
});