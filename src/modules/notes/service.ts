import { and, desc, eq } from "drizzle-orm";
import { status } from "elysia";
import { db } from "@/db";
import { notes } from "@/db/schema";
import type { NotesModel } from "./model";

function toDto(note: typeof notes.$inferSelect): NotesModel["note"] {
  return {
    id: note.id,
    userId: note.userId,
    title: note.title,
    body: note.body,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export abstract class Notes {
  static async list(userId: string): Promise<NotesModel["note"][]> {
    const rows = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));

    return rows.map(toDto);
  }

  static async get(userId: string, id: string): Promise<NotesModel["note"]> {
    const [note] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .limit(1);

    if (!note) {
      throw status(404, "Note not found");
    }

    return toDto(note);
  }

  static async create(
    userId: string,
    input: NotesModel["createBody"],
  ): Promise<NotesModel["note"]> {
    const [note] = await db
      .insert(notes)
      .values({
        userId,
        title: input.title.trim(),
        body: input.body.trim(),
      })
      .returning();

    if (!note) {
      throw status(500, "Could not create note");
    }

    return toDto(note);
  }

  static async update(
    userId: string,
    id: string,
    input: NotesModel["updateBody"],
  ): Promise<NotesModel["note"]> {
    const patch: Partial<typeof notes.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (input.title !== undefined) patch.title = input.title.trim();
    if (input.body !== undefined) patch.body = input.body.trim();

    const [note] = await db
      .update(notes)
      .set(patch)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();

    if (!note) {
      throw status(404, "Note not found");
    }

    return toDto(note);
  }

  static async remove(userId: string, id: string): Promise<void> {
    const deleted = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning({ id: notes.id });

    if (deleted.length === 0) {
      throw status(404, "Note not found");
    }
  }
}
