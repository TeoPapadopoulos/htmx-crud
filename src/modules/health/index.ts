import { Elysia, t } from "elysia";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const health = new Elysia({ prefix: "/health" }).get(
  "/",
  async () => {
    await db.execute(sql`select 1`);
    return { status: "ok" as const };
  },
  {
    response: t.Object({
      status: t.Literal("ok"),
    }),
    detail: {
      tags: ["Health"],
      summary: "Health check",
      description: "Pings the database and returns ok when the app is ready.",
    },
  },
);
