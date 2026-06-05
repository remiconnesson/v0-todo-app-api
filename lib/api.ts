import { NextResponse } from "next/server"

// Shared CORS headers so any client can consume the API.
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: { ...corsHeaders, ...(init?.headers ?? {}) },
  })
}

export function apiError(message: string, status: number, details?: unknown) {
  return json({ error: message, ...(details ? { details } : {}) }, { status })
}

export function preflight() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
