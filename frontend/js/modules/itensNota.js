import { apiPost, apiGet } from "../services/api.js";
import { toast } from "../core/utils.js";
import { atualizarCardsEstatisticas } from "./estatisticas.js";

export async function salvarItemNota(data) {
  const response = await apiPost("/itensNota", data);
  if (response.ok) {
    toast("Item adicionado à nota!", "success");
    // Atualizar os cards de estatísticas
    await atualizarCardsEstatisticas();
    
    // Atualizar a tabela de produtos para refletir o novo estoque e preço
    const tabelaProdutos = document.querySelector("tabela-produtos");
    if (tabelaProdutos && tabelaProdutos.fetchProdutos) {
      await tabelaProdutos.fetchProdutos();
    }
  } else {
    toast("Erro ao adicionar item.", "error");
  }
}

export async function carregarProdutos() {
  return apiGet("/produtos");
}

export async function carregarNotas() {
  return apiGet("/notas");
}