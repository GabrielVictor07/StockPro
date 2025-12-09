import { Router } from "express";
import FornecedoresController from "../controller/fornecedores.controller.js";

const router = Router();

router.get("/", FornecedoresController.listar);
router.post("/", FornecedoresController.criar);

export default router;