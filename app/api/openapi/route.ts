import { openapiSpec } from "@/lib/openapi"
import { json, preflight } from "@/lib/api"

export function OPTIONS() {
  return preflight()
}

// GET /api/openapi -> the OpenAPI 3.1 document as JSON
export function GET() {
  return json(openapiSpec)
}
