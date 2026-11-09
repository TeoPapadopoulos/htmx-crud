import { app } from "@/app";
import { env } from "@/env";

app.listen(env.PORT);

console.log(
  `Folio is running at ${app.server?.hostname}:${app.server?.port}`,
);
