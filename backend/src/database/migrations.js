import db from "./connection.js";

// Criação das tabelas
db.exec(`
 CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS fornecedores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT UNIQUE NOT NULL,
  numero TEXT,
  CNPJ TEXT
);

CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  categoria_id INTEGER NOT NULL,
  preco REAL NOT NULL,
  estoque REAL NOT NULL DEFAULT 0,        -- estoque atual (aceita decimais, ex: KG)
  estoque_minimo REAL NOT NULL DEFAULT 0, -- estoque mínimo para aviso (decimais)
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS notas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero TEXT UNIQUE NOT NULL,
  fornecedor_id INTEGER NOT NULL,
  data TEXT NOT NULL,
  valor_total REAL NOT NULL,
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

CREATE TABLE IF NOT EXISTS itens_nota (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nota_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade REAL NOT NULL,
  preco REAL NOT NULL,
  FOREIGN KEY (nota_id) REFERENCES notas(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS alertas_estoque (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  estoque_atual INTEGER NOT NULL,
  estoque_minimo REAL NOT NULL,
  data_hora TEXT NOT NULL DEFAULT (datetime('now')),
  lido INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS saidas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER NOT NULL,
  quantidade REAL NOT NULL,
  data_hora TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TRIGGER IF NOT EXISTS trg_alerta_estoque_update
AFTER UPDATE OF estoque ON produtos
WHEN NEW.estoque <= NEW.estoque_minimo
BEGIN
  INSERT INTO alertas_estoque (produto_id, estoque_atual, estoque_minimo)
  VALUES (NEW.id, NEW.estoque, NEW.estoque_minimo);
END;

CREATE TRIGGER IF NOT EXISTS trg_add_item_nota
AFTER INSERT ON itens_nota
BEGIN
  UPDATE produtos
  SET estoque = estoque + NEW.quantidade
  WHERE id = NEW.produto_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_update_item_nota
AFTER UPDATE OF quantidade ON itens_nota
BEGIN
  UPDATE produtos
  SET estoque = estoque + (NEW.quantidade - OLD.quantidade)
  WHERE id = NEW.produto_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_delete_item_nota
AFTER DELETE ON itens_nota
BEGIN
  UPDATE produtos
  SET estoque = estoque - OLD.quantidade
  WHERE id = OLD.produto_id;
END;

SELECT 
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
WHERE strftime('%m', notas.data) = strftime('%m', 'now')
  AND strftime('%Y', notas.data) = strftime('%Y', 'now')
ORDER BY notas.data DESC;

`);

console.log("Tabelas criadas com sucesso!");
process.exit();
