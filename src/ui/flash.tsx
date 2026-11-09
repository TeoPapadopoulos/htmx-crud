import { Html } from "@elysia/html";

export function FieldError({ message }: { message?: string }) {
  if (!message) return <></>;

  return (
    <p class="mt-2 text-sm text-rust" role="alert">
      {message}
    </p>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div class="rounded-xl border border-dashed border-rule bg-paper-raised px-6 py-12 text-center">
      <h2 class="font-display text-2xl text-ink">{title}</h2>
      <p class="mt-2 text-ink/70">{body}</p>
    </div>
  );
}
