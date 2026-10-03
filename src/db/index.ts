import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __pool?: Pool;
  __db?: any;
};

export function getDb() {
  if (!databaseUrl) return null;

  if (!globalForDb.__db) {
    try {
      const pool =
        globalForDb.__pool ??
        new Pool({
          connectionString: databaseUrl,
          connectionTimeoutMillis: 1500,
        });

      if (process.env.NODE_ENV !== "production") {
        globalForDb.__pool = pool;
      }

      globalForDb.__db = drizzle(pool, { schema });
    } catch {
      return null;
    }
  }

  return globalForDb.__db;
}

export const db = getDb();
