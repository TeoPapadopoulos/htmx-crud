import { Html } from "@elysia/html";
import { Elysia } from "elysia";
import { authPlugin } from "@/lib/auth-plugin";
import { NotesModel } from "./model";
import { Notes } from "./service";
import {
  CreateNoteForm,
  NoteCard,
  NoteEditor,
  NotesList,
  NotesPage,
} from "./views";

export const notesPages = new Elysia()
  .use(authPlugin)
  .onError(({ code, set, path }) => {
    if (code !== "VALIDATION") return;
    if (path !== "/notes") return;

    set.status = 400;
    return <CreateNoteForm error="Title is required." />;
  })
  .get(
    "/notes",
    async ({ user, path }) => {
      const notes = await Notes.list(user.id);
      return <NotesPage user={user} currentPath={path} notes={notes} />;
    },
    {
      pageAuth: true,
      detail: { hide: true },
    },
  )
  .post(
    "/notes",
    async ({ user, body, status }) => {
      await Notes.create(user.id, body);
      const notes = await Notes.list(user.id);
      return status(
        201,
        <>
          <NotesList notes={notes} />
          <CreateNoteForm oob />
        </>,
      );
    },
    {
      pageAuth: true,
      body: NotesModel.createBody,
      detail: { hide: true },
    },
  )
  .get(
    "/notes/:id/edit",
    async ({ user, params }) => {
      const note = await Notes.get(user.id, params.id);
      return <NoteEditor note={note} />;
    },
    {
      pageAuth: true,
      params: NotesModel.params,
      detail: { hide: true },
    },
  )
  .get(
    "/notes/:id/card",
    async ({ user, params }) => {
      const note = await Notes.get(user.id, params.id);
      return <NoteCard note={note} />;
    },
    {
      pageAuth: true,
      params: NotesModel.params,
      detail: { hide: true },
    },
  )
  .patch(
    "/notes/:id",
    async ({ user, params, body }) => {
      const note = await Notes.update(user.id, params.id, body);
      return <NoteCard note={note} />;
    },
    {
      pageAuth: true,
      params: NotesModel.params,
      body: NotesModel.updateBody,
      detail: { hide: true },
    },
  )
  .delete(
    "/notes/:id",
    async ({ user, params }) => {
      await Notes.remove(user.id, params.id);
      const notes = await Notes.list(user.id);
      return <NotesList notes={notes} />;
    },
    {
      pageAuth: true,
      params: NotesModel.params,
      detail: { hide: true },
    },
  );
