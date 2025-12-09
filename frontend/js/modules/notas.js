import { apiPost, apiGet } from "../services/api.js";
import { toast } from "../core/utils.js";
import { atualizarCardsEstatisticas } from "./estatisticas.js";

export async function salvarNota(data) {
  const response = await apiPost("/notas", data);
  if (response.ok) {
    toast("Nota cadastrada!", "success");
    // Atualizar os cards de estatísticas
    await atualizarCardsEstatisticas();
  } else {
    toast("Erro ao cadastrar nota.", "error");
  }
}

export async function carregarFornecedores() {
  return apiGet("/fornecedores");
}