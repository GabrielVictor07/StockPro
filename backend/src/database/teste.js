import db from "./connection.js";

// Criação das tabelas
db.exec(`
    ALTER TABLE produtos DROP COLUMN ativo;
`);

console.log("Talterado com sucesso!");
process.exit();
