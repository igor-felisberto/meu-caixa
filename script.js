// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
  "https://ktlzfjelnzijwjwuktxm.supabase.co";

const SUPABASE_ANON_KEY =
 sb_publishable_n7fT_UhG9wQiqoFfSYb6xQ_w5zT4tGF
const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


// =====================================================
// ELEMENTOS DO LOGIN
// =====================================================

const telaLogin =
  document.getElementById("telaLogin");

const sistema =
  document.getElementById("sistema");

const formLogin =
  document.getElementById("formLogin");

const emailLogin =
  document.getElementById("emailLogin");

const senhaLogin =
  document.getElementById("senhaLogin");

const btnLogin =
  document.getElementById("btnLogin");

const erroLogin =
  document.getElementById("erroLogin");

const usuarioLogado =
  document.getElementById("usuarioLogado");

const btnSair =
  document.getElementById("btnSair");


// =====================================================
// RECUPERAÇÃO DE SENHA
// =====================================================

const btnEsqueciSenha =
  document.getElementById("btnEsqueciSenha");

const recuperacaoSenha =
  document.getElementById("recuperacaoSenha");

const emailRecuperacao =
  document.getElementById("emailRecuperacao");

const btnEnviarRecuperacao =
  document.getElementById("btnEnviarRecuperacao");

const btnVoltarLogin =
  document.getElementById("btnVoltarLogin");

const mensagemRecuperacao =
  document.getElementById("mensagemRecuperacao");

const telaNovaSenha =
  document.getElementById("telaNovaSenha");

const novaSenha =
  document.getElementById("novaSenha");

const confirmarNovaSenha =
  document.getElementById("confirmarNovaSenha");

const btnSalvarNovaSenha =
  document.getElementById("btnSalvarNovaSenha");

const mensagemNovaSenha =
  document.getElementById("mensagemNovaSenha");

// =====================================================
// CONFIGURAÇÃO DE RECUPERAÇÃO DE SENHA
// =====================================================

const URL_RECUPERACAO =
  "https://igor-felisberto.github.io/meu-caixa/";

// Detecta se o usuário acabou de voltar pelo link
// de recuperação enviado pelo Supabase.
let modoRecuperacao = false;

function detectarRecuperacao() {

  const hash = window.location.hash || "";
  const search = window.location.search || "";

  if (
    hash.includes("type=recovery") ||
    search.includes("type=recovery")
  ) {
    modoRecuperacao = true;
    return true;
  }

  return false;
}

detectarRecuperacao();


// =====================================================
// ABRIR RECUPERAÇÃO
// =====================================================

btnEsqueciSenha.addEventListener(
  "click",
  function () {

    formLogin.style.display = "none";
    erroLogin.style.display = "none";

    recuperacaoSenha.style.display = "block";
    telaNovaSenha.style.display = "none";

    mensagemRecuperacao.textContent = "";

    emailRecuperacao.value =
      emailLogin.value.trim();

  }
);


// =====================================================
// VOLTAR PARA LOGIN
// =====================================================

btnVoltarLogin.addEventListener(
  "click",
  function () {

    modoRecuperacao = false;

    recuperacaoSenha.style.display = "none";
    telaNovaSenha.style.display = "none";

    formLogin.style.display = "block";

    mensagemRecuperacao.textContent = "";
    mensagemNovaSenha.textContent = "";

    // Limpa possível token da URL
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname
      );
    }

  }
);


// =====================================================
// ENVIAR E-MAIL DE RECUPERAÇÃO
// =====================================================

btnEnviarRecuperacao.addEventListener(
  "click",
  async function () {

    const email = emailRecuperacao.value.trim();

    if (!email) {
      mensagemRecuperacao.textContent =
        "Digite seu e-mail.";

      mensagemRecuperacao.style.color =
        "#b91c1c";

      return;
    }

    btnEnviarRecuperacao.disabled = true;
    btnEnviarRecuperacao.textContent = "Enviando...";

    mensagemRecuperacao.textContent =
      "Enviando o link de recuperação...";

    mensagemRecuperacao.style.color =
      "#6b7280";

    try {

      const { error } =
        await supabaseClient.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
              "https://igor-felisberto.github.io/meu-caixa/"
          }
        );

      if (error) {

        console.error(
          "ERRO SUPABASE RECUPERAÇÃO:",
          error
        );

        mensagemRecuperacao.textContent =
          "Erro: " + error.message;

        mensagemRecuperacao.style.color =
          "#b91c1c";

        return;
      }

      mensagemRecuperacao.textContent =
        "✅ Link enviado! Verifique seu e-mail.";

      mensagemRecuperacao.style.color =
        "#15803d";

    } catch (erro) {

      console.error(
        "ERRO AO ENVIAR RECUPERAÇÃO:",
        erro
      );

      mensagemRecuperacao.textContent =
        "Erro ao enviar o link.";

      mensagemRecuperacao.style.color =
        "#b91c1c";

    } finally {

      btnEnviarRecuperacao.disabled = false;
      btnEnviarRecuperacao.textContent =
        "Enviar link";
    }
  }
);


