import db from "../database/connection.js";

export default {
    getAll() {
        return db.prepare("SELECT * FROM fornecedores").all();
    },
    
    getById(id) {
        return db.prepare("SELECT * FROM fornecedores WHERE id = ?").get(id);
    },

    create({ nome, numero, cnpj }) {
        return db
            .prepare(
                "INSERT INTO fornecedores (nome, numero, cnpj) VALUES (?, ?, ?)"
            )
            .run(nome, numero, cnpj);
    }
}