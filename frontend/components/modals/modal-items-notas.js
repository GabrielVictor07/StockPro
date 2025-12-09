// Importar com tratamento de erro
let salvarItemNota = (data) => console.log("salvarItemNota: dados recebidos", data);

try {
  import("../../js/modules/itensNota.js").then(module => {
    if (module.salvarItemNota) {
      salvarItemNota = module.salvarItemNota;
    }
  }).catch(err => {
    console.warn("⚠️ Módulo itensNota.js não encontrado ou erro ao carregar:", err);
  });
} catch (e) {
  console.warn("⚠️ Erro ao importar itensNota.js:", e);
}

// Utilitários de formatação serão importados dinamicamente
let aplicarFormatacaoMoeda, obterValorNumerico;
import("../../js/core/utils.js").then(module => {
  aplicarFormatacaoMoeda = module.aplicarFormatacaoMoeda;
  obterValorNumerico = module.obterValorNumerico;
}).catch(err => {
  console.warn("⚠️ Erro ao carregar utilitários de formatação:", err);
});

class ModalItemsNotas extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="modal_add_items" class="modal-overlay hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div class="modal-content bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0" style="animation: modalFadeIn 0.3s ease-out forwards;">
    <!-- Header do Modal -->
    <div class="relative p-6 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <i class="fas fa-plus-circle text-white text-lg"></i>
        </div>
        <div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Adicionar Item à Nota
          </h3>
          <p class="text-gray-500 text-sm">Vincule produtos à nota fiscal</p>
        </div>
      </div>
      <button 
        type="button" 
        id="btnCancelarItems"
        class="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
      >
        <i class="fas fa-times text-gray-400 group-hover:text-white transition-colors"></i>
      </button>
    </div>

    <!-- Body do Modal -->
    <div class="p-6">
      <form class="space-y-5" id="addItemForm">
        <!-- Nota Fiscal -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-file-invoice text-blue-400"></i>
            Nota Fiscal
          </label>
            <div class="relative">
            <input id="notaFiscalInput" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="Digite ou selecione a Nota" autocomplete="off" />
            <!-- container customizado de sugestões -->
            <div id="notaSuggestions" class="autocomplete-suggestions hidden absolute left-0 right-0 mt-1 rounded-xl bg-[#0f0f0f] border border-white/10 shadow-lg z-40 max-h-48 overflow-auto"></div>
            <!-- campo oculto para armazenar o id da nota (compatível com envio atual) -->
            <input type="hidden" id="notaFiscalSelecionada" value="" />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-500 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Produto -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-box text-purple-400"></i>
            Produto
          </label>
            <div class="relative">
            <input id="produtoNotaInput" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" placeholder="Digite ou selecione o Produto" autocomplete="off" />
            <!-- container customizado de sugestões -->
            <div id="produtoSuggestions" class="autocomplete-suggestions hidden absolute left-0 right-0 mt-1 rounded-xl bg-[#0f0f0f] border border-white/10 shadow-lg z-40 max-h-48 overflow-auto"></div>
            <!-- campo oculto para armazenar o id do produto (compatível com envio atual) -->
            <input type="hidden" id="produtoNota" value="" />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-500 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Quantidade -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-hashtag text-cyan-400"></i>
            Quantidade
          </label>
          <div class="relative">
            <input
              type="number"
                min="0"
                step="any"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="Ex: 10"
              id="quantidadeProdutoNota"
            />
            <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <i class="fas fa-cubes text-gray-600 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Valor Unitário -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <i class="fas fa-dollar-sign text-green-400"></i>
            Valor Unitário
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span class="text-gray-500 font-semibold">R$</span>
            </div>
            <input
              type="text"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              placeholder="0,00"
              id="valorUnitarioProdutoNota"
            />
          </div>
          <p class="text-xs text-gray-500 flex items-center gap-1">
            <i class="fas fa-calculator"></i>
            O valor total será calculado automaticamente
          </p>
        </div>

        <!-- Preview do Total (opcional) -->
        <div class="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">Valor Total Estimado:</span>
            <span class="text-lg font-bold text-green-400" id="previewTotal">R$ 0,00</span>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex gap-3 pt-4">
          <button 
            type="button" 
            id="btnCancelarItems2"
            class="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-300 hover:scale-105"
          >
            <i class="fas fa-times mr-2"></i>
            Cancelar
          </button>
          <button 
            type="submit" 
            class="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
          >
            <i class="fas fa-plus mr-2"></i>
            Adicionar
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
  
  /* Remove setas padrão do input number no Chrome/Safari */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* Remove setas padrão do input number no Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Estilos para autocomplete customizado */
  .autocomplete-suggestions { font-size: 14px; }
  .autocomplete-suggestions .suggestion-item { padding: 8px 12px; }
  .autocomplete-suggestions .suggestion-item.active,
  .autocomplete-suggestions .suggestion-item:hover { background: rgba(255,255,255,0.04); }
  .autocomplete-suggestions strong { color: #fff; font-weight: 700; }
</style>
    `;

    const modal = this.querySelector("#modal_add_items");
    const form = this.querySelector("#addItemForm");
    const btnCancelar = this.querySelector("#btnCancelarItems");

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

    // listar produtos no datalist e mapear nome -> id
    const selectProdutosHidden = this.querySelector("#produtoNota"); // hidden input para compatibilidade
    const produtoInput = this.querySelector("#produtoNotaInput");
    const produtoSuggestions = this.querySelector("#produtoSuggestions");
    const produtoNomeParaId = new Map();

    // Autocomplete helper (agora com callback onSelect para evitar closures incorretas)
    const renderSuggestions = (container, items, query, onSelect) => {
      container.innerHTML = "";
      if (!items.length) {
        container.classList.add('hidden');
        return;
      }
      items.forEach((txt) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item px-4 py-2 cursor-pointer text-gray-200 hover:bg-white/5';
        // highlight match
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
          if (typeof onSelect === 'function') onSelect(txt, container);
        });
        container.appendChild(div);
      });
      container.classList.remove('hidden');
    };

    import("../../js/modules/itensNota.js").then(module => {
      if (module.carregarProdutos) {
        module.carregarProdutos().then(produtos => {
          const nomes = produtos.map(p => p.nome);
          nomes.forEach((nome, i) => produtoNomeParaId.set(nome, produtos[i].id));

          produtoInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (!val) {
              produtoSuggestions.classList.add('hidden');
              selectProdutosHidden.value = '';
              return;
            }
            const matches = nomes.filter(n => n.toLowerCase().includes(val.toLowerCase())).slice(0,8);
            renderSuggestions(produtoSuggestions, matches, val, (txt, container) => {
              produtoInput.value = txt;
              selectProdutosHidden.value = produtoNomeParaId.get(txt) ?? '';
              container.classList.add('hidden');
              produtoInput.focus();
            });
            // se houver correspondência exata, preenche id
            const exactId = produtoNomeParaId.get(val);
            selectProdutosHidden.value = exactId ?? '';
          });

          // keyboard navigation
          produtoInput.addEventListener('keydown', (e) => {
            const items = produtoSuggestions.querySelectorAll('.suggestion-item');
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
              const active = produtoSuggestions.querySelector('.suggestion-item.active');
              if (active) {
                e.preventDefault();
                active.click();
              }
            } else if (e.key === 'Escape') {
              produtoSuggestions.classList.add('hidden');
            }
          });

          // hide on blur (small timeout for click to register)
          produtoInput.addEventListener('blur', () => setTimeout(() => produtoSuggestions.classList.add('hidden'), 150));

        }).catch(err => {
          console.warn("⚠️ Erro ao carregar produtos:", err);
        });
      }
    }).catch(err => {
      console.warn("⚠️ Módulo produtos.js não encontrado ou erro ao carregar:", err);
    });

    // listar notas no datalist e mapear número -> id
    const selectNotasHidden = this.querySelector("#notaFiscalSelecionada"); // hidden input para compatibilidade
    const notaInput = this.querySelector("#notaFiscalInput");
    const notaSuggestions = this.querySelector("#notaSuggestions");
    const notaNumeroParaId = new Map();

    import("../../js/modules/itensNota.js").then(module => {
      if (module.carregarNotas) {
        module.carregarNotas().then(notas => {
          const numeros = notas.map(n => `${n.numero}`);
          numeros.forEach((num, i) => notaNumeroParaId.set(num, notas[i].id));

          notaInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (!val) {
              notaSuggestions.classList.add('hidden');
              selectNotasHidden.value = '';
              return;
            }
            const matches = numeros.filter(n => n.toLowerCase().includes(val.toLowerCase())).slice(0,8);
            renderSuggestions(notaSuggestions, matches, val, (txt, container) => {
              notaInput.value = txt;
              selectNotasHidden.value = notaNumeroParaId.get(txt) ?? '';
              container.classList.add('hidden');
              notaInput.focus();
            });
            const exactId = notaNumeroParaId.get(val);
            selectNotasHidden.value = exactId ?? '';
          });

          notaInput.addEventListener('keydown', (e) => {
            const items = notaSuggestions.querySelectorAll('.suggestion-item');
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
              const active = notaSuggestions.querySelector('.suggestion-item.active');
              if (active) {
                e.preventDefault();
                active.click();
              }
            } else if (e.key === 'Escape') {
              notaSuggestions.classList.add('hidden');
            }
          });

          notaInput.addEventListener('blur', () => setTimeout(() => notaSuggestions.classList.add('hidden'), 150));

        }
        ).catch(err => {
          console.warn("⚠️ Erro ao carregar notas:", err);
        });
      }
    }).catch(err => {
      console.warn("⚠️ Módulo notas.js não encontrado ou erro ao carregar:", err);
    });

    // Aplicar formatação de moeda no input de valor unitário (aguarda módulo carregar)
    const valorUnitInput = this.querySelector("#valorUnitarioProdutoNota");
    if (valorUnitInput && aplicarFormatacaoMoeda) {
      aplicarFormatacaoMoeda(valorUnitInput);
    } else if (valorUnitInput) {
      setTimeout(() => {
        if (aplicarFormatacaoMoeda) {
          aplicarFormatacaoMoeda(valorUnitInput);
        }
      }, 100);
    }

    // Atualizar preview do total automaticamente quando quantidade/valor mudarem
    const quantidadeInput = this.querySelector("#quantidadeProdutoNota");
    const previewTotalEl = this.querySelector("#previewTotal");

    const formatCurrencyBRL = (value) => {
      if (Number.isNaN(value) || value === null) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const updatePreviewTotal = () => {
      if (!quantidadeInput || !valorUnitInput || !previewTotalEl) return;
      const qtd = parseFloat(quantidadeInput.value) || 0;
      const preco = obterValorNumerico ? obterValorNumerico(valorUnitInput) : (Number(valorUnitInput.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0); // Converte de R$ 0,00 para número
      const total = qtd * preco;
      previewTotalEl.textContent = formatCurrencyBRL(total);
    };

    quantidadeInput?.addEventListener('input', updatePreviewTotal);
    valorUnitInput?.addEventListener('input', updatePreviewTotal);
    // Atualiza ao abrir o modal (valores iniciais)
    setTimeout(updatePreviewTotal, 0);

    // Listener do formulário
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const dataItensNota = ({
        produto_id: Number(this.querySelector("#produtoNota").value),
        quantidade: parseFloat(this.querySelector("#quantidadeProdutoNota").value) || 0,
        preco: obterValorNumerico ? obterValorNumerico(this.querySelector("#valorUnitarioProdutoNota")) : (Number(this.querySelector("#valorUnitarioProdutoNota").value.replace(/[^\d,]/g, '').replace(',', '.')) || 0), // Converte de R$ 0,00 para número
        nota_id: Number(this.querySelector("#notaFiscalSelecionada").value),
      });

      console.log("Dados do item da nota a salvar:", dataItensNota);

      salvarItemNota(dataItensNota);

      // Resetar formulário e fechar modal

      form.reset();
      modal.classList.add("hidden");
    });
  }
}

customElements.define("modal-items-notas", ModalItemsNotas);