// =====================================================
// MOSTRAR TELA DE NOVA SENHA
// =====================================================

function mostrarTelaNovaSenha() {

  modoRecuperacao = true;

  telaLogin.style.display = "flex";

  sistema.style.display = "none";

  formLogin.style.display = "none";

  recuperacaoSenha.style.display = "none";

  erroLogin.style.display = "none";

  telaNovaSenha.style.display = "block";

  novaSenha.value = "";

  confirmarNovaSenha.value = "";

  mensagemNovaSenha.textContent = "";
}


// =====================================================
// SALVAR NOVA SENHA
// =====================================================

btnSalvarNovaSenha.addEventListener(
  "click",
  async function () {

    const senha = novaSenha.value;
    const confirmacao = confirmarNovaSenha.value;

    if (senha.length < 6) {

      mensagemNovaSenha.textContent =
        "A senha precisa ter pelo menos 6 caracteres.";

      mensagemNovaSenha.style.color =
        "#b91c1c";

      return;
    }

    if (senha !== confirmacao) {

      mensagemNovaSenha.textContent =
        "As senhas não são iguais.";

      mensagemNovaSenha.style.color =
        "#b91c1c";

      return;
    }

    btnSalvarNovaSenha.disabled = true;

    btnSalvarNovaSenha.textContent =
      "Salvando...";

    try {

      const { error } =
        await supabaseClient.auth.updateUser({
          password: senha
        });

      if (error) {

        console.error(
          "ERRO AO ALTERAR SENHA:",
          error
        );

        mensagemNovaSenha.textContent =
          "Erro: " + error.message;

        mensagemNovaSenha.style.color =
          "#b91c1c";

        return;
      }

      mensagemNovaSenha.textContent =
        "✅ Senha alterada com sucesso!";

      mensagemNovaSenha.style.color =
        "#15803d";

      setTimeout(
        async function () {

          modoRecuperacao = false;

          await supabaseClient.auth.signOut();

          telaNovaSenha.style.display = "none";

          formLogin.style.display = "block";

          sistema.style.display = "none";

          emailLogin.value =
            emailRecuperacao.value.trim();

          senhaLogin.value = "";

          mensagemNovaSenha.textContent = "";

          history.replaceState(
            null,
            "",
            window.location.pathname
          );

          btnSalvarNovaSenha.disabled = false;

          btnSalvarNovaSenha.textContent =
            "Salvar nova senha";

        },
        1500
      );

    } catch (erro) {

      console.error(
        "ERRO INESPERADO AO ALTERAR SENHA:",
        erro
      );

      mensagemNovaSenha.textContent =
        "Erro ao alterar a senha.";

      mensagemNovaSenha.style.color =
        "#b91c1c";

    } finally {

      btnSalvarNovaSenha.disabled = false;

      btnSalvarNovaSenha.textContent =
        "Salvar nova senha";
    }
  }
);

// =====================================================
// MOSTRAR ERRO DE LOGIN
// =====================================================

function mostrarErroLogin(
  mensagem
) {

  erroLogin.textContent =
    mensagem;

  erroLogin.style.display =
    "block";

}


// =====================================================
// ESCONDER ERRO
// =====================================================

function esconderErroLogin() {

  erroLogin.textContent =
    "";

  erroLogin.style.display =
    "none";

}


// =====================================================
// MOSTRAR SISTEMA
// =====================================================

function mostrarSistema(
  usuario
) {

  // NUNCA abrir o caixa durante recuperação
  if (modoRecuperacao) {
    return;
  }

  telaLogin.style.display =
    "none";

  sistema.style.display =
    "block";


  if (
    usuario &&
    usuario.email
  ) {

    usuarioLogado.textContent =
      "👤 " + usuario.email;

  }


  atualizarTela();

}


