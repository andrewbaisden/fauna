import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { withVerifiedTls } from "./src/lib/pg-connection";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: withVerifiedTls(process.env.DIRECT_URL || env("DATABASE_URL")),
  },
});
