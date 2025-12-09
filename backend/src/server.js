import app from "./app.js";

app.listen(3001, "0.0.0.0", () => {
  console.log("Servidor rodando na porta 3001");
  console.log("Acesse em: http://localhost:3001");
});
