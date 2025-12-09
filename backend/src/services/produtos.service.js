import ProdutoModel from "../models/produtos.model.js";

export default {
  listar() {
    return ProdutoModel.getAll();
  },

  criar(dadosProduto) {
    return ProdutoModel.create(dadosProduto);
  },

  atualizar(dadosProduto) {
    return ProdutoModel.atualizar(dadosProduto);
  },
};
