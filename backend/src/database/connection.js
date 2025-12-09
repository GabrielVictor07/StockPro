import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Banco está na MESMA PASTA
const dbPath = path.resolve(__dirname, "database.db");

console.log("Banco conectado em:", dbPath);

const db = new Database(dbPath);

export { dbPath };
export default db;
