import db from "../database/connection.js";

export default {
    getAll() {
        return db.prepare("SELECT * FROM itens_nota").all();
    },

    create({ produto_id, quantidade, preco, nota_id }){
        return db
        .prepare(
            "INSERT INTO itens_nota (produto_id, quantidade, preco, nota_id) VALUES (?, ?, ?, ?)"
        )
        .run(  produto_id, quantidade, preco, nota_id );
    }
}