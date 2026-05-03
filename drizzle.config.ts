import type { Config } from "drizzle-kit";

const url = process.env.TURSO_DATABASE_URL!;
const isLocal = url?.startsWith("file:");

export default (isLocal
  ? {
      schema: "./src/lib/db/schema.ts",
      out: "./drizzle",
      dialect: "sqlite",
      dbCredentials: { url },
    }
  : {
      schema: "./src/lib/db/schema.ts",
      out: "./drizzle",
      dialect: "turso",
      dbCredentials: { url, authToken: process.env.TURSO_AUTH_TOKEN! },
    }) satisfies Config;
