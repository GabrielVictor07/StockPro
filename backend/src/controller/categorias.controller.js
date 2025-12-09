import CategoriasService from '../services/categorias.service.js';

export default {
    listar(req,res) {
        const categorias = CategoriasService.listar();
        res.json(categorias);
    },

    criar(req,res) {
        const novo = CategoriasService.criar(req.body);
        res.status(201).json(novo);
    }
};