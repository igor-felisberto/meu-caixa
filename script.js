const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const tipo = document.getElementById("tipo");
const categoria = document.getElementById("categoria");
const adicionar = document.getElementById("adicionar");
const lista = document.getElementById("listaMovimentacoes");
let periodoAtual = "todos";
let graficoFinanceiro = null;
let indiceEditando = null;
let movimentacoes =

  JSON.parse(localStorage.getItem("movimentacoes")) || [];

function salvar() {
  localStorage.setItem(
    "movimentacoes",
    JSON.stringify(movimentacoes)
  );
}

function atualizarTela() {
  lista.innerHTML = "";

  let totalEntradas = 0;
  let totalGastos = 0;
  const hoje = new Date();

  const movimentacoesFiltradas = movimentacoes.filter(movimento => {
    if (periodoAtual === "todos") return true;

    const partes = movimento.data.split("/");
    const dataMovimento = new Date(
      Number(partes[2]),
      Number(partes[1]) - 1,
      Number(partes[0])
    );

    if (periodoAtual === "hoje") {
      return dataMovimento.toDateString() === hoje.toDateString();
    }

    if (periodoAtual === "semana") {
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      inicioSemana.setHours(0, 0, 0, 0);

      return dataMovimento >= inicioSemana && dataMovimento <= hoje;
    }

    if (periodoAtual === "mes") {
      return (
        dataMovimento.getMonth() === hoje.getMonth() &&
        dataMovimento.getFullYear() === hoje.getFullYear()
      );
    }

    return true;
  });

  if (movimentacoesFiltradas.length === 0) {
    lista.innerHTML =
      '<p class="vazio">Nenhuma movimentação ainda.</p>';
  }
  const listaCategorias = document.getElementById("listaCategorias");
  const totaisCategorias = {};

  movimentacoesFiltradas.forEach((movimento) => {
    if (movimento.tipo === "gasto") {
      const cat = movimento.categoria || "outros";

      if (!totaisCategorias[cat]) {
        totaisCategorias[cat] = 0;
      }

      totaisCategorias[cat] += movimento.valor;
    }
  });

  listaCategorias.innerHTML = "";

  const categorias = Object.entries(totaisCategorias);

  if (categorias.length === 0) {
    listaCategorias.innerHTML = "<p>Nenhum gasto por categoria ainda.</p>";
  } else {
    categorias.forEach(([categoria, total]) => {
      listaCategorias.innerHTML += `
        <p><strong>${categoria}</strong> — R$ ${total.toFixed(2)}</p>
      `;
    });
  }
  movimentacoesFiltradas.forEach((movimento) => {
    const indiceOriginal = movimentacoes.indexOf(movimento);

    if (movimento.tipo === "entrada") {
      totalEntradas += movimento.valor;
    } else {
      totalGastos += movimento.valor;
    }

    const item = document.createElement("div");
    item.classList.add(movimento.tipo);

    item.innerHTML = `
      <strong>${movimento.descricao}</strong>
      <small>${movimento.categoria || "outros"}</small>
      <span>
        ${movimento.tipo === "entrada" ? "+" : "-"}
        R$ ${movimento.valor.toFixed(2)}
      </span>
      <button class="btn-editar" data-index="${movimentacoes.indexOf(movimento)}">
  ✏️ Editar
</button>
      <button class="btn-excluir" data-index="${movimentacoes.indexOf(movimento)}">
      Excluir
    </button>
    `;

    lista.appendChild(item);
  });

  const saldo = totalEntradas - totalGastos;

  document.getElementById("totalEntradas").textContent =
    `R$ ${totalEntradas.toFixed(2)}`;

  document.getElementById("totalGastos").textContent =
    `R$ ${totalGastos.toFixed(2)}`;

  document.getElementById("saldo").textContent =
    `R$ ${saldo.toFixed(2)}`;
  if (graficoFinanceiro) {
    graficoFinanceiro.data.datasets[0].data = [
      totalEntradas,
      totalGastos
    ];

    graficoFinanceiro.update();
  }

}

