import { openapiSpec } from "@/lib/openapi"

type Operation = {
  summary?: string
  description?: string
  operationId?: string
  tags?: string[]
}

const METHOD_STYLES: Record<string, string> = {
  get: "bg-sky-100 text-sky-700 border-sky-200",
  post: "bg-emerald-100 text-emerald-700 border-emerald-200",
  patch: "bg-amber-100 text-amber-700 border-amber-200",
  delete: "bg-red-100 text-red-700 border-red-200",
  options: "bg-muted text-muted-foreground border-border",
}

const HTTP_METHODS = ["get", "post", "patch", "delete", "options"] as const

function MethodBadge({ method }: { method: string }) {
  const style = METHOD_STYLES[method] ?? METHOD_STYLES.options
  return (
    <span
      className={`inline-flex min-w-16 justify-center rounded-md border px-2 py-1 font-mono text-xs font-semibold uppercase ${style}`}
    >
      {method}
    </span>
  )
}

export function OpenApiDocs() {
  const { info, paths } = openapiSpec
  const schemas = openapiSpec.components.schemas

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-3 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-pretty text-3xl font-bold tracking-tight">{info.title}</h1>
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
            v{info.version}
          </span>
        </div>
        <p className="text-pretty leading-relaxed text-muted-foreground">{info.description}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="/api/openapi"
            className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            View raw OpenAPI JSON
          </a>
          <a
            href="/"
            className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Back to app
          </a>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Endpoints</h2>
        {Object.entries(paths).map(([path, item]) => (
          <div key={path} className="flex flex-col gap-3">
            {HTTP_METHODS.filter((m) => m in item).map((method) => {
              const op = (item as Record<string, Operation>)[method]
              return (
                <article
                  key={`${path}-${method}`}
                  className="rounded-lg border border-border bg-card p-4 text-card-foreground"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <MethodBadge method={method} />
                    <code className="font-mono text-sm font-medium">{path}</code>
                  </div>
                  {op.summary ? <p className="mt-2 text-sm font-medium">{op.summary}</p> : null}
                  {op.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{op.description}</p>
                  ) : null}
                </article>
              )
            })}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Schemas</h2>
        {Object.entries(schemas).map(([name, schema]) => (
          <article key={name} className="rounded-lg border border-border bg-card p-4 text-card-foreground">
            <h3 className="font-mono text-sm font-semibold">{name}</h3>
            <pre className="mt-3 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed text-muted-foreground">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </article>
        ))}
      </section>
    </div>
  )
}
