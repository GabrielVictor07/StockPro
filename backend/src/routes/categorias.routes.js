import { Router } from "express";
import CategoriasController from "../controller/categorias.controller.js";

const router = Router();

router.get("/", CategoriasController.listar);
router.post("/", CategoriasController.criar);

export default router;