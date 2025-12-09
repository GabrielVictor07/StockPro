class TabelaEntradas extends HTMLElement {
  constructor() {
    super();
    this.dados = [];
  }

  connectedCallback() {
    this.render();
    this.carregarEntradas();
  }

  async carregarEntradas() {
    try {
      const res = await fetch("http://localhost:3000/api/entradas");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const dados = await res.json();
      this.setDados(dados);
    } catch (erro) {
      this.render(); // Renderiza a tabela vazia mesmo com erro
    }
  }

  async carregarEntradas() {
  try {
    const res = await fetch("http://localhost:3000/api/entradas");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const dados = await res.json();

    // Data atual
    const hoje = new Date();
    const mesAtual = hoje.getMonth();    
    const anoAtual = hoje.getFullYear();

    // Filtra só entradas do mês atual
    const entradasFiltradas = dados.filter(item => {
      const data = new Date(item.data);
      return (
        data.getMonth() === mesAtual &&
        data.getFullYear() === anoAtual
      );
    });

    this.setDados(entradasFiltradas);
  } catch (erro) {
    this.render(); 
  }
}


  // Método para atualizar os dados
  setDados(dados) {
    this.dados = dados;
    this.render();
  }

  render() {
  const linhas = this.dados
    .map(
      (item) => `
    <tr class="border-b border-white/5 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-transparent transition-all duration-300 group">
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            ${item.id}
          </span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <i class="fas fa-box text-white text-sm"></i>
          </div>
          <span class="font-medium text-gray-200">${item.produto}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <i class="fas fa-truck text-gray-500 text-sm"></i>
          <span class="text-gray-300">${item.fornecedor}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <i class="fas fa-plus text-green-400 text-xs"></i>
          </div>
          <span class="font-bold text-green-400">${item.quantidade}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <i class="fas fa-calendar text-gray-500 text-sm"></i>
          <span class="text-gray-300">${item.data}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <span class="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-lg text-sm font-medium border border-cyan-500/30">
          ${item.precoUnit}
        </span>
      </td>
      <td class="py-4 px-6">
        <span class="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-lg font-bold border border-green-500/30">
          ${item.total}
        </span>
      </td>
    </tr>
  `
    )
    .join("");

  this.innerHTML = `
  <div class="gradient-border p-6 rounded-xl">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <i class="fas fa-arrow-down text-white"></i>
        </div>
        Entradas do Mês
      </h2>
      <div class="flex items-center gap-3">
        <div class="relative">
          <input 
            type="search" 
            class="bg-white/5 border border-white/10 text-white px-5 py-2.5 pr-12 rounded-xl outline-none focus:border-green-500 transition-colors placeholder-gray-500 w-80" 
            placeholder="Pesquisar entrada..." 
          />
          <button 
            type="submit" 
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
          >
            <i class="fas fa-search text-white text-sm"></i>
          </button>
        </div>
        <button 
          type="button" 
          class="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <i class="fas fa-download text-sm"></i>
          Baixar Relatório
        </button>
      </div>
    </div>
    <div class="overflow-x-auto rounded-xl">
      <table class="w-full min-h-96">
        <thead>
          <tr class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-white/10">
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-hashtag mr-2 text-green-400"></i>ID
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-box mr-2 text-blue-400"></i>Produto
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-truck mr-2 text-cyan-400"></i>Fornecedor
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-arrow-up mr-2 text-emerald-400"></i>Quantidade
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-calendar mr-2 text-teal-400"></i>Data
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-tag mr-2 text-cyan-400"></i>Preço Unit.
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-dollar-sign mr-2 text-green-400"></i>Total
            </th>
          </tr>
        </thead>
        <tbody class="bg-[#0f0f0f]/50">
          ${linhas.length > 0 ? linhas : `
            <tr>
              <td colspan="7" class="py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <i class="fas fa-arrow-down text-gray-600 text-2xl"></i>
                  </div>
                  <p class="text-gray-500 font-medium">Nenhuma entrada registrada</p>
                  <p class="text-gray-600 text-sm">As entradas do mês aparecerão aqui</p>
                </div>
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  </div>
  `;
}
}

customElements.define("tabela-entradas", TabelaEntradas);
