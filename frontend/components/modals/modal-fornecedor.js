// Importar com tratamento de erro
let salvarFornecedor = (data) => console.log("salvarFornecedor: dados recebidos", data);
                                                                
try {
  import("../../js/modules/fornecedores.js").then(module => {
    if (module.salvarFornecedor) {
      salvarFornecedor = module.salvarFornecedor;
    }
  }).catch(err => {
    console.warn("⚠️ Módulo fornecedores.js não encontrado ou erro ao carregar:", err);
  });
} catch (e) {
  console.warn("⚠️ Erro ao importar fornecedores.js:", e);
}

class ModalFornecedor extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div id="modal_cadastrar_fornecedor" class="modal-overlay hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div class="modal-content bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0" style="animation: modalFadeIn 0.3s ease-out forwards;">
    <!-- Header do Modal -->
    <div class="relative p-6 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <i class="fas fa-truck text-white text-lg"></i>
        </div>
        <div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Cadastrar Fornecedor
          </h3>
          <p class="text-gray-500 text-sm">Adicione um novo fornecedor ao sistema</p>
        </div>
      </div>
      <button 
        type="button" 
        id="btnCancelarFornecedor"
        class="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
      >
        <i class="fas fa-times text-gray-400 group-hover:text-white transition-colors"></i>
      </button>
    </div>

    <!-- Body do Modal -->
    <div class="p-6">
      <form class="space-y-5" id="fornecedorForm">
        <!-- Nome do Fornecedor -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-building text-blue-400"></i>
            Nome do Fornecedor
          </label>
          <div class="relative">
            <input
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Ex: Supermercado BomPreço"
              id="nomeFornecedor"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-store text-gray-600 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Número do Fornecedor -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-phone text-green-400"></i>
            Número do Fornecedor
          </label>
          <div class="relative">
            <input
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              placeholder="Ex: (81) 99999-9999"
              id="numeroFornecedor"
            />
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <i class="fas fa-mobile-alt text-gray-600 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- CNPJ -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-id-card text-purple-400"></i>
            CNPJ
          </label>
          <div class="relative">
            <input
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
              placeholder="00.000.000/0000-00"
              id="CNPJ"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-file-invoice text-gray-600 text-sm"></i>
            </div>
          </div>
          <p class="text-xs text-gray-500 flex items-center gap-1">
            <i class="fas fa-info-circle"></i>
            Insira apenas números, a formatação será automática
          </p>
        </div>

        <!-- Botões -->
        <div class="flex gap-3 pt-4">
          <button 
            type="button" 
            id="btnCancelarFornecedor2"
            class="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-300 hover:scale-105"
          >
            <i class="fas fa-times mr-2"></i>
            Cancelar
          </button>
          <button 
            type="submit" 
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            <i class="fas fa-check mr-2"></i>
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .modal-overlay.hidden .modal-content {
    animation: none;
  }
</style>
    `;

    const modal = this.querySelector("#modal_cadastrar_fornecedor");
    const form = this.querySelector("#fornecedorForm");
    const btnCancelar = this.querySelector("#btnCancelarFornecedor");

    // Fechar modal ao clicar em Cancelar
    btnCancelar.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    // Fechar modal ao clicar no overlay
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });

    // Listener do formulário
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      salvarFornecedor({
        nome: this.querySelector("#nomeFornecedor").value,
        numero: this.querySelector("#numeroFornecedor").value,
        cnpj: this.querySelector("#CNPJ").value,
      });

      form.reset();
      modal.classList.add("hidden");
    });
  }
}

customElements.define("modal-fornecedor", ModalFornecedor);
