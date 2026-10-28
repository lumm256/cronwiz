/**
 * AICodeWith — Claude via the native Anthropic Messages protocol.
 *
 * Why direct fetch instead of @anthropic-ai/sdk:
 *   We only need one streaming call and the SSE parsing below; a small fetch
 *   wrapper keeps the dependency surface and bundle small.
 *
 * Docs: https://docs.aicodewith.ai/en/docs/developer-messages
 *   - Base URL https://api.aicodewith.ai (Messages lives at /v1/messages)
 *   - Auth: `x-api-key` + `anthropic-version`, NOT `Authorization: Bearer`
 *   - Model ids must match the model list exactly, or the API returns 400.
 */

export const LLM_API_KEY = process.env.AICODEWITH_API_KEY || ""
export const LLM_BASE_URL = "https://api.aicodewith.ai"
// Override with AICODEWITH_MODEL env var to switch models without a code change.
export const LLM_MODEL = process.env.AICODEWITH_MODEL || "claude-sonnet-4-6"

export interface LlmMessage {
  role: "user" | "assistant"
  content: string
}

export interface LlmRequest {
  model?: string
  system?: string
  messages: LlmMessage[]
  max_tokens?: number
  stream?: boolean
}

export interface LlmResponse {
  id: string
  role: "assistant"
  model: string
  content: Array<{ type: "text"; text: string } | { type: string; [k: string]: unknown }>
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export class LlmError extends Error {
  constructor(message: string, public status?: number, public body?: unknown) {
    super(message)
    this.name = "LlmError"
  }
}

/**
 * Open a streaming Claude request via AICodeWith.
 * Returns the raw upstream Response so the caller can transform the SSE stream.
 */
export async function openClaudeStream(
  system: string,
  userMessage: string,
  opts: { maxTokens?: number } = {}
): Promise<Response> {
  if (!LLM_API_KEY) {
    throw new LlmError("AICODEWITH_API_KEY is not set in environment")
  }

  const res = await fetch(`${LLM_BASE_URL}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": LLM_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      system,
      messages: [{ role: "user", content: userMessage }],
      max_tokens: opts.maxTokens ?? 2048,
      stream: true,
    } satisfies LlmRequest),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new LlmError(
      `AICodeWith returned ${res.status}`,
      res.status,
      body.slice(0, 500)
    )
  }
  if (!res.body) {
    throw new LlmError("AICodeWith returned empty body")
  }

  return res
}

/**
 * Parse Anthropic-style SSE chunk into text deltas.
 * Returns array of text strings (may be empty).
 */
export function extractTextDeltas(sseLines: string[]): string[] {
  const deltas: string[] = []
  for (const line of sseLines) {
    if (!line.startsWith("data: ")) continue
    const payload = line.slice(6).trim()
    if (!payload || payload === "[DONE]") continue
    try {
      const evt = JSON.parse(payload)
      if (
        evt.type === "content_block_delta" &&
        evt.delta?.type === "text_delta" &&
        typeof evt.delta.text === "string"
      ) {
        deltas.push(evt.delta.text)
      }
    } catch {
      // ignore malformed SSE chunks
    }
  }
  return deltas
}