adicionar.addEventListener("click", () => {

  const textoDescricao = descricao.value.trim();

  const numeroValor = Number(
    valor.value.replace(",", ".")
  );

  if (textoDescricao === "" || numeroValor <= 0) {
    alert("Preencha a descrição e o valor.");
    return;
  }
  if (indiceEditando !== null) {
    movimentacoes[indiceEditando] = {
      ...movimentacoes[indiceEditando],
      descricao: textoDescricao,
      valor: numeroValor,
      tipo: tipo.value
    };

    indiceEditando = null;

    salvar();
    atualizarTela();

    descricao.value = "";
    valor.value = "";
    tipo.value = "entrada";

    adicionar.textContent = "Adicionar movimentação";

    return;
  }

  movimentacoes.push({
    descricao: textoDescricao,
    valor: numeroValor,
    tipo: tipo.value,
    categoria: categoria.value,
    data: new Date().toLocaleDateString("pt-BR")
  });

  salvar();
  atualizarTela();

  descricao.value = "";
  valor.value = "";
  tipo.value = "entrada";
});

function excluirMovimentacao(index) {
  movimentacoes.splice(index, 1);

  salvar();
  atualizarTela();
}

atualizarTela();
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-excluir")) {
    const index = Number(event.target.dataset.index);
    excluirMovimentacao(index);
  }
  if (event.target.classList.contains("btn-editar")) {
    const index = Number(event.target.dataset.index);
    const movimento = movimentacoes[index];
    indiceEditando = index;
    descricao.value = movimento.descricao;
    valor.value = movimento.valor;
    tipo.value = movimento.tipo;
    adicionar.textContent = "Salvar alteração";
  }
});
// ===== FILTROS DE PERÍODO =====



const botoesFiltro = document.querySelectorAll(".filtro");

botoesFiltro.forEach(botao => {
  botao.addEventListener("click", () => {

    periodoAtual = botao.dataset.periodo;

    botoesFiltro.forEach(b => {
      b.classList.remove("ativo");
    });

    botao.classList.add("ativo");

    atualizarTela();
  });
});

// ===== GRÁFICO FINANCEIRO =====

const ctxGrafico = document.getElementById("graficoFinanceiro");

graficoFinanceiro = new Chart(ctxGrafico, {
  type: "bar",

  data: {
    labels: ["Entradas", "Gastos"],
    datasets: [{
      label: "R$",
      data: [0, 0],
      backgroundColor: [
        "#22c55e",
        "#ef4444"
      ],
      borderColor: [
        "#22c55e",
        "#ef4444"
      ],
      borderWidth: 2,
      borderRadius: 10
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      datalabels: {
        color: "#ffffff",
        anchor: "end",
        align: "top",
        font: {
          weight: "bold",
          size: 14
        },
        formatter: function (value) {
          return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          });
        }
      }
    }
  },
  plugins: [ChartDataLabels]

});

// ===== FECHAMENTO DO MÊS =====

const btnFecharMes = document.getElementById("btnFecharMes");

btnFecharMes.addEventListener("click", function () {

  const agora = new Date();
  const mes = agora.getMonth();
  const ano = agora.getFullYear();

  const movimentacoesDoMes = movimentacoes.filter((movimento) => {
    const partes = movimento.data.split("/");

    const diaMovimento = Number(partes[0]);
    const mesMovimento = Number(partes[1]) - 1;
    const anoMovimento = Number(partes[2]);

    return mesMovimento === mes && anoMovimento === ano;
  });

  let entradas = 0;
  let gastos = 0;

  movimentacoesDoMes.forEach((movimento) => {
    const valor = Number(movimento.valor);

    if (movimento.tipo === "entrada") {
      entradas += valor;
    } else {
      gastos += valor;
    }
  });

  const saldo = entradas - gastos;

  const modalFechamento = document.getElementById("modalFechamento");
  const modalEntradas = document.getElementById("modalEntradas");
  const modalGastos = document.getElementById("modalGastos");
  const modalSaldo = document.getElementById("modalSaldo");

  modalEntradas.textContent = entradas.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  modalGastos.textContent = gastos.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  modalSaldo.textContent = saldo.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  modalFechamento.classList.add("ativo");

  return;


});

