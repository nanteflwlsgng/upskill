import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// On récupère l'URL de la base de données depuis le .env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });