export function isHtmxRequest(request: Request): boolean {
  return request.headers.get("HX-Request") === "true";
}

export function redirectResponse(
  request: Request,
  location: string,
  extraHeaders?: Headers,
): Response {
  const headers = new Headers(extraHeaders);

  if (isHtmxRequest(request)) {
    headers.set("HX-Redirect", location);
    return new Response(null, { status: 204, headers });
  }

  headers.set("Location", location);
  return new Response(null, { status: 302, headers });
}

export function copySetCookies(from: Headers, to: Headers): void {
  const cookies =
    typeof from.getSetCookie === "function" ? from.getSetCookie() : [];

  for (const cookie of cookies) {
    to.append("Set-Cookie", cookie);
  }
}

export function authErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "body" in error &&
    error.body &&
    typeof error.body === "object" &&
    "message" in error.body &&
    typeof error.body.message === "string"
  ) {
    return error.body.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
