import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const driver = postgres(process.env.DATABASE_URL!);

export const db = drizzle(driver, { schema });