// =====================================================
// MOSTRAR LOGIN
// =====================================================

function mostrarLogin() {

  // Se estiver recuperando senha,
  // não mostrar o login normal.
  if (modoRecuperacao) {
    return;
  }

  telaLogin.style.display =
    "flex";

  sistema.style.display =
    "none";

}


// =====================================================
// LOGIN
// =====================================================

formLogin.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    esconderErroLogin();

    const email =
      emailLogin.value.trim();

    const senha =
      senhaLogin.value;


    if (
      !email ||
      !senha
    ) {

      mostrarErroLogin(
        "Digite seu e-mail e sua senha."
      );

      return;
    }


    btnLogin.disabled =
      true;

    btnLogin.textContent =
      "Entrando...";


    const {
      data,
      error
    } =
      await supabaseClient.auth
        .signInWithPassword({
          email:
            email,

          password:
            senha
        });


    if (error) {

      console.error(
        "Erro no login:",
        error
      );

      mostrarErroLogin(
        "E-mail ou senha incorretos."
      );

      btnLogin.disabled =
        false;

      btnLogin.textContent =
        "Entrar";

      return;
    }


    if (
      data &&
      data.user
    ) {

      modoRecuperacao =
        false;

      mostrarSistema(
        data.user
      );

    }


    btnLogin.disabled =
      false;

    btnLogin.textContent =
      "Entrar";

  }
);


// =====================================================
// LOGOUT
// =====================================================

btnSair.addEventListener(
  "click",
  async function () {

    const confirmar =
      confirm(
        "Deseja sair do MEU CAIXA?"
      );


    if (!confirmar) {
      return;
    }


    await supabaseClient.auth
      .signOut();


    modoRecuperacao =
      false;

    mostrarLogin();


    emailLogin.value =
      "";

    senhaLogin.value =
      "";

  }
);

// =====================================================
// OBSERVAR EVENTOS DO SUPABASE
// =====================================================

supabaseClient.auth.onAuthStateChange(
  function (event, session) {

    console.log(
      "EVENTO SUPABASE:",
      event
    );

    // ===============================================
    // RECUPERAÇÃO DE SENHA
    // ===============================================

    if (event === "PASSWORD_RECOVERY") {

      console.log(
        "🔐 RECUPERAÇÃO DE SENHA DETECTADA"
      );

      modoRecuperacao = true;

      mostrarTelaNovaSenha();

      return;
    }

    // ===============================================
    // LOGIN NORMAL
    // ===============================================

    if (
      event === "SIGNED_IN" &&
      session &&
      session.user
    ) {

      if (modoRecuperacao) {
        return;
      }

      mostrarSistema(
        session.user
      );

      return;
    }

    // ===============================================
    // LOGOUT
    // ===============================================

    if (event === "SIGNED_OUT") {

      if (modoRecuperacao) {
        return;
      }

      mostrarLogin();
    }
  }
);
    // ===============================================
    // RECUPERAÇÃO DE SENHA
    // ===============================================

    if (
      event ===
      "PASSWORD_RECOVERY"
    ) {

      console.log(
        "🔐 RECUPERAÇÃO DE SENHA DETECTADA"
      );

      modoRecuperacao =
        true;

      mostrarTelaNovaSenha();

      return;
    }


    // ===============================================
    // LOGIN NORMAL
    // ===============================================

    if (
      event ===
        "SIGNED_IN" &&
      session &&
      session.user
    ) {

      // Não deixar SIGNED_IN
      // atropelar recuperação.
      if (modoRecuperacao) {
        return;
      }

      mostrarSistema(
        session.user
      );

      return;
    }


    // ===============================================
    // LOGOUT
    // ===============================================

    if (
      event ===
      "SIGNED_OUT"
    ) {

      if (modoRecuperacao) {
        return;
      }

      mostrarLogin();

    }

  }
);


// =====================================================
// VERIFICAR SESSÃO
// =====================================================

async function verificarSessao() {

  // Se voltou pelo link de recuperação,
  // NÃO abrir o sistema financeiro.
  if (detectarRecuperacao()) {

    modoRecuperacao =
      true;

    mostrarTelaNovaSenha();

    return;
  }


  const {
    data,
    error
  } =
    await supabaseClient.auth
      .getSession();


  if (error) {

    console.error(
      "Erro ao verificar sessão:",
      error
    );

    mostrarLogin();

    return;
  }


  if (
    data &&
    data.session
  ) {

    if (!modoRecuperacao) {

      mostrarSistema(
        data.session.user
      );

    }

  } else {

    mostrarLogin();

  }

}

