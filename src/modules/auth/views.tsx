import { Html } from "@elysia/html";
import { googleEnabled } from "@/env";
import type { AuthUser } from "@/lib/auth";
import { FieldError } from "@/ui/flash";
import { Layout } from "@/ui/layout";

function GoogleButton() {
  if (!googleEnabled) return <></>;

  return (
    <>
      <div class="relative my-6 text-center text-sm text-ink/50">
        <span class="relative z-10 bg-paper-raised px-3">or</span>
        <span class="absolute inset-x-0 top-1/2 h-px bg-rule"></span>
      </div>
      <form method="post" action="/auth/google" hx-boost="false">
        <button
          type="submit"
          class="w-full rounded-md border border-rule bg-paper px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper-raised"
        >
          Continue with Google
        </button>
      </form>
    </>
  );
}

export function SignInForm({ error }: { error?: string }) {
  return (
    <form
      id="auth-form"
      method="post"
      action="/login"
      hx-post="/login"
      hx-target="#auth-form"
      hx-swap="outerHTML"
      class="rounded-xl border border-rule bg-paper-raised p-6 shadow-[0_1px_0_rgba(28,25,23,0.04)]"
    >
      <label class="block text-sm font-medium text-ink">
        Email
        <input
          type="email"
          name="email"
          required
          autocomplete="email"
          class="mt-1.5 w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-rust"
        />
      </label>
      <label class="mt-4 block text-sm font-medium text-ink">
        Password
        <input
          type="password"
          name="password"
          required
          minlength="8"
          autocomplete="current-password"
          class="mt-1.5 w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-rust"
        />
      </label>
      <FieldError message={error} />
      <button
        type="submit"
        class="mt-6 w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
      >
        Sign in
      </button>
      <GoogleButton />
      <p class="mt-5 text-center text-sm text-ink/70">
        No account?{" "}
        <a href="/signup" class="font-medium text-rust hover:text-rust-dark">
          Create one
        </a>
      </p>
    </form>
  );
}

export function SignUpForm({ error }: { error?: string }) {
  return (
    <form
      id="auth-form"
      method="post"
      action="/signup"
      hx-post="/signup"
      hx-target="#auth-form"
      hx-swap="outerHTML"
      class="rounded-xl border border-rule bg-paper-raised p-6 shadow-[0_1px_0_rgba(28,25,23,0.04)]"
    >
      <label class="block text-sm font-medium text-ink">
        Name
        <input
          type="text"
          name="name"
          required
          autocomplete="name"
          class="mt-1.5 w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-rust"
        />
      </label>
      <label class="mt-4 block text-sm font-medium text-ink">
        Email
        <input
          type="email"
          name="email"
          required
          autocomplete="email"
          class="mt-1.5 w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-rust"
        />
      </label>
      <label class="mt-4 block text-sm font-medium text-ink">
        Password
        <input
          type="password"
          name="password"
          required
          minlength="8"
          autocomplete="new-password"
          class="mt-1.5 w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-rust"
        />
      </label>
      <FieldError message={error} />
      <button
        type="submit"
        class="mt-6 w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-ink/90"
      >
        Create account
      </button>
      <GoogleButton />
      <p class="mt-5 text-center text-sm text-ink/70">
        Already registered?{" "}
        <a href="/login" class="font-medium text-rust hover:text-rust-dark">
          Sign in
        </a>
      </p>
    </form>
  );
}

export function LoginPage({
  user,
  currentPath,
  error,
}: {
  user: AuthUser | null;
  currentPath: string;
  error?: string;
}) {
  return (
    <Layout title="Sign in" user={user} currentPath={currentPath}>
      <div class="mx-auto max-w-md">
        <h1 class="font-display text-4xl text-ink">Welcome back</h1>
        <p class="mt-2 mb-6 text-ink/70">Sign in to reach your notes.</p>
        <SignInForm error={error} />
      </div>
    </Layout>
  );
}

export function SignUpPage({
  user,
  currentPath,
  error,
}: {
  user: AuthUser | null;
  currentPath: string;
  error?: string;
}) {
  return (
    <Layout title="Create account" user={user} currentPath={currentPath}>
      <div class="mx-auto max-w-md">
        <h1 class="font-display text-4xl text-ink">Join Folio</h1>
        <p class="mt-2 mb-6 text-ink/70">
          A name, an email, and a password. That is all.
        </p>
        <SignUpForm error={error} />
      </div>
    </Layout>
  );
}
