import { Router } from "express";
import ItensNotaController from "../controller/itensNota.controller.js";

const router = Router();

router.get("/", ItensNotaController.listar);
router.post("/", ItensNotaController.criar);

export default router;