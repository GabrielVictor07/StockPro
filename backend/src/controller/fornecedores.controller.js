import FornecedoresService from '../services/fornecedores.service.js';

export default {
    listar(req, res) {
        const fornecedores = FornecedoresService.listar();
        res.json(fornecedores);
    },

    criar(req, res) {
        const novo = FornecedoresService.criar(req.body);
        res.status(201).json(novo);
    }
};