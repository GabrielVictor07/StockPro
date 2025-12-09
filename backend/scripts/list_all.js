import db from '../src/database/connection.js';

function print(title, rows) {
  console.log(`\n=== ${title} (${rows.length}) ===`);
  console.table(rows);
}

const fornecedores = db.prepare('SELECT * FROM fornecedores').all();
const categorias = db.prepare('SELECT * FROM categorias').all();
const produtos = db.prepare('SELECT * FROM produtos').all();
const notas = db.prepare('SELECT * FROM notas').all();
const itens = db.prepare('SELECT * FROM itens_nota').all();

print('Fornecedores', fornecedores);
print('Categorias', categorias);
print('Produtos', produtos);
print('Notas', notas);
print('Itens Nota', itens);
