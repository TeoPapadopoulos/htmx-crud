import { Html } from "@elysia/html";
import type { AuthUser } from "@/lib/auth";
import { Layout } from "@/ui/layout";

export function HomePage({
  user,
  currentPath,
}: {
  user: AuthUser | null;
  currentPath: string;
}) {
  return (
    <Layout title="Home" user={user} currentPath={currentPath}>
      <section class="max-w-2xl">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-rust">
          Notes, without the chrome
        </p>
        <h1 class="mt-3 font-display text-5xl leading-tight text-ink">
          A small desk for ideas that should not get lost.
        </h1>
        <p class="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
          Sign in, jot something down, come back later. This boilerplate is
          wired for HTMX pages, a JSON API, and auth you can actually grow.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          {user ? (
            <a
              href="/notes"
              class="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
            >
              Open notes
            </a>
          ) : (
            <>
              <a
                href="/login"
                class="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
              >
                Sign in
              </a>
              <a
                href="/signup"
                class="rounded-md border border-rule px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper-raised"
              >
                Create an account
              </a>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
