import SaidasService from "../services/saidas.service.js";

export default {
    listar(req,res) {
        const saidas = SaidasService.listar();
        res.json(saidas);
    },

    criar(req,res) {
        const novo = SaidasService.criar(req.body);
        res.status(201).json(novo);
    }
};