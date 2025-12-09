import db from "../database/connection.js";

export default {
    getAll() {
        return db.prepare("SELECT * FROM saidas").all();
    },

    create({ produto_id, quantidade, data_hora }) {
        return db
        .prepare(
            "INSERT INTO saidas (produto_id, quantidade, data_hora) VALUES (?, ?, ?)"
        )
        .run( produto_id, quantidade, data_hora );
    }
}