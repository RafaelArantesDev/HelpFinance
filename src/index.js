
// ========= SELEÇÃO DE ELEMENTOS ============

const form = document.getElementById('form')
const totalEntradas = document.getElementById('value-entrada')
const totalSaldo = document.getElementById('value-total')
const totalSaidas = document.getElementById('value-saida')


const inputDesc = document.getElementById('descricao')
const inputValor = document.getElementById('valor')
const inputData = document.getElementById('data-transacao')
const inputTipo = document.getElementById('tipo')
const inputCategoria = document.getElementById('categoria')
const btnEnviar = document.getElementById('btnForm')

const filtroTipo = document.getElementById('filtro-tipo')
const campoHistorico = document.getElementById('lista-transacoes')

const historico = []

// ========= FUNÇÕES ============
function listHistorico (historico){
    const ultimo = []
    ultimo.push(historico[historico.length-1])

    ultimo.forEach( (item) =>{
    const tr = document.createElement('tr')

    const tdCategoria = document.createElement('td')
    tdCategoria.innerText = item.categoria
    tdCategoria.classList.add('novosTh')

    const tdDescricao = document.createElement('td')
    tdDescricao.innerText = item.descricao
    tdDescricao.classList.add('novosTh')

    const tdValor = document.createElement('td')
    tdValor.innerText = item.valor
    tdValor.classList.add('novosTh')

    const tdTipo = document.createElement('td')
    tdTipo.innerText = item.tipo
    tdTipo.classList.add('novosTh')

    const tdData = document.createElement('td')
    tdData.innerText = item.data
    tdData.classList.add('novosTh')

    tr.append(tdDescricao, tdValor, tdCategoria, tdData, tdTipo)
    campoHistorico.appendChild(tr)})
    calcEntradas(historico)
    calcSaidas(historico)
    calcTotal(historico)
}

function calcEntradas (historico){
    const valorTotal = historico.reduce( (acc, item ) => {
        if(item.tipo === "entradas"){
            return acc += item.valor
        }else {
            return acc 
        }
        
    },0)
    // console.log(valorTotal)
    totalEntradas.innerText = 'R$ ' + valorTotal
}

function calcSaidas (historico){
    const valorTotal = historico.reduce( (acc, item ) => {
        if(item.tipo === "saidas"){
            return acc += item.valor
        }else {
            return acc 
        }
        
    },0)
    // console.log(valorTotal)
    totalSaidas.innerText = 'R$ -' + valorTotal
}

function calcTotal (historico){
    const valorTotal = historico.reduce( (acc, item ) => {
        if(item.tipo === "entradas"){
            return acc += item.valor
        }else if (item.tipo === "saidas") {
            return acc -= item.valor
        }
        
    },0)
    // console.log(valorTotal)
    totalSaldo.innerText = 'R$ ' + valorTotal
}



// ========= EVENTOS ============

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const inputs = document.querySelectorAll('input, select.select')
    let preenchidos = true

    inputs.forEach( input =>{
        if (input.value.trim() === "") {
            preenchidos = false
        }
    })

    if(preenchidos){
       const transacoes = {
        descricao:inputDesc.value, 
        valor: Number(inputValor.value),
        tipo: inputTipo.value,
        categoria: inputCategoria.value,
        data: inputData.value}

        historico.push(transacoes)

        // console.log(typeof transacoes.valor)
        // console.log(historico)
    }else {
        console.log('ainda falta inputs')
    }

    listHistorico(historico)
})


filtroTipo.addEventListener('change', (event) => {
    // event.preventDefault()
    
    limparTabela()
  
    const historicoFiltrado = historico.filter( (item) => {
        if(filtroTipo.value === "todas"){
            return item
        }
        return item.tipo === filtroTipo.value
    })

    listHistorico(historicoFiltrado)
    
   

    // console.log(filtroTipo.value)
    // console.log(historicoFiltrado)
})

function limparTabela (){
    campoHistorico.innerHTML = ''
}