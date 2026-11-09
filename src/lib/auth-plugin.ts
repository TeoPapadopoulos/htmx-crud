import { Elysia } from "elysia";
import { auth, type AuthSession, type AuthUser } from "./auth";

export const authPlugin = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .derive({ as: "global" }, async ({ request }) => {
    const result = await auth.api.getSession({
      headers: request.headers,
    });

    return {
      viewer: (result?.user ?? null) as AuthUser | null,
      viewerSession: (result?.session ?? null) as AuthSession["session"] | null,
    };
  })
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) return status(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
    pageAuth: {
      async resolve({ set, status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) {
          set.headers["Location"] = "/login";
          return status(302);
        }

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
