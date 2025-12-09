import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

import produtosRoutes from "./routes/produtos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import fornecedoresRoutes from "./routes/fornecedores.routes.js";
import notasRoutes from "./routes/notas.routes.js";
import itensNotaRoutes from "./routes/itensNota.routes.js";
import saidasRoutes from "./routes/saidas.routes.js";
import entradasRoutes from "./entradas.js";

const app = express();

// Servir frontend estático (index.html, assets)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, '../../frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// LIBERA O FRONT PRA ACESSAR
app.use(cors({
  origin: "*", // ou coloca o domínio exato se quiser travar: "http://127.0.0.1:5500"
}));

app.use(express.json());

// PREFIXO /api IGUAL AO TEU FRONT
app.use("/api/produtos", produtosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/fornecedores", fornecedoresRoutes);
app.use("/api/notas", notasRoutes);
app.use("/api/itensNota", itensNotaRoutes);
app.use("/api/saidas", saidasRoutes);
app.use("/api", entradasRoutes);

// ROTA DO DASHBOARD GERADO COM O TOTAL
app.get("/dashboard", (req, res) => {
  db.get("SELECT COUNT(*) AS total FROM notas", (err, row) => {
    if (err) {
      console.error(err);
      return res.send("Erro ao consultar banco");
    }

    const totalNotas = row.total;

    const dashboardPath = path.resolve("public/dashboard.html");
    let html = fs.readFileSync(dashboardPath, "utf8");

    html = html.replace("{{TOTAL_NOTAS}}", totalNotas);

    res.send(html);
  });
});

app.get("/", (req, res) => {
  res.send("API do sistema de estoque está funcionando.");
});

export default app;
