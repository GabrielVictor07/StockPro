let salvarProduto = (data) => console.log("SalvarProduto: dados recebidos", data);

try {
  import("../../js/modules/produtos.js").then(module => {
    if (module.salvarProduto) {
      salvarProduto = module.salvarProduto;
    }
  }).catch(err => {
    console.warn("⚠️ Módulo Produtos.js não encontrado ou erro ao carregar:", err);
  });
} catch (e) {
  console.warn("⚠️ Erro ao importar Produtos.js:", e);
}

// Utilitários de formatação serão importados dinamicamente
let aplicarFormatacaoMoeda, obterValorNumerico;
import("../../js/core/utils.js").then(module => {
  aplicarFormatacaoMoeda = module.aplicarFormatacaoMoeda;
  obterValorNumerico = module.obterValorNumerico;
}).catch(err => {
  console.warn("⚠️ Erro ao carregar utilitários de formatação:", err);
});

class ModalProduto extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div id="modal_cadastrar_produto" class="modal-overlay hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div class="modal-content bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0" style="animation: modalFadeIn 0.3s ease-out forwards;">
    <!-- Header do Modal -->
    <div class="sticky top-0 z-10 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
          <i class="fas fa-box-open text-white text-lg"></i>
        </div>
        <div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            Cadastrar Produto
          </h3>
          <p class="text-gray-500 text-sm">Adicione um novo produto ao estoque</p>
        </div>
      </div>
      <button 
        type="button" 
        id="btnCancelarProduto"
        class="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
      >
        <i class="fas fa-times text-gray-400 group-hover:text-white transition-colors"></i>
      </button>
    </div>

    <!-- Body do Modal -->
    <div class="p-6">
      <form id="produtoForm" class="space-y-5">
        <!-- Nome do Produto -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-tag text-pink-400"></i>
            Nome do Produto
          </label>
          <div class="relative">
            <input
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              placeholder="Ex: Calabresa Premium"
              id="nomeProduto"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-pen text-gray-600 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Código do Produto -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-barcode text-purple-400"></i>
            Código do Produto
          </label>
          <div class="relative">
            <input
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
              placeholder="Ex: P0001"
              id="codigoProduto"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-qrcode text-gray-600 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Categoria -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-folder-open text-cyan-400"></i>
            Categoria
          </label>
          <div class="relative">
            <select 
              name="selectCategoriaProduto" 
              id="selectCategoriaProduto"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="" class="bg-[#1a1a1a]">Selecione uma Categoria</option>
            </select>
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-chevron-down text-gray-500 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Grid de 2 colunas -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Quantidade -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <i class="fas fa-cubes text-blue-400"></i>
              Quantidade
            </label>
            <div class="relative">
              <input
                type="number"
                  min="0"
                  step="any"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="0"
                id="quantidadeProduto"
              />
            </div>
          </div>

          <!-- Valor -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <i class="fas fa-dollar-sign text-green-400"></i>
              Valor Unitário
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span class="text-gray-500 text-sm font-semibold">R$</span>
              </div>
              <input
                type="text"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="0,00"
                id="valorProduto"
              />
            </div>
          </div>
        </div>

        <!-- Estoque Mínimo -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-exclamation-triangle text-orange-400"></i>
            Estoque Mínimo
          </label>
          <div class="relative">
            <input
              type="number"
              min="0"
              step="any"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="Ex: 10"
              id="estoqueMinimoProduto"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-chart-line text-gray-600 text-sm"></i>
            </div>
          </div>
          <p class="text-xs text-gray-500 flex items-center gap-1">
            <i class="fas fa-info-circle"></i>
            Você será alertado quando o estoque atingir esse valor
          </p>
        </div>

        <!-- Resumo Visual -->
        <div class="p-4 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs text-gray-500">Valor Total</p>
              <p class="text-lg font-bold text-pink-400" id="valorTotalProduto">R$ 0,00</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Unidades</p>
              <p class="text-lg font-bold text-blue-400" id="totalUnidades">0 un.</p>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex gap-3 pt-4">
          <button 
            type="button" 
            id="btnCancelarProduto2"
            class="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-300 hover:scale-105"
          >
            <i class="fas fa-times mr-2"></i>
            Cancelar
          </button>
          <button 
            type="submit" 
            class="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
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
  
  /* Remove setas padrão do input number */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
  }
  
  /* Scrollbar customizada para o modal */
  .modal-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .modal-content::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .modal-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  .modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
    `;

    // Após renderizar, adicionar listeners
    const modal = this.querySelector("#modal_cadastrar_produto");
    const form = this.querySelector("#produtoForm");
    const btnCancelar = this.querySelector("#btnCancelarProduto");

    // Fechar modal ao clicar no botão Cancelar
    btnCancelar.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    // Fechar modal ao clicar no overlay (fora da modal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });

    // listar categorias no select (usa carregarCategorias exportado em produtos.js)
    const selectCategoria = this.querySelector("#selectCategoriaProduto");
    import("../../js/modules/produtos.js").then(module => {
      if (module.carregarCategorias) {
        module.carregarCategorias().then(categorias => {
          categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nome;
            selectCategoria.appendChild(option);
          });
        }).catch(err => {
          console.warn("⚠️ Erro ao carregar categorias:", err);
        });
      }
    }).catch(err => {
      console.warn("⚠️ Módulo Produtos.js não encontrado ou erro ao carregar:", err);
    });
    

    // Aplicar formatação de moeda no input de valor (aguarda módulo carregar)
    const valorInput = this.querySelector("#valorProduto");
    if (valorInput && aplicarFormatacaoMoeda) {
      aplicarFormatacaoMoeda(valorInput);
    } else if (valorInput) {
      // Se ainda não carregou, tenta novamente após um delay
      setTimeout(() => {
        if (aplicarFormatacaoMoeda) {
          aplicarFormatacaoMoeda(valorInput);
        }
      }, 100);
    }

    // Atualizar valores totais automaticamente quando quantidade/valor mudarem
    const quantidadeInput = this.querySelector("#quantidadeProduto");
    const valorTotalEl = this.querySelector("#valorTotalProduto");
    const totalUnidadesEl = this.querySelector("#totalUnidades");

    const formatCurrencyBRL = (value) => {
      if (Number.isNaN(value) || value === null) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const updateTotals = () => {
      const qtd = parseFloat(quantidadeInput.value) || 0;
      const preco = obterValorNumerico ? obterValorNumerico(valorInput) : (Number(valorInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0); // Converte de R$ 0,00 para número
      const total = qtd * preco;

      valorTotalEl.textContent = formatCurrencyBRL(total);
      totalUnidadesEl.textContent = `${qtd} un.`;
    };

    // Atualiza enquanto o usuário digita
    quantidadeInput.addEventListener('input', updateTotals);
    valorInput.addEventListener('input', updateTotals);

    // Atualiza ao abrir o modal (valores iniciais)
    setTimeout(updateTotals, 0);

    // Listener do formulário
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const dataProdutos = {
        nome: this.querySelector("#nomeProduto").value,
        codigo: this.querySelector("#codigoProduto").value,
        categoria_id: Number(this.querySelector("#selectCategoriaProduto").value),
        estoque: parseFloat(this.querySelector("#quantidadeProduto").value) || 0, // quantidade de produto em estoque inicial (aceita KG)
        preco: obterValorNumerico ? obterValorNumerico(this.querySelector("#valorProduto")) : (Number(this.querySelector("#valorProduto").value.replace(/[^\d,]/g, '').replace(',', '.')) || 0), // Converte de R$ 0,00 para número
        estoque_minimo: parseFloat(this.querySelector("#estoqueMinimoProduto").value) || 0,
      };

      console.log(dataProdutos);

      salvarProduto(dataProdutos);
      form.reset();
      modal.classList.add("hidden");
    });
  }
}

customElements.define("modal-produto", ModalProduto);

