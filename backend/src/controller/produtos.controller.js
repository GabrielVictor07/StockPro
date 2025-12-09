import ProdutoService from "../services/produtos.service.js";

export default {
  listar(req, res) {
    const produtos = ProdutoService.listar();
    res.json(produtos);
  },

  criar(req, res) {
    const novo = ProdutoService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    const atualizado = ProdutoService.atualizar(req.body);
    res.json(atualizado);
  },
};
