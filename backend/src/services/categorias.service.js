import CategoriaModel from '../models/categorias.model.js';

export default {
    listar() {
        return CategoriaModel.getAll();
    },

    criar(dadosCategoria) {
        return CategoriaModel.create(dadosCategoria);
    }
}