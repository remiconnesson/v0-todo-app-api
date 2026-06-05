import { db } from "@/lib/db"
import { todos } from "@/lib/db/schema"
import { apiError, json, preflight } from "@/lib/api"
import { desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export function OPTIONS() {
  return preflight()
}

// GET /api/todos -> list all todos
export async function GET() {
  const rows = await db.select().from(todos).orderBy(desc(todos.createdAt))
  return json({ data: rows })
}

// POST /api/todos -> create a todo
// body: { title: string, completed?: boolean }
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiError("Invalid JSON body", 400)
  }

  const { title, completed } = (body ?? {}) as { title?: unknown; completed?: unknown }

  if (typeof title !== "string" || title.trim().length === 0) {
    return apiError("`title` is required and must be a non-empty string", 422)
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    return apiError("`completed` must be a boolean", 422)
  }

  const [created] = await db
    .insert(todos)
    .values({ title: title.trim(), completed: completed ?? false })
    .returning()

  return json({ data: created }, { status: 201 })
}