// =====================================================
// VARIÁVEIS DO CAIXA
// =====================================================

const descricao =
  document.getElementById(
    "descricao"
  );

const valor =
  document.getElementById(
    "valor"
  );

const tipo =
  document.getElementById(
    "tipo"
  );

const categoria =
  document.getElementById(
    "categoria"
  );

const adicionar =
  document.getElementById(
    "adicionar"
  );

const lista =
  document.getElementById(
    "listaMovimentacoes"
  );


let periodoAtual =
  "todos";

let graficoFinanceiro =
  null;

let indiceEditando =
  null;


let movimentacoes =
  JSON.parse(
    localStorage.getItem(
      "movimentacoes"
    )
  ) || [];


// =====================================================
// SALVAR
// =====================================================

function salvar() {

  localStorage.setItem(
    "movimentacoes",
    JSON.stringify(
      movimentacoes
    )
  );

}


// =====================================================
// ATUALIZAR TELA
// =====================================================

function atualizarTela() {

  if (!lista) {
    return;
  }


  lista.innerHTML =
    "";


  let totalEntradas =
    0;

  let totalGastos =
    0;


  const hoje =
    new Date();


  const movimentacoesFiltradas =
    movimentacoes.filter(
      movimento => {

        if (
          periodoAtual ===
          "todos"
        ) {

          return true;

        }


        const partes =
          movimento.data.split(
            "/"
          );


        const dataMovimento =
          new Date(
            Number(partes[2]),
            Number(partes[1]) - 1,
            Number(partes[0])
          );


        if (
          periodoAtual ===
          "hoje"
        ) {

          return (
            dataMovimento.toDateString() ===
            hoje.toDateString()
          );

        }


        if (
          periodoAtual ===
          "semana"
        ) {

          const inicioSemana =
            new Date(
              hoje
            );


          inicioSemana.setDate(
            hoje.getDate() -
            hoje.getDay()
          );


          inicioSemana.setHours(
            0,
            0,
            0,
            0
          );


          return (
            dataMovimento >=
              inicioSemana &&
            dataMovimento <=
              hoje
          );

        }


        if (
          periodoAtual ===
          "mes"
        ) {

          return (
            dataMovimento.getMonth() ===
              hoje.getMonth() &&
            dataMovimento.getFullYear() ===
              hoje.getFullYear()
          );

        }


        return true;

      }
    );


  if (
    movimentacoesFiltradas.length ===
    0
  ) {

    lista.innerHTML =
      '<p class="vazio">Nenhuma movimentação ainda.</p>';

  }


  // ===================================================
  // CATEGORIAS
  // ===================================================

  const listaCategorias =
    document.getElementById(
      "listaCategorias"
    );


  const totaisCategorias =
    {};


  movimentacoesFiltradas.forEach(
    movimento => {

      if (
        movimento.tipo ===
        "gasto"
      ) {

        const cat =
          movimento.categoria ||
          "outros";


        if (
          !totaisCategorias[cat]
        ) {

          totaisCategorias[cat] =
            0;

        }


        totaisCategorias[cat] +=
          Number(
            movimento.valor
          );

      }

    }
  );


  listaCategorias.innerHTML =
    "";


  const categorias =
    Object.entries(
      totaisCategorias
    );


  if (
    categorias.length ===
    0
  ) {

    listaCategorias.innerHTML =
      "<p>Nenhum gasto por categoria ainda.</p>";

  } else {

    categorias.forEach(
      ([categoria, total]) => {

        listaCategorias.innerHTML += `
          <p>
            <strong>${categoria}</strong>
            — R$ ${total.toFixed(2)}
          </p>
        `;

      }
    );

  }


  // ===================================================
  // MOVIMENTAÇÕES
  // ===================================================

  movimentacoesFiltradas.forEach(
    movimento => {

      const indiceOriginal =
        movimentacoes.indexOf(
          movimento
        );


      if (
        movimento.tipo ===
        "entrada"
      ) {

        totalEntradas +=
          Number(
            movimento.valor
          );

      } else {

        totalGastos +=
          Number(
            movimento.valor
          );

      }


      const item =
        document.createElement(
          "div"
        );


      item.classList.add(
        movimento.tipo
      );


      item.innerHTML = `

        <strong>
          ${movimento.descricao}
        </strong>

        <small>
          ${movimento.categoria || "outros"}
        </small>

        <span>
          ${
            movimento.tipo ===
            "entrada"
              ? "+"
              : "-"
          }

          R$
          ${Number(
            movimento.valor
          ).toFixed(2)}
        </span>

        <button
          class="btn-editar"
          data-index="${indiceOriginal}"
        >
          ✏️ Editar
        </button>

        <button
          class="btn-excluir"
          data-index="${indiceOriginal}"
        >
          Excluir
        </button>

      `;


      lista.appendChild(
        item
      );

    }
  );


  // ===================================================
  // SALDO
  // ===================================================

  const saldo =
    totalEntradas -
    totalGastos;


  document.getElementById(
    "totalEntradas"
  ).textContent =
    `R$ ${totalEntradas.toFixed(2)}`;


  document.getElementById(
    "totalGastos"
  ).textContent =
    `R$ ${totalGastos.toFixed(2)}`;


  document.getElementById(
    "saldo"
  ).textContent =
    `R$ ${saldo.toFixed(2)}`;


  // ===================================================
  // GRÁFICO
  // ===================================================

  if (
    graficoFinanceiro
  ) {

    graficoFinanceiro
      .data
      .datasets[0]
      .data = [
        totalEntradas,
        totalGastos
      ];


    graficoFinanceiro.update();

  }

}


