import ItensNotaService from '../services/itensNota.service.js';

export default {
    listar(req, res) {
        const itensNota = ItensNotaService.listar();
        res.json(itensNota);
    },

    criar(req, res) {
        try {
            const novo = ItensNotaService.criar(req.body);
            res.status(201).json(novo);
        } catch (err) {
            console.error('Erro ao criar item da nota:', err);
            res.status(400).json({ error: err.message });
        }
    }
}