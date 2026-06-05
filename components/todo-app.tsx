"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { Trash2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type Todo = {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

const KEY = "/api/todos"

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to load todos")
    return r.json() as Promise<{ data: Todo[] }>
  })

export function TodoApp() {
  const { data, isLoading, error } = useSWR(KEY, fetcher)
  const [title, setTitle] = useState("")
  const [adding, setAdding] = useState(false)

  const todos = data?.data ?? []
  const remaining = todos.filter((t) => !t.completed).length

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    setAdding(true)
    try {
      await fetch(KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value }),
      })
      setTitle("")
      mutate(KEY)
    } finally {
      setAdding(false)
    }
  }

  async function toggle(todo: Todo) {
    await fetch(`${KEY}/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    })
    mutate(KEY)
  }

  async function remove(id: number) {
    await fetch(`${KEY}/${id}`, { method: "DELETE" })
    mutate(KEY)
  }

  return (
    <div className="w-full max-w-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Todos</h1>
        <p className="text-sm text-muted-foreground">
          {remaining} {remaining === 1 ? "task" : "tasks"} left
        </p>
      </header>

      <form onSubmit={addTodo} className="mb-6 flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          aria-label="New todo title"
        />
        <Button type="submit" disabled={adding || !title.trim()}>
          {adding ? <Loader2 className="size-4 animate-spin" /> : "Add"}
        </Button>
      </form>

      {error ? (
        <p className="text-sm text-destructive">Could not load todos.</p>
      ) : isLoading ? (
        <div className="flex justify-center py-8 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : todos.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No todos yet. Add one above.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggle(todo)}
                aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
              />
              <span
                className={cn(
                  "flex-1 text-sm",
                  todo.completed && "text-muted-foreground line-through",
                )}
              >
                {todo.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(todo.id)}
                aria-label={`Delete "${todo.title}"`}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
