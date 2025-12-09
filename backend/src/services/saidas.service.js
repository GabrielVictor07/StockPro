import SaidasModel from "../models/saidas.model.js";
import ProdutoModel from "../models/produtos.model.js";

export default {
    listar() {
        return SaidasModel.getAll();
    },

    criar(dadosSaida) {
        // Cria a saída
        const resultado = SaidasModel.create(dadosSaida);
        
        // Atualiza o estoque do produto
        ProdutoModel.atualizarEstoque(dadosSaida.produto_id, dadosSaida.quantidade);
        
        return resultado;
    }
};