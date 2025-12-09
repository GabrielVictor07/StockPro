import { Router } from "express";
import NotasController from "../controller/notas.controller.js";

const router = Router();

router.get("/", NotasController.listar);
router.post("/", NotasController.criar);

export default router;