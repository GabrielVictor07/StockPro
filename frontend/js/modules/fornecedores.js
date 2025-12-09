import { apiPost, apiGet } from "../services/api.js";
import { toast } from "../core/utils.js";

export async function salvarFornecedor(data) {
  const response = await apiPost("/fornecedores", data);
  if (response.ok) toast("Fornecedor cadastrado!", "success");
  else toast("Erro ao cadastrar fornecedor.", "error");
}
