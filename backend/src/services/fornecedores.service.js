import FornecedorModel from '../models/fornecedores.model.js';

export default {
    listar() {
        return FornecedorModel.getAll();
    },

    criar(dadosFornecedor) {
        return FornecedorModel.create(dadosFornecedor);
    }
}