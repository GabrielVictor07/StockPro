let salvarSaida = (data) => console.log("salvarSaida: dados recebidos", data);

try {
    import("../../js/modules/saidas.js").then(module => {
        if (module.salvarSaidas) {
            salvarSaida = module.salvarSaidas;
        } 
    }).catch(err => {
        console.warn("⚠️ Módulo saidas.js não encontrado ou erro ao carregar:", err);
    }
    );
} catch (err) {
    console.warn("⚠️ Erro ao importar o módulo saidas.js:", err);
}

class ModalSaidas extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
   <div id="modal_cadastrar_saida" class="modal-overlay hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div class="modal-content bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0" style="animation: modalFadeIn 0.3s ease-out forwards;">
    <!-- Header do Modal -->
    <div class="relative p-6 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
          <i class="fas fa-arrow-up text-white text-lg"></i>
        </div>
        <div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
            Cadastrar Saída
          </h3>
          <p class="text-gray-500 text-sm">Registre a saída de produtos do estoque</p>
        </div>
      </div>
      <button 
        type="button" 
        id="btnCancelarSaida"
        class="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
      >
        <i class="fas fa-times text-gray-400 group-hover:text-white transition-colors"></i>
      </button>
    </div>

    <!-- Body do Modal -->
    <div class="p-6">
      <form class="space-y-5" id="saidasForm">
        <!-- Selecione o Produto -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-box text-orange-400"></i>
            Selecione o Produto
          </label>
          <div class="relative">
            <select 
              id="produtoSaidaSelect" 
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer"
            >
              <option disabled selected class="bg-[#1a1a1a]">Selecione o produto</option>
            </select>
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-500 text-sm"></i>
            </div>
          </div>
          <p class="text-xs text-gray-500 flex items-center gap-1">
            <i class="fas fa-info-circle"></i>
            Apenas produtos com estoque disponível aparecem na lista
          </p>
        </div>

        <!-- Quantidade -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-minus-circle text-red-400"></i>
            Quantidade
          </label>
          <div class="relative">
            <input
              type="number"
                min="0"
                step="any"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              placeholder="Ex: 10"
              id="quantidadeSaida"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-calculator text-gray-600 text-sm"></i>
            </div>
          </div>
          <div id="estoqueDisponivel" class="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg hidden">
            <i class="fas fa-warehouse text-blue-400 text-sm"></i>
            <p class="text-xs text-blue-400">
              <span class="font-semibold">Estoque disponível:</span> 
              <span id="estoqueQtd">0</span> unidades
            </p>
          </div>
        </div>

        <!-- Data da Saída -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-calendar-check text-cyan-400"></i>
            Data da Saída
          </label>
          <div class="relative">
            <input 
              type="date" 
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer" 
              id="dataSaida"
              style="color-scheme: dark;"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-calendar text-gray-600 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Alerta de Estoque Baixo -->
        <div id="alertaEstoqueBaixo" class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl hidden">
          <div class="flex items-start gap-3">
            <i class="fas fa-exclamation-triangle text-yellow-400 mt-1"></i>
            <div>
              <p class="text-sm text-yellow-400 font-medium">Atenção!</p>
              <p class="text-xs text-gray-400 mt-1">Esta saída pode deixar o produto com estoque abaixo do mínimo recomendado</p>
            </div>
          </div>
        </div>

        <!-- Resumo da Saída -->
        <div class="p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500">Produto Selecionado</p>
              <p class="text-sm font-bold text-white mt-1" id="produtoSelecionado">Nenhum</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">Quantidade a Retirar</p>
              <p class="text-2xl font-bold text-red-400 mt-1" id="quantidadeResumo">0</p>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex gap-3 pt-4">
          <button 
            type="button" 
            id="btnCancelarSaida2"
            class="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-300 hover:scale-105"
          >
            <i class="fas fa-times mr-2"></i>
            Cancelar
          </button>
          <button 
            type="submit" 
            id="btnSalvarSaida"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
          >
            <i class="fas fa-check mr-2"></i>
            Confirmar Saída
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
  
  /* Remove setas padrão do input number */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
  }
  
  /* Estilização do input date para tema escuro */
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.6;
    cursor: pointer;
  }
  
  input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }
</style>
    `;

        // Carrega os produtos no select
    const produtoSelect = this.querySelector("#produtoSaidaSelect");
    import("../../js/modules/saidas.js").then(module => {
      if (module.carregarProdutos) {
        module.carregarProdutos().then(Produtos => {
          Produtos.forEach(produtos => {
            const option = document.createElement("option");
            option.value = produtos.id;
            option.textContent = produtos.nome;
            produtoSelect.appendChild(option);
          });
        }).catch(err => {
          console.warn("⚠️ Erro ao carregar fornecedores:", err);
        });
      }
    }).catch(err => {
      console.warn("⚠️ Módulo nota.js não encontrado ou erro ao carregar:", err);
    });

    // Adiciona event listener para o formulário
    const form = this.querySelector("#saidasForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
          produto_id: Number(this.querySelector("#produtoSaidaSelect").value),
          quantidade: parseFloat(this.querySelector("#quantidadeSaida").value) || 0,
          data_hora: this.querySelector("#dataSaida").value,
        };

        console.log("Dados do formulário de saída:", data);
        salvarSaida(data);
    });

    // Adiciona event listener para o botão cancelar
    const btnCancelar = this.querySelector("#btnCancelarSaida");
    btnCancelar.addEventListener("click", () => {
        const modal = this.querySelector("#modal_cadastrar_saida");
        modal.classList.add("hidden");
    });
    }
}

customElements.define("modal-saidas", ModalSaidas);

