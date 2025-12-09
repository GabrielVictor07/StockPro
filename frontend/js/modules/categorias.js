import { apiPost, apiGet } from "../services/api.js";
import { toast } from "../core/utils.js";

export async function salvarCategoria(data) {
  const response = await apiPost("/categorias", data);
  if (response.ok) toast("Categoria cadastrada!", "success");
  else toast("Erro ao cadastrar categoria.", "error");
}
