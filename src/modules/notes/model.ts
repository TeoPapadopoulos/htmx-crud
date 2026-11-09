import { t, type UnwrapSchema } from "elysia";

export const NotesModel = {
  createBody: t.Object({
    title: t.String({ minLength: 1, maxLength: 200 }),
    body: t.String({ default: "", maxLength: 10_000 }),
  }),
  updateBody: t.Object({
    title: t.Optional(t.String({ minLength: 1, maxLength: 200 })),
    body: t.Optional(t.String({ maxLength: 10_000 })),
  }),
  params: t.Object({
    id: t.String({ format: "uuid" }),
  }),
  note: t.Object({
    id: t.String(),
    userId: t.String(),
    title: t.String(),
    body: t.String(),
    createdAt: t.String(),
    updatedAt: t.String(),
  }),
  deleted: t.Object({
    ok: t.Literal(true),
  }),
  notFound: t.Literal("Note not found"),
} as const;

export type NotesModel = {
  [K in keyof typeof NotesModel]: UnwrapSchema<(typeof NotesModel)[K]>;
};
