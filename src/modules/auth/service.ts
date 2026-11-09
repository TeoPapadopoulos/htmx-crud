import { auth } from "@/lib/auth";
import { copySetCookies } from "@/lib/http";
import type { AuthModel } from "./model";

export abstract class Auth {
  static async signIn(
    headers: Headers,
    body: AuthModel["emailForm"],
  ) {
    return auth.api.signInEmail({
      body,
      headers,
      asResponse: true,
    });
  }

  static async signUp(
    headers: Headers,
    body: AuthModel["signUpForm"],
  ) {
    return auth.api.signUpEmail({
      body,
      headers,
      asResponse: true,
    });
  }

  static async signInGoogle(headers: Headers) {
    return auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: "/notes",
      },
      headers,
      asResponse: true,
    });
  }

  static async signOut(headers: Headers) {
    return auth.api.signOut({
      headers,
      asResponse: true,
    });
  }

  static withAuthCookies(from: Response, extra?: Headers) {
    const headers = extra ? new Headers(extra) : new Headers();
    copySetCookies(from.headers, headers);
    return headers;
  }
}
