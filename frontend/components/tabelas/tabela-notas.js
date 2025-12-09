class TabelaNotas extends HTMLElement {
  connectedCallback() {
    this.renderTable([]);
    this.fetchNotas();
  }

  renderTable(notas) {
  const linhas = notas.map((nota, index) => `
    <tr class="border-b border-white/5 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-transparent transition-all duration-300 group">
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            ${nota.id}
          </span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <i class="fas fa-truck text-white text-sm"></i>
          </div>
          <span class="font-medium text-gray-200">${nota.fornecedor_nome ?? nota.fornecedor ?? nota.fornecedor_id ?? 'N/A'}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <div class="flex items-center gap-2">
          <i class="fas fa-calendar text-gray-500 text-sm"></i>
          <span class="text-gray-300">${nota.data}</span>
        </div>
      </td>
      <td class="py-4 px-6">
        <span class="px-3 py-1 bg-white/5 rounded-lg text-gray-300 font-mono text-sm border border-white/10">
          ${nota.numero}
        </span>
      </td>
      <td class="py-4 px-6">
        <span class="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-lg font-bold border border-green-500/30">
          R$ ${typeof nota.valor_total === 'number' ? nota.valor_total.toFixed(2) : nota.valor_total}
        </span>
      </td>
    </tr>
  `).join('');

  this.innerHTML = `
    <div class="overflow-x-auto rounded-xl">
      <table class="w-full min-h-96">
        <thead>
          <tr class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-hashtag mr-2 text-purple-400"></i>ID
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-building mr-2 text-blue-400"></i>Fornecedor
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-calendar mr-2 text-cyan-400"></i>Data
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-file-invoice mr-2 text-pink-400"></i>Nº Nota
            </th>
            <th class="py-4 px-6 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
              <i class="fas fa-dollar-sign mr-2 text-green-400"></i>Total
            </th>
          </tr>
        </thead>
        <tbody class="bg-[#0f0f0f]/50">
          ${linhas.length > 0 ? linhas : `
            <tr>
              <td colspan="5" class="py-12 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <i class="fas fa-inbox text-gray-600 text-2xl"></i>
                  </div>
                  <p class="text-gray-500 font-medium">Nenhuma nota cadastrada</p>
                  <p class="text-gray-600 text-sm">Cadastre sua primeira nota fiscal</p>
                </div>
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>
  `;
}

  async fetchNotas() {
    try {
      // usar apiGet se disponível (service com cache), cair para fetch se não
      let notas, fornecedores;
      try {
        const api = await import('../../js/services/api.js');
        notas = await api.apiGet('/notas');
        fornecedores = await api.apiGet('/fornecedores');
      } catch (e) {
        const [resNotas, resFornecedores] = await Promise.all([
          fetch('http://localhost:3000/api/notas'),
          fetch('http://localhost:3000/api/fornecedores'),
        ]);
        notas = await resNotas.json();
        fornecedores = await resFornecedores.json();
      }

      const fornecedoresMap = new Map(fornecedores.map((f) => [f.id, f.nome]));

      // Data atual
      const hoje = new Date();
      const mesAtual = hoje.getMonth(); // 0-11
      const anoAtual = hoje.getFullYear(); // 4 dígitos

      // Filtrando só as notas do mês atual
      const notasFiltradas = notas.filter((n) => {
        const dataN = new Date(n.data);
        return dataN.getMonth() === mesAtual && dataN.getFullYear() === anoAtual;
      });

      const notasComFornecedor = notasFiltradas.map((n) => ({
        ...n,
        fornecedor_nome:
          n.fornecedor_nome ?? fornecedoresMap.get(n.fornecedor_id ?? n.fornecedor) ?? n.fornecedor,
      }));

      this.renderTable(notasComFornecedor);
    } catch (error) {
      console.error('Erro ao buscar notas/fornecedores:', error);
    }
  }

}



customElements.define('tabela-notas', TabelaNotas);
