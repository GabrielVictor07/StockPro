import ItensNotaModel from '../models/itensNota.model.js';
import ProdutoModel from '../models/produtos.model.js';
import NotasModel from '../models/notas.model.js';

export default {
    listar() {
        return ItensNotaModel.getAll();
    },

    criar(dadosItemNota) {
        // Validações básicas
        if (!dadosItemNota.nota_id) {
            throw new Error('nota_id é obrigatório');
        }

        if (!dadosItemNota.produto_id) {
            throw new Error('produto_id é obrigatório');
        }

        const nota = NotasModel.getById(dadosItemNota.nota_id);
        if (!nota) {
            throw new Error('Nota não encontrada');
        }

        const produto = ProdutoModel.getById(dadosItemNota.produto_id);
        if (!produto) {
            throw new Error('Produto não encontrado');
        }

        // Cria o item da nota
        const resultado = ItensNotaModel.create(dadosItemNota);

        // Atualiza estoque e preço do produto com base no item da nota
        ProdutoModel.aumentarEstoqueEAtualizarPreco(
            dadosItemNota.produto_id,
            dadosItemNota.quantidade,
            dadosItemNota.preco  // último preço de compra
        );

        return resultado;
    }
}