// =====================================================
// ADICIONAR / EDITAR
// =====================================================

adicionar.addEventListener(
  "click",
  function () {

    const textoDescricao =
      descricao.value.trim();


    const numeroValor =
      Number(
        valor.value.replace(
          ",",
          "."
        )
      );


    if (
      textoDescricao ===
        "" ||
      numeroValor <= 0
    ) {

      alert(
        "Preencha a descrição e o valor."
      );

      return;

    }


    // ================================================
    // EDITANDO
    // ================================================

    if (
      indiceEditando !==
      null
    ) {

      movimentacoes[
        indiceEditando
      ] = {

        ...movimentacoes[
          indiceEditando
        ],

        descricao:
          textoDescricao,

        valor:
          numeroValor,

        tipo:
          tipo.value,

        categoria:
          categoria.value

      };


      indiceEditando =
        null;


      salvar();

      atualizarTela();


      descricao.value =
        "";

      valor.value =
        "";

      tipo.value =
        "entrada";

      categoria.value =
        "alimentacao";

      adicionar.textContent =
        "Adicionar movimentação";


      return;

    }


    // ================================================
    // NOVA MOVIMENTAÇÃO
    // ================================================

    movimentacoes.push({

      descricao:
        textoDescricao,

      valor:
        numeroValor,

      tipo:
        tipo.value,

      categoria:
        categoria.value,

      data:
        new Date()
          .toLocaleDateString(
            "pt-BR"
          )

    });


    salvar();

    atualizarTela();


    descricao.value =
      "";

    valor.value =
      "";

    tipo.value =
      "entrada";

  }
);


// =====================================================
// EXCLUIR
// =====================================================

function excluirMovimentacao(
  index
) {

  movimentacoes.splice(
    index,
    1
  );


  salvar();

  atualizarTela();

}


// =====================================================
// BOTÕES EDITAR / EXCLUIR
// =====================================================

document.addEventListener(
  "click",
  function (event) {

    if (
      event.target.classList.contains(
        "btn-excluir"
      )
    ) {

      const index =
        Number(
          event.target.dataset.index
        );


      excluirMovimentacao(
        index
      );

    }


    if (
      event.target.classList.contains(
        "btn-editar"
      )
    ) {

      const index =
        Number(
          event.target.dataset.index
        );


      const movimento =
        movimentacoes[
          index
        ];


      indiceEditando =
        index;


      descricao.value =
        movimento.descricao;


      valor.value =
        movimento.valor;


      tipo.value =
        movimento.tipo;


      categoria.value =
        movimento.categoria ||
        "outros";


      adicionar.textContent =
        "Salvar alteração";

    }

  }
);


// =====================================================
// FILTROS
// =====================================================

const botoesFiltro =
  document.querySelectorAll(
    ".filtro"
  );


