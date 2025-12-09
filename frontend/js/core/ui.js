// Sistema de navegação entre seções
const sections = document.querySelectorAll(".section");

function showSection(id) {
  sections.forEach((sec) => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  // Atualizar estatísticas quando a seção de notas for exibida
  if (id === "notas") {
    import("../modules/estatisticas.js")
      .then((module) => {
        module.atualizarCardsEstatisticas();
      })
      .catch((erro) => console.error("Erro ao carregar estatísticas:", erro));
  }

  // Atualizar cards do dashboard quando o dashboard for exibido
  if (id === "dashboard") {
    import("../modules/dashboardEstatisticas.js")
      .then((module) => {
        module.atualizarCardsDashboard();
      })
      .catch((erro) =>
        console.error("Erro ao carregar estatísticas do dashboard:", erro)
      );
  }

  // Atualizar hash da URL para preservar seção em reloads e permitir compartilhar
  try {
    if (history.replaceState) {
      history.replaceState(null, '', `#${id}`);
    } else {
      location.hash = `#${id}`;
    }
  } catch (e) {
    // se storage ou history bloqueado, ignorar
  }
}

document.getElementById("btn-dashboard").onclick = () =>
  showSection("dashboard");
document.getElementById("btn-entradas").onclick = () => showSection("entradas");
document.getElementById("btn-saidas").onclick = () => showSection("saidas");
document.getElementById("btn-notas").onclick = () => showSection("notas");

// Função auxiliar para abrir/fechar modals - DEVE SER GLOBAL
window.openModal = async function (modalId) {
  // Tentar encontrar o modal no DOM
  let modal = document.querySelector(`#${modalId}`);

  if (!modal) {
    console.log(
      `Modal ${modalId} não encontrado. Tentando aguardar carregamento de Web Components...`
    );
    // Aguardar um pouco para Web Components carregarem
    await new Promise((resolve) => setTimeout(resolve, 100));

    modal = document.querySelector(`#${modalId}`);
  }

  if (modal) {
    modal.classList.remove("hidden");
  } else {
    // Listar todos os IDs de modals disponíveis
    const allModals = document.querySelectorAll('[id^="modal_"]');
  }
};

// Aguardar o DOM estar pronto para adicionar listeners dos botões
document.addEventListener("DOMContentLoaded", () => {
  // Botões para abrir modals
  const btnNovoProduto = document.querySelector("#btnNovoProduto");
  const btnCadastrarCategoria = document.querySelector(
    "#btnCadastrarCategoria"
  );
  const btnCadastrarNota =
    document.querySelector("#notas #btnCadastrarNota") ||
    document.querySelector("#btnCadastrarNota");
  const btnCadastrarFornecedor = document.querySelector(
    "#btnCadastrarFornecedor"
  );
  const btnAddItems = document.querySelector("#btnAddItems");
  const btnCadastrarSaida = document.querySelector("#btnCadastrarSaida");

  if (btnNovoProduto) {
    btnNovoProduto.addEventListener("click", () =>
      openModal("modal_cadastrar_produto")
    );
  }

  if (btnCadastrarNota) {
    btnCadastrarNota.addEventListener("click", () =>
      openModal("modal_cadastrar_nota")
    );
  }

  if (btnCadastrarFornecedor) {
    btnCadastrarFornecedor.addEventListener("click", () =>
      openModal("modal_cadastrar_fornecedor")
    );
  }

  if (btnCadastrarCategoria) {
    btnCadastrarCategoria.addEventListener("click", () =>
      openModal("modal_cadastrar_categoria")
    );
  }

  if (btnCadastrarSaida) {
    btnCadastrarSaida.addEventListener("click", () =>
      openModal("modal_cadastrar_saida")
    );
  }

  if (btnAddItems) {
    btnAddItems.addEventListener("click", () => {
      openModal("modal_add_items");
    });
  } else {
  }

  observer.observe(document.body, { childList: true, subtree: true });
});

async function waitForWebComponents() {
  const components = [
    "modal-items-notas",
    "modal-produto",
    "modal-notas",
    "modal-fornecedor",
    "modal-categoria",
    "modal-editar-produto"
  ];
  for (let component of components) {
    await customElements.whenDefined(component);
  }
}
waitForWebComponents();

// Persistir seção ativa entre reloads
(function () {
  const STYLE_ID = "initial-hide-sections";
  // Injeta CSS para ocultar seções imediatamente até o JS decidir qual mostrar
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `.section { visibility: hidden !important; }`;
    (document.head || document.documentElement).appendChild(style);
  }

  const STORAGE_KEY = "activeSection";
  const originalShow = window.showSection || showSection;

  // Substitui showSection para salvar no localStorage sempre que for chamada
  window.showSection = function (id) {
    originalShow(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (e) {
      /* ignorar se storage bloqueado */
    }
  };

  function removeInitialHide() {
    const s = document.getElementById(STYLE_ID);
    if (s) s.remove();
  }

  // Tenta restaurar a seção salva quando o DOM estiver pronto.
  // Prioridade: hash na URL -> localStorage -> seção visível no DOM -> dashboard
  function restoreSection() {
    // 1) Verifica hash na URL
    const hash = location.hash && location.hash.replace('#', '');
    if (hash) {
      const elHash = document.getElementById(hash);
      if (elHash) {
        window.showSection(hash);
        removeInitialHide();
        return;
      }
    }

    // 2) localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const el = document.getElementById(saved);
      if (el) {
        window.showSection(saved);
        removeInitialHide();
        return;
      } else {
        console.warn(`Seção salva não encontrada: ${saved}`);
      }
    }

    // 3) Se já existe uma seção visível no DOM, mantê-la
    const visible = Array.from(document.querySelectorAll('.section')).find(
      (s) => !s.classList.contains('hidden')
    );
    if (visible) {
      try {
        localStorage.setItem(STORAGE_KEY, visible.id);
      } catch (e) {}
      removeInitialHide();
      return;
    }

    // 4) fallback para dashboard
    window.showSection('dashboard');
    removeInitialHide();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restoreSection);
  } else {
    restoreSection();
  }
})();

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-editar");
  if (!btn) return;

  const produto = JSON.parse(btn.dataset.produto);

  await customElements.whenDefined("modal-editar-produto");

  const modal = document.querySelector("modal-editar-produto");
  if (!modal) {
    console.warn("Modal de edição não encontrado no DOM.");
    return;
  }

  modal.abrir(produto);
});

