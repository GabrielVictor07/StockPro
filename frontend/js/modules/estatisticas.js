import { apiGet } from "../services/api.js";

/**
 * Calcula estatísticas das notas de entrada do mês
 * @returns {Promise<{totalNotas: number, valorTotal: number, produtosInseridos: number}>}
 */
export async function calcularEstatisticasNotas() {
  try {
    // Usa a mesma base de API do restante do front (http://localhost:3000/api)
    const [notas, itens] = await Promise.all([
      apiGet("/notas"),
      apiGet("/itensNota"),
    ]);
    // Obter data atual
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();

    // Filtrar notas do mês atual
    const notasDoMes = notas.filter((nota) => {
      const dataNota = new Date(nota.data);
      return (
        dataNota.getMonth() === mesAtual && dataNota.getFullYear() === anoAtual
      );
    });

    // Calcular total de notas
    const totalNotas = notasDoMes.length;

    // Calcular valor total das notas
    const valorTotal = notasDoMes.reduce(
      (soma, nota) => soma + (parseFloat(nota.valor_total) || 0),
      0
    );

    // Calcular quantidade de produtos inseridos
    const produtosInseridos = itens.length;

    const resultado = {
      totalNotas,
      valorTotal,
      produtosInseridos,
    };
    return resultado;
  } catch (erro) {
    return {
      totalNotas: 0,
      valorTotal: 0,
      produtosInseridos: 0,
    };
  }
}

/**
 * Atualiza os cards de resumo das notas
 */
export async function atualizarCardsEstatisticas() {
  const stats = await calcularEstatisticasNotas();

  // Selecionando os cards usando IDs
  const cardTotalNotas = document.getElementById("valor-total-notas");
  const cardValorTotal = document.getElementById("valor-valor-total");
  const cardProdutosInseridos = document.getElementById("valor-produtos-inseridos");

  if (cardTotalNotas) {
    cardTotalNotas.textContent = stats.totalNotas;
  } else {
  }

  if (cardValorTotal) {
    cardValorTotal.textContent = `R$ ${stats.valorTotal.toFixed(2).replace(".", ",")}`;
  } else {
  }

  if (cardProdutosInseridos) {
    cardProdutosInseridos.textContent = stats.produtosInseridos;
  } else {
  }
}

/**
 * Inicializa o carregamento das estatísticas
 */
export async function inicializarEstatisticas() {
  await atualizarCardsEstatisticas();
}
