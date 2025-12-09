import { Router } from "express";
import ProdutosController from "../controller/produtos.controller.js";

const router = Router();

router.get("/", ProdutosController.listar);
router.post("/", ProdutosController.criar);
router.put("/:id", (req, res) => {
  req.body.id = req.params.id;
  ProdutosController.atualizar(req, res);
});

export default router;
