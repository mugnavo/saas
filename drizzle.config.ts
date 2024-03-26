import type { Config } from "drizzle-kit";

export default {
  out: "./.drizzle",
  schema: "./lib/schema.ts",
  breakpoints: true,
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
