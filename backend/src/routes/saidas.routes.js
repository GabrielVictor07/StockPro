import { Router } from "express";
import SaidasController from "../controller/saidas.controller.js";

const router = Router();

router.get("/", SaidasController.listar);
router.post("/", SaidasController.criar);

export default router;