botoesFiltro.forEach(
  botao => {

    botao.addEventListener(
      "click",
      function () {

        periodoAtual =
          botao.dataset.periodo;


        botoesFiltro.forEach(
          b => {

            b.classList.remove(
              "ativo"
            );

          }
        );


        botao.classList.add(
          "ativo"
        );


        atualizarTela();

      }
    );

  }
);


// =====================================================
// GRÁFICO FINANCEIRO
// =====================================================

const ctxGrafico =
  document.getElementById(
    "graficoFinanceiro"
  );


graficoFinanceiro =
  new Chart(
    ctxGrafico,
    {

      type:
        "bar",

      data: {

        labels: [
          "Entradas",
          "Gastos"
        ],

        datasets: [{

          label:
            "R$",

          data: [
            0,
            0
          ],

          backgroundColor: [
            "#22c55e",
            "#ef4444"
          ],

          borderColor: [
            "#22c55e",
            "#ef4444"
          ],

          borderWidth:
            2,

          borderRadius:
            10

        }]

      },


      options: {

        responsive:
          true,

        maintainAspectRatio:
          false,

        plugins: {

          datalabels: {

            color:
              "#ffffff",

            anchor:
              "end",

            align:
              "top",

            font: {

              weight:
                "bold",

              size:
                14

            },

            formatter:
              function(value) {

                return value.toLocaleString(
                  "pt-BR",
                  {
                    style:
                      "currency",

                    currency:
                      "BRL"
                  }
                );

              }

          }

        }

      },


      plugins: [
        ChartDataLabels
      ]

    }
  );


// =====================================================
// FECHAMENTO DO MÊS
// =====================================================

const btnFecharMes =
  document.getElementById(
    "btnFecharMes"
  );


btnFecharMes.addEventListener(
  "click",
  function () {

    const agora =
      new Date();

    const mes =
      agora.getMonth();

    const ano =
      agora.getFullYear();


    const movimentacoesDoMes =
      movimentacoes.filter(
        movimento => {

          const partes =
            movimento.data.split(
              "/"
            );


          const mesMovimento =
            Number(
              partes[1]
            ) - 1;


          const anoMovimento =
            Number(
              partes[2]
            );


          return (
            mesMovimento ===
              mes &&
            anoMovimento ===
              ano
          );

        }
      );


    let entradas =
      0;

    let gastos =
      0;


    movimentacoesDoMes.forEach(
      movimento => {

        const valor =
          Number(
            movimento.valor
          );


        if (
          movimento.tipo ===
          "entrada"
        ) {

          entradas +=
            valor;

        } else {

          gastos +=
            valor;

        }

      }
    );


    const saldo =
      entradas -
      gastos;


    const modalFechamento =
      document.getElementById(
        "modalFechamento"
      );


    const modalEntradas =
      document.getElementById(
        "modalEntradas"
      );


    const modalGastos =
      document.getElementById(
        "modalGastos"
      );


    const modalSaldo =
      document.getElementById(
        "modalSaldo"
      );


    modalEntradas.textContent =
      entradas.toLocaleString(
        "pt-BR",
        {
          style:
            "currency",

          currency:
            "BRL"
        }
      );


    modalGastos.textContent =
      gastos.toLocaleString(
        "pt-BR",
        {
          style:
            "currency",

          currency:
            "BRL"
        }
      );


    modalSaldo.textContent =
      saldo.toLocaleString(
        "pt-BR",
        {
          style:
            "currency",

          currency:
            "BRL"
        }
      );


    modalFechamento.classList.add(
      "ativo"
    );

  }
);


// =====================================================
// HISTÓRICO MENSAL
// =====================================================

const btnHistorico =
  document.getElementById(
    "btnHistorico"
  );


const listaHistorico =
  document.getElementById(
    "listaHistorico"
  );


