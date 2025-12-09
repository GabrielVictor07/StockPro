let salvarNota = (data) => console.log("salvarNota: dados recebidos", data);

try {
  import("../../js/modules/notas.js").then(module => {
    if (module.salvarNota) {
      salvarNota = module.salvarNota;
    }
  }).catch(err => {
    console.warn("⚠️ Módulo Notas.js não encontrado ou erro ao carregar:", err);
  });
} catch (e) {
  console.warn("⚠️ Erro ao importar Notas.js:", e);
}

// Utilitários de formatação serão importados dinamicamente
let aplicarFormatacaoMoeda, obterValorNumerico;
import("../../js/core/utils.js").then(module => {
  aplicarFormatacaoMoeda = module.aplicarFormatacaoMoeda;
  obterValorNumerico = module.obterValorNumerico;
}).catch(err => {
  console.warn("⚠️ Erro ao carregar utilitários de formatação:", err);
});

class ModalNotas extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div id="modal_cadastrar_nota" class="modal-overlay hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div class="modal-content bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0" style="animation: modalFadeIn 0.3s ease-out forwards;">
    <!-- Header do Modal -->
    <div class="relative p-6 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <i class="fas fa-file-invoice text-white text-lg"></i>
        </div>
        <div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Cadastrar Nota Fiscal
          </h3>
          <p class="text-gray-500 text-sm">Registre uma nova nota de entrada</p>
        </div>
      </div>
      <button 
        type="button" 
        id="btnCancelarNota"
        class="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
      >
        <i class="fas fa-times text-gray-400 group-hover:text-white transition-colors"></i>
      </button>
    </div>

    <!-- Body do Modal -->
    <div class="p-6">
      <form class="space-y-5" id="notasForm">
        <!-- Fornecedor -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-truck text-blue-400"></i>
            Fornecedor
          </label>
          <div class="relative">
            <input id="fornecedorNotaInput" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="Digite ou selecione o fornecedor" autocomplete="off" />
            <div id="fornecedorSuggestions" class="autocomplete-suggestions hidden absolute left-0 right-0 mt-1 rounded-xl bg-[#0f0f0f] border border-white/10 shadow-lg z-40 max-h-48 overflow-auto"></div>
            <!-- hidden para manter compatibilidade com envio -->
            <input type="hidden" id="fornecedorNota" value="" />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-500 text-sm"></i>
            </div>
          </div>
          <p class="text-xs text-gray-500 flex items-center gap-1">
            <i class="fas fa-info-circle"></i>
            Nenhum fornecedor? Cadastre um novo fornecedor primeiro
          </p>
        </div>

        <!-- Número da Nota -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-hashtag text-purple-400"></i>
            Número da Nota
          </label>
          <div class="relative">
            <input
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
              placeholder="Ex: NF-001245"
              id="numeroNota"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-receipt text-gray-600 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Valor Total -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-dollar-sign text-green-400"></i>
            Valor Total da Nota
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span class="text-gray-500 font-semibold">R$</span>
            </div>
            <input
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              placeholder="0,00"
              id="valorTotalNota"
            />
          </div>
        </div>

        <!-- Data da Nota -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-calendar-alt text-cyan-400"></i>
            Data da Nota
          </label>
          <div class="relative">
            <input 
              type="date" 
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer" 
              id="dataNota"
              style="color-scheme: dark;"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-calendar text-gray-600 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Informação Adicional -->
        <div class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <div class="flex items-start gap-3">
            <i class="fas fa-lightbulb text-indigo-400 mt-1"></i>
            <div>
              <p class="text-sm text-gray-300 font-medium">Dica</p>
              <p class="text-xs text-gray-500 mt-1">Após cadastrar a nota, você poderá adicionar os produtos através do botão "Adicionar Itens à Nota"</p>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex gap-3 pt-4">
          <button 
            type="button" 
            id="btnCancelarNota2"
            class="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-300 hover:scale-105"
          >
            <i class="fas fa-times mr-2"></i>
            Cancelar
          </button>
          <button 
            type="submit" 
            class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
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

    // Autocomplete customizado para fornecedores
    const selectFornecedoresHidden = this.querySelector("#fornecedorNota"); // hidden input
    const fornecedorInput = this.querySelector("#fornecedorNotaInput");
    const fornecedorSuggestions = this.querySelector("#fornecedorSuggestions");
    const fornecedorNomeParaId = new Map();

    const renderSuggestions = (container, items, query) => {
      container.innerHTML = "";
      if (!items.length) {
        container.classList.add('hidden');
        return;
      }
      items.forEach((txt) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item px-4 py-2 cursor-pointer text-gray-200 hover:bg-white/5';
        const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const lower = txt.toLowerCase();
        const q = query.toLowerCase();
        if (q && lower.includes(q)) {
          const i = lower.indexOf(q);
          const highlighted = esc(txt.slice(0,i)) + '<strong class="text-white">' + esc(txt.slice(i,i+q.length)) + '</strong>' + esc(txt.slice(i+q.length));
          div.innerHTML = highlighted;
        } else {
          div.textContent = txt;
        }
        div.tabIndex = 0;
        div.addEventListener('click', () => {
          fornecedorInput.value = txt;
          selectFornecedoresHidden.value = fornecedorNomeParaId.get(txt) ?? '';
          container.classList.add('hidden');
          fornecedorInput.focus();
        });
        container.appendChild(div);
      });
      container.classList.remove('hidden');
    };

    import("../../js/modules/notas.js").then(module => {
      if (module.carregarFornecedores) {
        module.carregarFornecedores().then(fornecedores => {
          const nomes = fornecedores.map(f => f.nome);
          nomes.forEach((nome, i) => fornecedorNomeParaId.set(nome, fornecedores[i].id));

          fornecedorInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (!val) {
              fornecedorSuggestions.classList.add('hidden');
              selectFornecedoresHidden.value = '';
              return;
            }
            const matches = nomes.filter(n => n.toLowerCase().includes(val.toLowerCase())).slice(0,8);
            renderSuggestions(fornecedorSuggestions, matches, val);
            const exactId = fornecedorNomeParaId.get(val);
            selectFornecedoresHidden.value = exactId ?? '';
          });

          fornecedorInput.addEventListener('keydown', (e) => {
            const items = fornecedorSuggestions.querySelectorAll('.suggestion-item');
            if (!items.length) return;
            let idx = Array.from(items).findIndex(it => it.classList.contains('active'));
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (idx >= 0) items[idx].classList.remove('active');
              idx = (idx + 1) % items.length;
              items[idx].classList.add('active');
              items[idx].scrollIntoView({block: 'nearest'});
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (idx >= 0) items[idx].classList.remove('active');
              idx = (idx - 1 + items.length) % items.length;
              items[idx].classList.add('active');
              items[idx].scrollIntoView({block: 'nearest'});
            } else if (e.key === 'Enter') {
              const active = fornecedorSuggestions.querySelector('.suggestion-item.active');
              if (active) {
                e.preventDefault();
                active.click();
              }
            } else if (e.key === 'Escape') {
              fornecedorSuggestions.classList.add('hidden');
            }
          });

          fornecedorInput.addEventListener('blur', () => setTimeout(() => fornecedorSuggestions.classList.add('hidden'), 150));

        }).catch(err => {
          console.warn("⚠️ Erro ao carregar fornecedores:", err);
        });
      }
    }).catch(err => {
      console.warn("⚠️ Módulo nota.js não encontrado ou erro ao carregar:", err);
    });


    const modal = this.querySelector("#modal_cadastrar_nota");
    const form = this.querySelector("#notasForm");
    const btnCancelar = this.querySelector("#btnCancelarNota");

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

    // Aplicar formatação de moeda no input de valor total (aguarda módulo carregar)
    const valorTotalInput = this.querySelector("#valorTotalNota");
    if (valorTotalInput && aplicarFormatacaoMoeda) {
      aplicarFormatacaoMoeda(valorTotalInput);
    } else if (valorTotalInput) {
      setTimeout(() => {
        if (aplicarFormatacaoMoeda) {
          aplicarFormatacaoMoeda(valorTotalInput);
        }
      }, 100);
    }

    // Listener do formulário
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const dataNotas = ({
        fornecedor_id: Number(this.querySelector("#fornecedorNota").value),
        numero: this.querySelector("#numeroNota").value,
        valor_total: obterValorNumerico ? obterValorNumerico(this.querySelector("#valorTotalNota")) : (Number(this.querySelector("#valorTotalNota").value.replace(/[^\d,]/g, '').replace(',', '.')) || 0), // Converte de R$ 0,00 para número
        data: this.querySelector("#dataNota").value,
      });

      console.log("Dados da nota a serem salvos:", dataNotas);

      salvarNota(dataNotas);
      form.reset();
      modal.classList.add("hidden");
    });
  }
}

customElements.define("modal-notas", ModalNotas);

