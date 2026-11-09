import { Html } from "@elysia/html";
import { Elysia } from "elysia";
import { authPlugin } from "@/lib/auth-plugin";
import { HomePage } from "./views";

export const home = new Elysia().use(authPlugin).get(
  "/",
  ({ viewer, path }) => <HomePage user={viewer} currentPath={path} />,
  {
    detail: { hide: true },
  },
);
