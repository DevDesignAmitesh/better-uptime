import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "./db/schema.js";

const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});

export { db, schema, eq };