btnHistorico.addEventListener(
  "click",
  function () {

    const historico =
      JSON.parse(
        localStorage.getItem(
          "historicoMensal"
        )
      ) || [];


    if (
      listaHistorico.style.display ===
      "block"
    ) {

      listaHistorico.style.display =
        "none";


      btnHistorico.textContent =
        "Ver histórico";


      return;

    }


    listaHistorico.style.display =
      "block";


    btnHistorico.textContent =
      "Ocultar histórico";


    if (
      historico.length ===
      0
    ) {

      listaHistorico.innerHTML =
        "<p>Nenhum mês fechado ainda.</p>";

      return;

    }


    const nomesMeses = [

      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro"

    ];


    listaHistorico.innerHTML =
      historico
        .slice()
        .reverse()
        .map(
          item => `

            <div class="item-historico">

              <div class="mes-historico">

                ${
                  nomesMeses[
                    item.mes - 1
                  ]
                }

                /

                ${item.ano}

              </div>


              <div class="valores-historico">


                <div class="mini-card entrada-historico">

                  <span>
                    Entradas
                  </span>

                  <strong>
                    R$
                    ${item.entradas.toFixed(2)}
                  </strong>

                </div>


                <div class="mini-card gasto-historico">

                  <span>
                    Gastos
                  </span>

                  <strong>
                    R$
                    ${item.gastos.toFixed(2)}
                  </strong>

                </div>


                <div class="mini-card saldo-historico ${
                  item.saldo < 0
                    ? "saldo-negativo"
                    : ""
                }">

                  <span>
                    Saldo
                  </span>

                  <strong>
                    R$
                    ${item.saldo.toFixed(2)}
                  </strong>

                </div>


              </div>

            </div>

          `
        )
        .join("");

  }
);


// =====================================================
// MODAL FECHAMENTO
// =====================================================

const modalFechamentoEl =
  document.getElementById(
    "modalFechamento"
  );


const cancelarFechamento =
  document.getElementById(
    "cancelarFechamento"
  );


const confirmarFechamento =
  document.getElementById(
    "confirmarFechamento"
  );


cancelarFechamento.addEventListener(
  "click",
  function () {

    modalFechamentoEl.classList.remove(
      "ativo"
    );

  }
);


confirmarFechamento.addEventListener(
  "click",
  function () {

    const agora =
      new Date();


    const mes =
      agora.getMonth();


    const ano =
      agora.getFullYear();


    const movimentacoesDoMes =
      movimentacoes.filter(
        movimento => {

          const partes =
            movimento.data.split(
              "/"
            );


          const mesMovimento =
            Number(
              partes[1]
            ) - 1;


          const anoMovimento =
            Number(
              partes[2]
            );


          return (
            mesMovimento ===
              mes &&
            anoMovimento ===
              ano
          );

        }
      );


    let entradas =
      0;

    let gastos =
      0;


    movimentacoesDoMes.forEach(
      movimento => {

        const valor =
          Number(
            movimento.valor
          );


        if (
          movimento.tipo ===
          "entrada"
        ) {

          entradas +=
            valor;

        } else {

          gastos +=
            valor;

        }

      }
    );


    const saldo =
      entradas -
      gastos;


    const historico =
      JSON.parse(
        localStorage.getItem(
          "historicoMensal"
        )
      ) || [];


    const mesJaFechado =
      historico.some(
        item => {

          return (
            item.mes ===
              mes + 1 &&
            item.ano ===
              ano
          );

        }
      );


    if (
      mesJaFechado
    ) {

      mostrarToast(
        "⚠️ Este mês já foi fechado!"
      );


      modalFechamentoEl.classList.remove(
        "ativo"
      );


      return;

    }


    historico.push({

      mes:
        mes + 1,

      ano:
        ano,

      entradas:
        entradas,

      gastos:
        gastos,

      saldo:
        saldo,

      fechadoEm:
        agora.toISOString()

    });


    localStorage.setItem(
      "historicoMensal",
      JSON.stringify(
        historico
      )
    );


    modalFechamentoEl.classList.remove(
      "ativo"
    );


    mostrarToast(
      "✅ Fechamento do mês salvo com sucesso!"
    );

  }
);


// =====================================================
// TOAST
// =====================================================

function mostrarToast(
  mensagem
) {

  const toast =
    document.getElementById(
      "toast"
    );


  toast.textContent =
    mensagem;


  toast.classList.add(
    "ativo"
  );


  setTimeout(
    function () {

      toast.classList.remove(
        "ativo"
      );

    },
    3000
  );

}


// =====================================================
// SERVICE WORKER
// =====================================================

if (
  "serviceWorker" in
  navigator
) {

  window.addEventListener(
    "load",
    function () {

      navigator.serviceWorker
        .register("./sw.js")
        .then(
          function () {

            console.log(
              "Service Worker registrado!"
            );

          }
        )
        .catch(
          function (erro) {

            console.log(
              "Erro no Service Worker:",
              erro
            );

          }
        );

    }
  );

}


// =====================================================
// INICIAR
// =====================================================

verificarSessao();

atualizarTela();
