class tabelaSaidas extends HTMLElement {
  connectedCallback() {
    this.renderTable([]);
    this.fetchSaidas();
  }

  renderTable(saidas) {
  const linhas = saidas
    .map((saida) => `
    <tr class="border-b border-white/5 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-transparent transition-all duration-300 group">
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
            ${saida.id}
          </span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <i class="fas fa-arrow-up text-white text-sm"></i>
          </div>
          <span class="font-medium text-gray-200">${saida.produto_nome ?? saida.produto ?? saida.produto_id ?? 'N/A'}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <i class="fas fa-minus text-red-400 text-xs"></i>
          </div>
          <span class="font-bold text-red-400">${saida.quantidade}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <i class="fas fa-clock text-gray-500 text-sm"></i>
          <span class="text-gray-300">${saida.data_hora}</span>
        </div>
      </td>
    </tr>
  `)
    .join('');

  this.innerHTML = `
    <div class="overflow-x-auto rounded-xl">
      <table class="w-full min-h-96">
        <thead>
          <tr class="bg-gradient-to-r from-red-500/20 to-rose-500/20 border-b border-white/10">
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-hashtag mr-2 text-red-400"></i>ID
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-box mr-2 text-orange-400"></i>Produto
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-arrow-down mr-2 text-rose-400"></i>Quantidade
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-calendar-alt mr-2 text-pink-400"></i>Data/Hora
            </th>
          </tr>
        </thead>
        <tbody class="bg-[#0f0f0f]/50">
          ${linhas.length > 0 ? linhas : `
            <tr>
              <td colspan="4" class="py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <i class="fas fa-arrow-up text-gray-600 text-2xl"></i>
                  </div>
                  <p class="text-gray-500 font-medium">Nenhuma saída registrada</p>
                  <p class="text-gray-600 text-sm">Cadastre a primeira saída de produto</p>
                </div>
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

  async fetchSaidas() {
    try {
      const [resSaidas, resProdutos] = await Promise.all([
        fetch('http://localhost:3000/api/saidas'),
        fetch('http://localhost:3000/api/produtos'),
      ]);
      const saidas = await resSaidas.json();
      const produtos = await resProdutos.json();
      const produtosMap = new Map(produtos.map((p) => [p.id, p.nome]));
      const saidasComProduto = saidas.map((s) => ({
        ...s,
        produto_nome:
          s.produto_nome ??
          produtosMap.get(s.produto_id ?? s.produto) ??
          s.produto,
      }));
      this.renderTable(saidasComProduto);
    } catch (error) {
      console.error('Erro ao buscar saidas/produtos:', error);
    }
  }

  async fetchSaidas() {
  try {
    const [resSaidas, resProdutos] = await Promise.all([
      fetch('http://localhost:3000/api/saidas'),
      fetch('http://localhost:3000/api/produtos'),
    ]);

    const saidas = await resSaidas.json();
    const produtos = await resProdutos.json();

    const produtosMap = new Map(produtos.map((p) => [p.id, p.nome]));

    // Data atual
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    // Filtro das saídas do mês
    const saidasDoMes = saidas.filter((s) => {
      const data = new Date(s.data_hora);
      return (
        data.getMonth() === mesAtual &&
        data.getFullYear() === anoAtual
      );
    });

    const saidasComProduto = saidasDoMes.map((s) => ({
      ...s,
      produto_nome:
        s.produto_nome ??
        produtosMap.get(s.produto_id ?? s.produto) ??
        s.produto,
    }));

    this.renderTable(saidasComProduto);
  } catch (error) {
    console.error('Erro ao buscar saidas/produtos:', error);
  }
}

}

customElements.define('tabela-saidas', tabelaSaidas);