import NotasService from '../services/notas.service.js';

export default {
    listar(req,res) {
        const notas = NotasService.listar();
        res.json(notas);
    },

    criar(req,res) {
        try {
            const novo = NotasService.criar(req.body);
            res.status(201).json(novo);
        } catch (err) {
            console.error('Erro ao criar nota:', err);
            res.status(400).json({ error: err.message });
        }
    }
}