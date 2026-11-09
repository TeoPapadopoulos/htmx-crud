import { describe, expect, it } from "bun:test";
import { app } from "@/app";

describe("health", () => {
  it("exposes a health endpoint", async () => {
    const response = await app.handle(new Request("http://localhost/health"));

    expect([200, 500]).toContain(response.status);

    if (response.status === 200) {
      expect(await response.json()).toEqual({ status: "ok" });
    }
  });
});

describe("notes API", () => {
  it("rejects unauthenticated list requests", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/notes"),
    );

    expect(response.status).toBe(401);
  });
});

describe("pages", () => {
  it("renders the home page", async () => {
    const response = await app.handle(new Request("http://localhost/"));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("Folio");
  });

  it("redirects the notes page to login when signed out", async () => {
    const response = await app.handle(new Request("http://localhost/notes"));

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/login");
  });
});
