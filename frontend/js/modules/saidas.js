import { apiPost, apiGet } from "../services/api.js";
import { toast } from "../core/utils.js";

export async function salvarSaidas(data) {
  const response = await apiPost("/saidas", data);
  if (response.ok) {
    toast("Saida Cadastrada com Sucesso!", "success");
  } else {
    toast("Erro ao cadastrar saida.", "error");
  }
}

export async function carregarProdutos() {
  return apiGet("/produtos");
}