// ===== HISTÓRICO MENSAL =====

const btnHistorico = document.getElementById("btnHistorico");
const listaHistorico = document.getElementById("listaHistorico");

btnHistorico.addEventListener("click", function () {
  const historico =
    JSON.parse(localStorage.getItem("historicoMensal")) || [];

  if (listaHistorico.style.display === "block") {
    listaHistorico.style.display = "none";
    btnHistorico.textContent = "Ver histórico";
    return;
  }

  listaHistorico.style.display = "block";
  btnHistorico.textContent = "Ocultar histórico";

  if (historico.length === 0) {
    listaHistorico.innerHTML = "<p>Nenhum mês fechado ainda.</p>";
    return;
  }

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  listaHistorico.innerHTML = historico
    .slice()
    .reverse()
    .map((item) => `
    <div class="item-historico">

      <div class="mes-historico">
        ${nomesMeses[item.mes - 1]} / ${item.ano}
      </div>

      <div class="valores-historico">

        <div class="mini-card entrada-historico">
          <span>Entradas</span>
          <strong>R$ ${item.entradas.toFixed(2)}</strong>
        </div>

        <div class="mini-card gasto-historico">
          <span>Gastos</span>
          <strong>R$ ${item.gastos.toFixed(2)}</strong>
        </div>

        <div class="mini-card saldo-historico ${item.saldo < 0 ? "saldo-negativo" : ""}">
          <span>Saldo</span>
          <strong>R$ ${item.saldo.toFixed(2)}</strong>
        </div>

      </div>
    </div>
  `)
    .join("");
});

// ===== BOTÕES DO MODAL DE FECHAMENTO =====

const modalFechamentoEl = document.getElementById("modalFechamento");
const cancelarFechamento = document.getElementById("cancelarFechamento");
const confirmarFechamento = document.getElementById("confirmarFechamento");

cancelarFechamento.addEventListener("click", function () {
  modalFechamentoEl.classList.remove("ativo");
});

confirmarFechamento.addEventListener("click", function () {

  const agora = new Date();
  const mes = agora.getMonth();
  const ano = agora.getFullYear();

  const movimentacoesDoMes = movimentacoes.filter((movimento) => {
    const partes = movimento.data.split("/");
    const mesMovimento = Number(partes[1]) - 1;
    const anoMovimento = Number(partes[2]);

    return mesMovimento === mes && anoMovimento === ano;
  });

  let entradas = 0;
  let gastos = 0;

  movimentacoesDoMes.forEach((movimento) => {
    const valor = Number(movimento.valor);

    if (movimento.tipo === "entrada") {
      entradas += valor;
    } else {
      gastos += valor;
    }
  });

  const saldo = entradas - gastos;

  const historico =
    JSON.parse(localStorage.getItem("historicoMensal")) || [];

  const mesJaFechado = historico.some((item) => {
    return item.mes === mes + 1 && item.ano === ano;
  });

  if (mesJaFechado) {
    mostrarToast("⚠️ Este mês já foi fechado!");
    modalFechamentoEl.classList.remove("ativo");
    return;
  }

  historico.push({
    mes: mes + 1,
    ano: ano,
    entradas: entradas,
    gastos: gastos,
    saldo: saldo,
    fechadoEm: agora.toISOString()
  });

  localStorage.setItem(
    "historicoMensal",
    JSON.stringify(historico)
  );

  modalFechamentoEl.classList.remove("ativo");

  mostrarToast("✅ Fechamento do mês salvo com sucesso!");
});

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");

  toast.textContent = mensagem;
  toast.classList.add("ativo");

  setTimeout(() => {
    toast.classList.remove("ativo");
  }, 3000);
}

// ===== SERVICE WORKER =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        console.log("Service Worker registrado!");
      })
      .catch((erro) => {
        console.log("Erro no Service Worker:", erro);
      });
  });
}