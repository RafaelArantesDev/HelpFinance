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
const btnEnviar = document.getElementById("btnForm");

const filtroTipo = document.getElementById("filtro-tipo");
const campoHistorico = document.getElementById("lista-transacoes");

const historico = [];

// ========= FUNÇÕES ============

function listHistorico(historicoTransacoes) {
  historicoTransacoes.forEach((item) => {
    criarLinha(item)
  });
}

function criarLinha(transacao){
  const tr = document.createElement("tr");
    tr.dataset.id = transacao.id;

    const tdCategoria = document.createElement("td");
    tdCategoria.innerText = transacao.categoria;
    tdCategoria.classList.add("novosTh");

    const tdDescricao = document.createElement("td");
    tdDescricao.innerText = transacao.descricao;
    tdDescricao.classList.add("novosTh");

    const tdValor = document.createElement("td");
    tdValor.innerText = transacao.valor;
    tdValor.classList.add("novosTh");

    const tdTipo = document.createElement("td");
    tdTipo.innerText = transacao.tipo;
    tdTipo.classList.add("novosTh");

    const tdData = document.createElement("td");
    tdData.innerText = transacao.data;
    tdData.classList.add("novosTh");

    const tdBtn = document.createElement("td")
    const btnExcluir = document.createElement("button")
    btnExcluir.className = "excluir"
    btnExcluir.innerText = "Excluir"

    tdBtn.appendChild(btnExcluir)

    tr.append(tdDescricao, tdValor, tdCategoria, tdData, tdTipo, tdBtn);
    campoHistorico.appendChild(tr);
}

function calcEntradas(historico) {
  const valorTotal = historico.reduce((acc, item) => {
    if (item.tipo === "entradas") {
      return (acc += item.valor);
    } else {
      return acc;
    }
  }, 0);
  totalEntradas.innerText = "R$ " + valorTotal;
}

function calcSaidas(historico) {
  const valorTotal = historico.reduce((acc, item) => {
    if (item.tipo === "saidas") {
      return (acc += item.valor);
    } else {
      return acc;
    }
  }, 0);
  totalSaidas.innerText = "R$ -" + valorTotal;
}

function calcTotal(historico) {
  const valorTotal = historico.reduce((acc, item) => {
    if (item.tipo === "entradas") {
      return (acc += item.valor);
    } else if (item.tipo === "saidas") {
      return (acc -= item.valor);
    }else{
      alert("opção Inválida!")
      return acc
    }
  }, 0);
  totalSaldo.innerText = "R$ " + valorTotal;
}

function atualizarDados(historico){
  calcEntradas(historico);
  calcSaidas(historico);
  calcTotal(historico);
}

// ========= EVENTOS ============

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputs = document.querySelectorAll("input, select.select");
  let preenchidos = true;

  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      preenchidos = false;
    }
  });

  if (preenchidos) {
    const transacoes = {
      id: crypto.randomUUID(),
      descricao: inputDesc.value,
      valor: Number(inputValor.value),
      tipo: inputTipo.value,
      categoria: inputCategoria.value,
      data: inputData.value,
    };

    historico.push(transacoes);
    criarLinha(transacoes);

    atualizarDados(historico);
  } else {
    console.log("ainda falta inputs");
  }
});

filtroTipo.addEventListener("change", (event) => {

  limparTabela();

  const historicoFiltrado = historico.filter((item) => {
    if (filtroTipo.value === "todas") {
      return item;
    }
    return item.tipo === filtroTipo.value;
  });

  listHistorico(historicoFiltrado);
});

function limparTabela() {
  campoHistorico.innerHTML = "";
}

campoHistorico.addEventListener('click', (e) => {
  const targetEl = e.target

 if(targetEl.classList.contains('excluir')){
    console.log('clique correto botao excluir')
    const parentEl =  targetEl.closest('tr')
    const id = parentEl.dataset.id;

    const indice = historico.findIndex((item) =>{
    return id === item.id   
    })

    if (indice >= 0){
      parentEl.remove();
      historico.splice(indice, 1)
      atualizarDados(historico)
    }
  } 
})
