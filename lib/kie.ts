/**
 * kie.ai — third-party Claude-compatible API proxy.
 *
 * Why direct fetch instead of @anthropic-ai/sdk:
 *   kie.ai auth uses `Authorization: Bearer <key>`, not Anthropic's `x-api-key`.
 *   The official SDK hard-codes the x-api-key header, so we'd have to monkey-patch.
 *   A 30-line fetch wrapper is cleaner and easier to debug.
 *
 * Docs: https://docs.kie.ai/market/claude/claude-sonnet-4-6.md
 */

export const KIE_API_KEY = process.env.KIE_API_KEY || ""
export const KIE_BASE_URL = "https://api.kie.ai/claude/v1"
export const KIE_MODEL = "claude-sonnet-4-6"

export interface KieMessage {
  role: "user" | "assistant"
  content: string
}

export interface KieRequest {
  model?: string
  system?: string
  messages: KieMessage[]
  max_tokens?: number
  stream?: boolean
}

export interface KieResponse {
  id: string
  role: "assistant"
  model: string
  content: Array<{ type: "text"; text: string } | { type: string; [k: string]: unknown }>
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
  credits_consumed?: number
}

export class KieError extends Error {
  constructor(message: string, public status?: number, public body?: unknown) {
    super(message)
    this.name = "KieError"
  }
}

/**
 * Open a streaming Claude request via kie.ai.
 * Returns the raw upstream Response so the caller can transform the SSE stream.
 */
export async function openClaudeStream(
  system: string,
  userMessage: string,
  opts: { maxTokens?: number } = {}
): Promise<Response> {
  if (!KIE_API_KEY) {
    throw new KieError("KIE_API_KEY is not set in environment")
  }

  const res = await fetch(`${KIE_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KIE_API_KEY}`,
    },
    body: JSON.stringify({
      model: KIE_MODEL,
      system,
      messages: [{ role: "user", content: userMessage }],
      max_tokens: opts.maxTokens ?? 2048,
      stream: true,
    } satisfies KieRequest),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new KieError(
      `kie.ai returned ${res.status}`,
      res.status,
      body.slice(0, 500)
    )
  }
  if (!res.body) {
    throw new KieError("kie.ai returned empty body")
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
