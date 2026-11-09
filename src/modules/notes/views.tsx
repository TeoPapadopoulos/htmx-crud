import { Html } from "@elysia/html";
import type { AuthUser } from "@/lib/auth";
import { EmptyState, FieldError } from "@/ui/flash";
import { Layout } from "@/ui/layout";
import type { NotesModel } from "./model";

export function NoteCard({ note }: { note: NotesModel["note"] }) {
  return (
    <article
      id={`note-${note.id}`}
      class="rounded-xl border border-rule bg-paper-raised p-5"
    >
      <div class="flex items-start justify-between gap-4">
        <h2 class="font-display text-2xl text-ink" safe>
          {note.title}
        </h2>
        <div class="flex shrink-0 gap-2">
          <button
            type="button"
            hx-get={`/notes/${note.id}/edit`}
            hx-target={`#note-${note.id}`}
            hx-swap="outerMorph"
            class="rounded-md px-2 py-1 text-sm text-ink/70 hover:bg-ink/5 hover:text-ink"
          >
            Edit
          </button>
          <button
            type="button"
            hx-delete={`/notes/${note.id}`}
            hx-target="#notes-list"
            hx-swap="outerHTML"
            hx-confirm="Delete this note?"
            class="rounded-md px-2 py-1 text-sm text-rust/80 hover:bg-rust/10 hover:text-rust"
          >
            Delete
          </button>
        </div>
      </div>
      <p class="mt-3 whitespace-pre-wrap text-ink/80" safe>
        {note.body || "No body yet."}
      </p>
      <p class="mt-4 text-xs uppercase tracking-wide text-ink/45">
        Updated {new Date(note.updatedAt).toLocaleString()}
      </p>
    </article>
  );
}

export function NoteEditor({
  note,
  error,
}: {
  note: NotesModel["note"];
  error?: string;
}) {
  return (
    <article
      id={`note-${note.id}`}
      class="rounded-xl border border-rust/30 bg-paper-raised p-5"
    >
      <form
        hx-patch={`/notes/${note.id}`}
        hx-target="closest article"
        hx-swap="outerMorph"
        class="grid gap-3"
      >
        <input
          type="text"
          name="title"
          value={note.title}
          required
          class="w-full rounded-md border border-rule bg-paper px-3 py-2 font-display text-xl text-ink outline-none focus:border-rust"
        />
        <textarea
          name="body"
          rows="6"
          class="w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-rust"
          safe
        >
          {note.body}
        </textarea>
        <FieldError message={error} />
        <div class="flex gap-2">
          <button
            type="submit"
            class="rounded-md bg-ink px-3 py-2 text-sm font-medium text-paper hover:bg-ink/90"
          >
            Save
          </button>
          <button
            type="button"
            hx-get={`/notes/${note.id}/card`}
            hx-target="closest article"
            hx-swap="outerMorph"
            class="rounded-md px-3 py-2 text-sm text-ink/70 hover:bg-ink/5"
          >
            Cancel
          </button>
        </div>
      </form>
    </article>
  );
}

export function CreateNoteForm({
  error,
  oob = false,
}: {
  error?: string;
  oob?: boolean;
}) {
  return (
    <form
      id="create-note"
      hx-post="/notes"
      hx-target="#notes-list"
      hx-swap="outerHTML"
      hx-swap-oob={oob ? "true" : undefined}
      {...{
        "hx-status:400": "target:#create-note swap:outerHTML",
        "hx-status:422": "target:#create-note swap:outerHTML",
      }}
      class="rounded-xl border border-rule bg-paper-raised p-5"
    >
      <h2 class="font-display text-2xl text-ink">New note</h2>
      <label class="mt-4 block text-sm font-medium text-ink">
        Title
        <input
          type="text"
          name="title"
          required
          maxlength="200"
          class="mt-1.5 w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-rust"
        />
      </label>
      <label class="mt-4 block text-sm font-medium text-ink">
        Body
        <textarea
          name="body"
          rows="4"
          maxlength="10000"
          class="mt-1.5 w-full rounded-md border border-rule bg-paper px-3 py-2 text-ink outline-none focus:border-rust"
        ></textarea>
      </label>
      <FieldError message={error} />
      <button
        type="submit"
        class="mt-4 rounded-md bg-rust px-4 py-2 text-sm font-medium text-paper-raised hover:bg-rust-dark"
      >
        Add note
      </button>
    </form>
  );
}

export function NotesList({ notes }: { notes: NotesModel["note"][] }) {
  if (notes.length === 0) {
    return (
      <div id="notes-list" class="grid gap-4">
        <EmptyState
          title="Nothing on the desk yet"
          body="Write a title and a few lines. It will show up here."
        />
      </div>
    );
  }

  return (
    <div id="notes-list" class="grid gap-4">
      {notes.map((note) => (
        <NoteCard note={note} />
      ))}
    </div>
  );
}

export function NotesPage({
  user,
  currentPath,
  notes,
}: {
  user: AuthUser;
  currentPath: string;
  notes: NotesModel["note"][];
}) {
  return (
    <Layout title="Notes" user={user} currentPath={currentPath}>
      <div class="mb-8">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-rust">
          Private
        </p>
        <h1 class="mt-2 font-display text-4xl text-ink">Your notes</h1>
      </div>
      <div class="grid gap-8 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <CreateNoteForm />
        <NotesList notes={notes} />
      </div>
    </Layout>
  );
}
