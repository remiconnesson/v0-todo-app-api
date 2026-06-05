import { db } from "@/lib/db"
import { todos } from "@/lib/db/schema"
import { apiError, json, preflight } from "@/lib/api"
import { eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

export function OPTIONS() {
  return preflight()
}

function parseId(raw: string) {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

// GET /api/todos/:id -> single todo
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params
  const id = parseId(raw)
  if (id === null) return apiError("Invalid id", 400)

  const [row] = await db.select().from(todos).where(eq(todos.id, id))
  if (!row) return apiError("Todo not found", 404)
  return json({ data: row })
}

// PATCH /api/todos/:id -> partial update
// body: { title?: string, completed?: boolean }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params
  const id = parseId(raw)
  if (id === null) return apiError("Invalid id", 400)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiError("Invalid JSON body", 400)
  }

  const { title, completed } = (body ?? {}) as { title?: unknown; completed?: unknown }
  const updates: { title?: string; completed?: boolean; updatedAt: Date } = { updatedAt: new Date() }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return apiError("`title` must be a non-empty string", 422)
    }
    updates.title = title.trim()
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return apiError("`completed` must be a boolean", 422)
    }
    updates.completed = completed
  }

  if (updates.title === undefined && updates.completed === undefined) {
    return apiError("Provide at least one of `title` or `completed`", 422)
  }

  const [updated] = await db.update(todos).set(updates).where(eq(todos.id, id)).returning()
  if (!updated) return apiError("Todo not found", 404)
  return json({ data: updated })
}

// DELETE /api/todos/:id
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params
  const id = parseId(raw)
  if (id === null) return apiError("Invalid id", 400)

  const [deleted] = await db.delete(todos).where(eq(todos.id, id)).returning()
  if (!deleted) return apiError("Todo not found", 404)
  return json({ data: deleted })
}
