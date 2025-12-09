import { apiPost, apiGet, apiPut } from "../services/api.js";
import { toast } from "../core/utils.js";

export async function salvarProduto(dataProduto) {
  const response = await apiPost("/produtos", dataProduto);
  if (response.ok) {
    toast("Produto cadastrado com sucesso!", "success");
  } else {
    toast("Erro ao cadastrar produto.", "error");
  }
}

export async function carregarCategorias() {
  return apiGet("/categorias");
}

// Função usada pelo modal de edição
export async function editarProduto(dataProduto) {
  if (!dataProduto || !dataProduto.id) {
    toast("ID do produto ausente.", "warn");
    return false;
  }

  const response = await apiPut(`/produtos/${dataProduto.id}`, dataProduto);

  if (response.ok) {
    toast("Produto atualizado com sucesso!", "success");
    // Atualiza a tabela de produtos se estiver presente
    try {
      const tabela = document.querySelector("tabela-produtos");
      if (tabela && typeof tabela.fetchProdutos === "function") {
        tabela.fetchProdutos();
      }
    } catch (e) {
      console.warn("Não foi possível atualizar a tabela automaticamente:", e);
    }

    return true;
  } else {
    toast("Erro ao atualizar produto.", "error");
    return false;
  }
}