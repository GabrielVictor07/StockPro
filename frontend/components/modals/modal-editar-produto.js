let editarProduto = (data) =>
  console.log("EditarProduto: dados recebidos", data);
let carregarCategorias = async () => [];

try {
  import("../../js/modules/produtos.js")
    .then((module) => {
      if (module.editarProduto) {
        editarProduto = module.editarProduto;
      }
      if (module.carregarCategorias) {
        carregarCategorias = module.carregarCategorias;
      }
    })
    .catch((err) => {
      console.warn("⚠️ Erro ao carregar módulo Produtos.js:", err);
    });
} catch (e) {
  console.warn("⚠️ Erro ao importar Produtos.js:", e);
}

class ModalEditarProduto extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div id="modal_editar_produto" class="modal-overlay hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="modal-content bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6">
          
          <h3 class="text-2xl font-bold text-pink-400">Editar Produto</h3>
          <p class="text-gray-500 mb-4">Atualize as informações necessárias</p>

          <form id="editarProdutoForm" class="space-y-4">

            <input type="hidden" id="editarIdProduto" />

            <div>
              <label class="text-gray-300 text-sm">Nome</label>
              <input id="editarNomeProduto" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
            </div>

            <div>
              <label class="text-gray-300 text-sm">Código</label>
              <input id="editarCodigoProduto" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
            </div>

            <div>
              <label class="text-gray-300 text-sm">Categoria</label>
              <select id="editarCategoriaProduto" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                <option value="">Selecione</option>
              </select>
            </div>

            <div>
              <label class="text-gray-300 text-sm">Quantidade</label>
              <input type="number" id="editarQuantidadeProduto"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
            </div>

            <div>
              <label class="text-gray-300 text-sm">Valor</label>
              <input type="text" id="editarValorProduto"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
            </div>

            <div>
              <label class="text-gray-300 text-sm">Estoque mínimo</label>
              <input type="number" id="editarEstoqueMinimoProduto"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" />
            </div>

            <button class="w-full bg-pink-600 py-3 rounded-xl text-white font-semibold">
              Atualizar
            </button>
          </form>
        </div>
      </div>
    `;

    const modal = this.querySelector("#modal_editar_produto");
    const form = this.querySelector("#editarProdutoForm");
    const selectCategoria = this.querySelector("#editarCategoriaProduto");

    // carrega as categorias e popula o select
    carregarCategorias()
      .then((cats) => {
        if (!Array.isArray(cats)) return;
        const options = [
          `<option value="">Selecione</option>`,
          ...cats.map((c) => `<option value="${c.id}">${c.nome}</option>`),
        ].join("");
        selectCategoria.innerHTML = options;
      })
      .catch((err) => {
        console.warn("Erro ao carregar categorias no modal de editar:", err);
      });

    // evento do botão salvar
    form.addEventListener("submit", e => {
      e.preventDefault();

      const data = {
        id: Number(this.querySelector("#editarIdProduto").value),
        nome: this.querySelector("#editarNomeProduto").value,
        codigo: this.querySelector("#editarCodigoProduto").value,
        categoria_id: Number(this.querySelector("#editarCategoriaProduto").value),
        estoque: Number(this.querySelector("#editarQuantidadeProduto").value),
        preco: Number(this.querySelector("#editarValorProduto").value.replace(",", ".")),
        estoque_minimo: Number(this.querySelector("#editarEstoqueMinimoProduto").value)
      };

      editarProduto(data);
      modal.classList.add("hidden");
    });
  }

  // método para abrir o modal passando os dados
  abrir(produto) {
    const modal = this.querySelector("#modal_editar_produto");
    // Preenche os campos básicos
    this.querySelector("#editarIdProduto").value = produto.id;
    this.querySelector("#editarNomeProduto").value = produto.nome;
    this.querySelector("#editarCodigoProduto").value = produto.codigo;
    this.querySelector("#editarQuantidadeProduto").value = produto.estoque;
    this.querySelector("#editarValorProduto").value = produto.preco;
    this.querySelector("#editarEstoqueMinimoProduto").value = produto.estoque_minimo;

    // Garantir que as categorias estejam carregadas antes de setar o valor
    const select = this.querySelector("#editarCategoriaProduto");
    carregarCategorias()
      .then((cats) => {
        if (Array.isArray(cats)) {
          const options = [
            `<option value="">Selecione</option>`,
            ...cats.map((c) => `<option value="${c.id}">${c.nome}</option>`),
          ].join("");
          select.innerHTML = options;
        }
        select.value = produto.categoria_id ?? "";
      })
      .catch((err) => {
        console.warn("Erro ao carregar categorias ao abrir modal de edição:", err);
        // mesmo em erro, tenta setar o valor (pode não existir option correspondente)
        select.value = produto.categoria_id ?? "";
      })
      .finally(() => modal.classList.remove("hidden"));
  }
}

customElements.define("modal-editar-produto", ModalEditarProduto);
