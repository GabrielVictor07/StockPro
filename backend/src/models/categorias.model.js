import db from "../database/connection.js";

export default {
    getAll() {
        return db.prepare("SELECT * FROM categorias").all();
    },

    create({ nome }) {
        return db
            .prepare(
                "INSERT INTO categorias (nome) VALUES (?)"
            )
            .run(nome);
    }
}