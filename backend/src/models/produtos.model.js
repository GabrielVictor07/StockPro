import db from "../database/connection.js";

export default {
  getAll() {
    return db.prepare("SELECT * FROM produtos").all();
  },

  getById(id) {
    return db.prepare("SELECT * FROM produtos WHERE id = ?").get(id);
  },

  create({ nome, codigo, categoria_id, estoque, preco, estoque_minimo }) {
    return db
      .prepare(
        "INSERT INTO produtos (nome, codigo, categoria_id, estoque, preco, estoque_minimo) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(nome, codigo, categoria_id, estoque, preco, estoque_minimo);
  },

  atualizarEstoque(produtoId, quantidade) {
    return db
      .prepare("UPDATE produtos SET estoque = estoque - ? WHERE id = ?")
      .run(quantidade, produtoId);
  },

  // ENTRADAS: soma estoque e atualiza preço com o último preço comprado
  aumentarEstoqueEAtualizarPreco(produtoId, quantidade, novoPreco) {
    return db
      .prepare(
        "UPDATE produtos SET estoque = estoque + ?, preco = ? WHERE id = ?"
      )
      .run(quantidade, novoPreco, produtoId);
  },

  atualizar({ id, nome, codigo, categoria_id, estoque, preco, estoque_minimo }) {
    return db
      .prepare(
        `UPDATE produtos 
         SET nome = ?, codigo = ?, categoria_id = ?, estoque = ?, preco = ?, estoque_minimo = ?
         WHERE id = ?`
      )
      .run(nome, codigo, categoria_id, estoque, preco, estoque_minimo, id);
  },
};
