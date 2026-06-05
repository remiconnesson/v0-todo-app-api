import { OpenApiDocs } from "@/components/openapi-docs"

export const metadata = {
  title: "Todos API — OpenAPI",
  description: "OpenAPI reference for the Todos REST API",
}

export default function OpenApiPage() {
  return (
    <main className="min-h-screen bg-background">
      <OpenApiDocs />
    </main>
  )
}
