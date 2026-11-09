import { Html } from "@elysia/html";
import { Elysia } from "elysia";
import { googleEnabled } from "@/env";
import { authPlugin } from "@/lib/auth-plugin";
import { isHtmxRequest, redirectResponse } from "@/lib/http";
import { AuthModel } from "./model";
import { Auth } from "./service";
import { LoginPage, SignInForm, SignUpForm, SignUpPage } from "./views";

async function readAuthError(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { message?: string };
    if (data.message) return data.message;
  } catch {
    // Better Auth may return an empty body on some failures.
  }

  return fallback;
}

export const authPages = new Elysia()
  .use(authPlugin)
  .onError(({ code, path, set }) => {
    if (code !== "VALIDATION") return;

    set.status = 400;
    const message = "Please check the form and try again.";

    if (path.startsWith("/signup")) {
      return <SignUpForm error={message} />;
    }

    return <SignInForm error={message} />;
  })
  .get(
    "/login",
    ({ viewer, path, redirect }) => {
      if (viewer) return redirect("/notes");

      return <LoginPage user={viewer} currentPath={path} />;
    },
    { detail: { hide: true } },
  )
  .post(
    "/login",
    async ({ body, request, set, viewer, path }) => {
      const response = await Auth.signIn(request.headers, body);

      if (!response.ok) {
        set.status = 400;
        const error = await readAuthError(
          response,
          "Invalid email or password",
        );

        if (isHtmxRequest(request)) {
          return <SignInForm error={error} />;
        }

        return <LoginPage user={viewer} currentPath={path} error={error} />;
      }

      return redirectResponse(
        request,
        "/notes",
        Auth.withAuthCookies(response),
      );
    },
    {
      body: AuthModel.emailForm,
      detail: { hide: true },
    },
  )
  .get(
    "/signup",
    ({ viewer, path, redirect }) => {
      if (viewer) return redirect("/notes");

      return <SignUpPage user={viewer} currentPath={path} />;
    },
    { detail: { hide: true } },
  )
  .post(
    "/signup",
    async ({ body, request, set, viewer, path }) => {
      const response = await Auth.signUp(request.headers, body);

      if (!response.ok) {
        set.status = 400;
        const error = await readAuthError(
          response,
          "Could not create that account",
        );

        if (isHtmxRequest(request)) {
          return <SignUpForm error={error} />;
        }

        return <SignUpPage user={viewer} currentPath={path} error={error} />;
      }

      return redirectResponse(
        request,
        "/notes",
        Auth.withAuthCookies(response),
      );
    },
    {
      body: AuthModel.signUpForm,
      detail: { hide: true },
    },
  )
  .post(
    "/auth/google",
    async ({ request, status }) => {
      if (!googleEnabled) {
        return status(404, "Google sign-in is not configured");
      }

      return Auth.signInGoogle(request.headers);
    },
    { detail: { hide: true } },
  )
  .post(
    "/logout",
    async ({ request }) => {
      const response = await Auth.signOut(request.headers);
      return redirectResponse(request, "/", Auth.withAuthCookies(response));
    },
    { detail: { hide: true } },
  );
