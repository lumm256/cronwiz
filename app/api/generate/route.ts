import { NextRequest } from "next/server"
import { z } from "zod"
import { CRON_SYSTEM_PROMPT } from "@/lib/prompts/cron-system"
import { openClaudeStream, extractTextDeltas, KieError } from "@/lib/kie"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
// 90s on Pro plan. Streaming keeps the connection alive past Hobby 10s.
export const maxDuration = 90

// ── Input validation ─────────────────────────────────────────────
const generateSchema = z.object({
  input: z
    .string()
    .min(1, "Input is required")
    .max(500, "Input too long (max 500 chars)")
    .transform((s) => s.trim()),
})

// ── Per-IP rate limit ───────────────────────────────────────────
const RATE_LIMIT_PER_MIN = 10
const ipHits = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - 60_000
  const hits = (ipHits.get(ip) || []).filter((t) => t > windowStart)
  if (hits.length >= RATE_LIMIT_PER_MIN) return false
  hits.push(now)
  ipHits.set(ip, hits)
  return true
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Too many requests. Try again in a minute." },
      { status: 429 }
    )
  }

  let parsed: z.infer<typeof generateSchema>
  try {
    const body = await req.json()
    const result = generateSchema.safeParse(body)
    if (!result.success) {
      return Response.json(
        { error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }
    parsed = result.data
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await openClaudeStream(CRON_SYSTEM_PROMPT, parsed.input, {
      maxTokens: 2048,
    })
  } catch (err) {
    if (err instanceof KieError) {
      console.error("[generate] kie.ai open failed:", err.status, err.body)
      return Response.json(
        {
          error:
            err.status === 401
              ? "API key invalid. Contact admin."
              : "Upstream AI service is unavailable. Try again shortly.",
        },
        { status: err.status === 401 ? 500 : 503 }
      )
    }
    console.error("[generate] unexpected:", err)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }

  // ── Transform: parse Anthropic SSE → forward plain text deltas ──
  //
  // Architecture notes:
  //   - Use start() with an internal async loop (NOT pull()) — pull() is gated
  //     by consumer demand and turned out to be ~60x slower in practice on
  //     Next.js's HTTP transport. start() drains upstream eagerly.
  //   - Emit a 1-byte heartbeat (newline) BEFORE the first kie.ai chunk so
  //     Vercel's streaming detection fires within seconds, preventing the
  //     Hobby 10s function-timeout from killing us while kie.ai buffers.
  //   - The leading newline is later stripped by the client's JSON extractor.
  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const reader = upstream.body!.getReader()
      const decoder = new TextDecoder()
      let pendingBuffer = ""

      // Early heartbeat — keeps the Vercel function alive while kie.ai buffers.
      // The leading "\n" is harmless to the client's JSON extractor.
      controller.enqueue(encoder.encode("\n"))

      ;(async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              if (pendingBuffer.trim()) {
                const tail = extractTextDeltas(pendingBuffer.split("\n"))
                for (const t of tail) controller.enqueue(encoder.encode(t))
              }
              controller.close()
              return
            }
            pendingBuffer += decoder.decode(value, { stream: true })
            const lines = pendingBuffer.split("\n")
            pendingBuffer = lines.pop() ?? ""
            const deltas = extractTextDeltas(lines)
            for (const t of deltas) controller.enqueue(encoder.encode(t))
          }
        } catch (err) {
          console.error("[generate] stream error:", err)
          try {
            controller.error(err)
          } catch {
            // controller may already be closed
          }
        }
      })()
    },
    cancel() {
      // upstream cancellation is handled implicitly by the abort signal
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  })
}
