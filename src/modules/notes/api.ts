import { Elysia, t } from "elysia";
import { authPlugin } from "@/lib/auth-plugin";
import { NotesModel } from "./model";
import { Notes } from "./service";

export const notesApi = new Elysia({ prefix: "/api/notes" })
  .use(authPlugin)
  .get(
    "/",
    ({ user }) => Notes.list(user.id),
    {
      auth: true,
      response: t.Array(NotesModel.note),
      detail: {
        tags: ["Notes"],
        summary: "List notes",
      },
    },
  )
  .post(
    "/",
    async ({ user, body, status }) =>
      status(201, await Notes.create(user.id, body)),
    {
      auth: true,
      body: NotesModel.createBody,
      response: {
        201: NotesModel.note,
      },
      detail: {
        tags: ["Notes"],
        summary: "Create a note",
      },
    },
  )
  .get(
    "/:id",
    ({ user, params }) => Notes.get(user.id, params.id),
    {
      auth: true,
      params: NotesModel.params,
      response: {
        200: NotesModel.note,
        404: NotesModel.notFound,
      },
      detail: {
        tags: ["Notes"],
        summary: "Get a note",
      },
    },
  )
  .patch(
    "/:id",
    ({ user, params, body }) => Notes.update(user.id, params.id, body),
    {
      auth: true,
      params: NotesModel.params,
      body: NotesModel.updateBody,
      response: {
        200: NotesModel.note,
        404: NotesModel.notFound,
      },
      detail: {
        tags: ["Notes"],
        summary: "Update a note",
      },
    },
  )
  .delete(
    "/:id",
    async ({ user, params }) => {
      await Notes.remove(user.id, params.id);
      return { ok: true as const };
    },
    {
      auth: true,
      params: NotesModel.params,
      response: {
        200: NotesModel.deleted,
        404: NotesModel.notFound,
      },
      detail: {
        tags: ["Notes"],
        summary: "Delete a note",
      },
    },
  );
