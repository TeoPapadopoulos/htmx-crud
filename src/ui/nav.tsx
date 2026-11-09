import { Html } from "@elysia/html";
import type { AuthUser } from "@/lib/auth";

type NavProps = {
  user: AuthUser | null;
  currentPath: string;
};

function navLink(href: string, label: string, currentPath: string) {
  const active = currentPath === href || currentPath.startsWith(`${href}/`);

  return (
    <a
      href={href}
      class={`rounded-md px-2.5 py-1.5 text-sm tracking-wide transition-colors ${
        active
          ? "bg-ink text-paper"
          : "text-ink/80 hover:bg-ink/5 hover:text-ink"
      }`}
    >
      {label}
    </a>
  );
}

export function Nav({ user, currentPath }: NavProps) {
  return (
    <header class="sticky top-0 z-20 border-b border-rule/80 bg-paper/85 backdrop-blur-md">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <a href="/" class="font-display text-xl text-ink">
          Folio
        </a>
        <nav class="flex flex-wrap items-center gap-1">
          {navLink("/", "Home", currentPath)}
          {user ? navLink("/notes", "Notes", currentPath) : null}
          <a
            href="/openapi"
            class="rounded-md px-2.5 py-1.5 text-sm text-ink/80 hover:bg-ink/5 hover:text-ink"
          >
            API
          </a>
          {user ? (
            <form method="post" action="/logout" class="ml-2">
              <button
                type="submit"
                class="rounded-md px-2.5 py-1.5 text-sm text-ink/70 hover:bg-ink/5 hover:text-ink"
              >
                Sign out
              </button>
            </form>
          ) : (
            <a
              href="/login"
              class="ml-2 rounded-md bg-rust px-3 py-1.5 text-sm font-medium text-paper-raised hover:bg-rust-dark"
            >
              Sign in
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
