import NotasModel from '../models/notas.model.js';
import FornecedorModel from '../models/fornecedores.model.js';


export default {
    listar() {
        return NotasModel.getAll();
    },

    criar(dadosNotas) {
        // validações básicas
        if (!dadosNotas.fornecedor_id) {
            throw new Error('fornecedor_id é obrigatório');
        }

        const fornecedor = FornecedorModel.getById(dadosNotas.fornecedor_id);
        if (!fornecedor) {
            throw new Error('Fornecedor não encontrado');
        }

        if (!dadosNotas.numero) {
            throw new Error('numero da nota é obrigatório');
        }

        const existe = NotasModel.getByNumero(dadosNotas.numero);
        if (existe) {
            throw new Error('Número de nota já cadastrado');
        }

        return NotasModel.create(dadosNotas);
    }
}