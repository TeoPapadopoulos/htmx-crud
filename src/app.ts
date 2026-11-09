import { cors } from "@elysia/cors";
import { html } from "@elysia/html";
import { fromTypes, openapi } from "@elysia/openapi";
import { staticPlugin } from "@elysia/static";
import { Elysia } from "elysia";
import { env } from "@/env";
import { authPlugin } from "@/lib/auth-plugin";
import { OpenAPI } from "@/lib/openapi";
import { authPages } from "@/modules/auth";
import { health } from "@/modules/health";
import { home } from "@/modules/home";
import { notesPages } from "@/modules/notes";
import { notesApi } from "@/modules/notes/api";

export const app = new Elysia()
  .use(html())
  .use(
    cors({
      origin: env.BETTER_AUTH_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(await staticPlugin())
  .use(
    openapi({
      references: fromTypes("src/app.ts", {
        instanceName: "app",
        silent: true,
      }),
      documentation: {
        info: {
          title: "Folio API",
          version: "0.1.0",
          description:
            "JSON API for Folio. Session cookie auth from Better Auth.",
        },
        tags: [
          { name: "Health", description: "Process and database liveness" },
          { name: "Notes", description: "Per-user notes" },
          { name: "Better Auth", description: "Authentication endpoints" },
        ],
        components: (await OpenAPI.components) as never,
        paths: (await OpenAPI.getPaths()) as never,
      },
      exclude: {
        paths: ["/public", "/public/*"],
      },
    }),
  )
  .use(authPlugin)
  .use(health)
  .use(home)
  .use(authPages)
  .use(notesPages)
  .use(notesApi);

export type App = typeof app;
