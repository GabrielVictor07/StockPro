import { apiGet } from "../services/api.js";

/**
 * Calcula e atualiza os cards de resumo do dashboard:
 * - Produtos com baixo estoque
 * - Estoque total
 * - Gastos do mês (com base nas entradas)
 */
export async function atualizarCardsDashboard() {
  try {
    // Busca produtos e entradas na API
    const [produtos, entradas] = await Promise.all([
      apiGet("/produtos"),
      apiGet("/entradas"),
    ]);

    // --- Produtos com baixo estoque & Estoque total ---
    let baixoEstoque = 0;
    let estoqueTotal = 0;

    produtos.forEach((p) => {
      const estoque = Number(p.estoque) || 0;
      const estoqueMinimo = Number(p.estoque_minimo) || 0;

      estoqueTotal += estoque;

      if (estoqueMinimo > 0 && estoque <= estoqueMinimo) {
        baixoEstoque++;
      }
    });

    // --- Gastos do mês (somando total das entradas do mês atual) ---
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    let gastosMes = 0;

    entradas.forEach((e) => {
      // e.data vem do SELECT em entradas.js
      const data = new Date(e.data);

      if (data.getMonth() === mesAtual && data.getFullYear() === anoAtual) {
        // Campo total já vem calculado no SELECT (quantidade * preco)
        const total =
          Number(e.total) ||
          Number(e.quantidade || 0) * Number(e.precoUnit || 0);
        gastosMes += total;
      }
    });

    // --- Atualiza DOM ---
    const elBaixo = document.getElementById("card-baixo-estoque");
    const elBaixoDesc = document.getElementById("card-baixo-estoque-descricao");
    const elEstoqueTotal = document.getElementById("card-estoque-total");
    const elGastosMes = document.getElementById("card-gastos-mes");

    if (elBaixo) {
      elBaixo.textContent = String(baixoEstoque);
    }

    if (elBaixoDesc) {
      if (baixoEstoque === 0) {
        elBaixoDesc.textContent = "Nenhum produto em alerta";
      } else if (baixoEstoque === 1) {
        elBaixoDesc.textContent = "1 produto em alerta";
      } else {
        elBaixoDesc.textContent = `${baixoEstoque} produtos em alerta`;
      }
    }

    if (elEstoqueTotal) {
      elEstoqueTotal.textContent = String(estoqueTotal);
    }

    if (elGastosMes) {
      elGastosMes.textContent = gastosMes.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      });
    }
  } catch (erro) {
    console.error("Erro ao atualizar cards do dashboard:", erro);
  }
}

export async function inicializarDashboard() {
  await atualizarCardsDashboard();
}


