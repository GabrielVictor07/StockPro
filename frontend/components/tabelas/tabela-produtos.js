class TabelaProdutos extends HTMLElement {
  constructor() {
    super();
    this.produtosCompletos = []; // Armazena todos os produtos para filtro
  }

  connectedCallback() {
    this.renderTable([]);
    this.fetchProdutos();
  }

  renderTable(produtos) {
    // Preserva o valor do input de pesquisa antes de re-renderizar
    const inputPesquisa = this.querySelector("#inputPesquisaProduto");
    const valorPesquisa = inputPesquisa ? inputPesquisa.value : "";

    const linhas = produtos
      .map((produto) => {
        const limiteBaixo = produto.estoque_minimo ?? 10;
        const baixo = Number(produto.estoque) <= Number(limiteBaixo);

        return `
    <tr class="border-b border-white/5 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-transparent transition-all duration-300 group">
      <td class="py-4 px-6">
        <span class="px-3 py-1 bg-white/5 rounded-lg text-gray-300 font-mono text-sm border border-white/10">
          ${produto.codigo}
        </span>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <i class="fas fa-box text-white text-sm"></i>
          </div>
          <span class="font-semibold text-gray-200">${produto.nome}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <span class="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-lg text-sm font-medium border border-cyan-500/30">
          ${produto.categoria_nome ?? produto.categoria_id}
        </span>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg ${
            baixo
              ? "bg-red-500/20 border-red-500/30"
              : "bg-green-500/20 border-green-500/30"
          } border flex items-center justify-center">
            <i class="fas fa-layer-group ${
              baixo ? "text-red-400" : "text-green-400"
            } text-xs"></i>
          </div>
          <span class="font-bold ${
            baixo ? "text-red-400" : "text-green-400"
          }">${produto.estoque}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <span class="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 rounded-lg font-bold border border-emerald-500/30">
          R$ ${produto.preco.toFixed(2)}
        </span>
      </td>
      <td class="py-4 px-6">
        <div class="flex gap-2">
<button 
  class="btn-editar px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
  data-produto='${JSON.stringify(produto)}'
>
  <i class="fas fa-edit text-sm"></i>
  Editar
</button>
        </div>
      </td>
    </tr>
  `;
      })
      .join("");

    this.innerHTML = `
    <div class="gradient-border p-6 rounded-xl mt-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <i class="fas fa-boxes text-white"></i>
          </div>
          Produtos Cadastrados
        </h2>
        <div class="flex items-center gap-3">
          <div class="relative">
            <input 
              type="text" 
              id="inputPesquisaProduto"
              class="bg-white/5 border border-white/10 text-white px-5 py-2.5 pr-12 rounded-xl outline-none focus:border-purple-500 transition-colors placeholder-gray-500 w-80" 
              placeholder="Pesquisar produto..." 
              autocomplete="off"
              style="color: white !important;"
            />
            <button 
              type="button" 
              id="btnLimparPesquisa"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 gradient-bg rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <i class="fas fa-search text-white text-sm"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto rounded-xl">
        <table class="w-full min-h-96">
          <thead>
            <tr class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
              <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                <i class="fas fa-barcode mr-2 text-purple-400"></i>Código
              </th>
              <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                <i class="fas fa-tag mr-2 text-pink-400"></i>Nome
              </th>
              <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                <i class="fas fa-folder mr-2 text-cyan-400"></i>Categoria
              </th>
              <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                <i class="fas fa-cubes mr-2 text-green-400"></i>Quantidade
              </th>
              <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                <i class="fas fa-dollar-sign mr-2 text-emerald-400"></i>Preço
              </th>
              <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                <i class="fas fa-cog mr-2 text-blue-400"></i>Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-[#0f0f0f]/50">
            ${
              linhas.length > 0
                ? linhas
                : `
              <tr>
                <td colspan="6" class="py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <i class="fas fa-box-open text-gray-600 text-2xl"></i>
                    </div>
                    <p class="text-gray-500 font-medium">Nenhum produto cadastrado</p>
                    <p class="text-gray-600 text-sm">Clique em "Cadastrar Produto" para começar</p>
                  </div>
                </td>
              </tr>
            `
            }
          </tbody>
        </table>
      </div>
    </div>
  `;

    // Restaura o valor do input de pesquisa após renderizar
    setTimeout(() => {
      const inputPesquisa = this.querySelector("#inputPesquisaProduto");
      if (inputPesquisa && valorPesquisa) {
        inputPesquisa.value = valorPesquisa;
      }
    }, 10);

    // Reconfigura os listeners de pesquisa após renderizar
    this.setupPesquisa();
  }

  async fetchProdutos() {
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        fetch("http://localhost:3000/api/produtos"),
        fetch("http://localhost:3000/api/categorias"),
      ]);

      const produtos = await resProdutos.json();
      const categorias = await resCategorias.json();

      // Cria um mapa id -> nome para categorias
      const categoriasMap = new Map(categorias.map((c) => [c.id, c.nome]));

      // Se o backend já retornar 'categoria_nome' não alteramos, caso contrário
      // adicionamos a propriedade em cada produto para facilitar o template
      const produtosComCategoria = produtos.map((p) => ({
        ...p,
        categoria_nome:
          p.categoria_nome ??
          categoriasMap.get(p.categoria_id) ??
          p.categoria_id,
      }));

      // Armazena a lista completa para filtro
      this.produtosCompletos = produtosComCategoria;

      // Aplica filtro se houver termo de pesquisa
      const inputPesquisa = this.querySelector("#inputPesquisaProduto");
      const termoPesquisa = inputPesquisa ? inputPesquisa.value.trim() : "";

      if (termoPesquisa) {
        this.filtrarProdutos(termoPesquisa);
      } else {
        this.renderTable(produtosComCategoria);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  setupPesquisa() {
    // Aguarda o DOM estar pronto
    setTimeout(() => {
      const inputPesquisa = this.querySelector("#inputPesquisaProduto");
      const btnPesquisar = this.querySelector("#btnLimparPesquisa");

      if (!inputPesquisa) return;

      // Função para executar a pesquisa
      const executarPesquisa = () => {
        const termo = inputPesquisa.value.trim();
        this.filtrarProdutos(termo);
      };

      // Pesquisa ao clicar no botão
      if (btnPesquisar) {
        btnPesquisar.addEventListener("click", (e) => {
          e.preventDefault();
          executarPesquisa();
        });
      }

      // Pesquisa ao pressionar Enter no input
      inputPesquisa.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          executarPesquisa();
        }
      });
    }, 50);
  }

  filtrarProdutos(termo) {
    if (!termo || termo === "") {
      // Se não há termo, mostra todos os produtos
      this.renderTable(this.produtosCompletos);
      return;
    }

    // Filtra produtos pelo nome (case-insensitive)
    const termoLower = termo.toLowerCase();
    const produtosFiltrados = this.produtosCompletos.filter((produto) =>
      produto.nome.toLowerCase().includes(termoLower)
    );

    this.renderTable(produtosFiltrados);
  }
}

customElements.define("tabela-produtos", TabelaProdutos);
