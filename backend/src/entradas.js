// entradas.js ou dentro do seu server
import db from "./database/connection.js";
import express from "express";
const router = express.Router();

router.get("/entradas", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        itens_nota.id,
        produtos.nome AS produto,
        fornecedores.nome AS fornecedor,
        itens_nota.quantidade AS quantidade,
        notas.data AS data,
        itens_nota.preco AS precoUnit,
        (itens_nota.quantidade * itens_nota.preco) AS total
      FROM itens_nota
      JOIN notas ON itens_nota.nota_id = notas.id
      JOIN produtos ON itens_nota.produto_id = produtos.id
      JOIN fornecedores ON notas.fornecedor_id = fornecedores.id
      ORDER BY notas.data DESC
    `).all();
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
