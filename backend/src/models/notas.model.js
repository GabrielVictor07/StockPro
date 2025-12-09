import db from "../database/connection.js";

export default {
    getAll() {
        return db.prepare("SELECT * FROM notas").all();
    },

    getByNumero(numero) {
        return db.prepare("SELECT * FROM notas WHERE numero = ?").get(numero);
    },

    getById(id) {
        return db.prepare("SELECT * FROM notas WHERE id = ?").get(id);
    },

    create({ fornecedor_id, numero, valor_total, data }) {
        return db
        .prepare(
            "INSERT INTO notas (fornecedor_id, numero, valor_total, data) VALUES (?, ?, ?, ?)"
        )
        .run( fornecedor_id, numero, valor_total, data );
    }
}