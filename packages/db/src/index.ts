import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, asc, and } from "drizzle-orm";
import * as schema from "./db/schema";

const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});

export { db, schema, eq, asc, and };
