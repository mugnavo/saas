import type { Config } from "drizzle-kit";

export default {
  out: "./.drizzle",
  schema: "./lib/db/schema.ts",
  breakpoints: true,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
