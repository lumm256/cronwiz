"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  AlertTriangle,
  Zap,
  Terminal,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CronAnalysis, CronExpression, Platform } from "@/lib/types"
import { PLATFORM_LABELS } from "@/lib/types"

/** Defensive JSON extraction — model output should be pure JSON but be safe. */
function extractAnalysis(raw: string): CronAnalysis | null {
  const trimmed = raw.trim()
  let jsonStr: string | null = null
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    jsonStr = trimmed
  } else {
    const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (fence) {
      jsonStr = fence[1].trim()
    } else {
      const first = trimmed.indexOf("{")
      const last = trimmed.lastIndexOf("}")
      if (first >= 0 && last > first) {
        jsonStr = trimmed.slice(first, last + 1)
      }
    }
  }
  if (!jsonStr) return null
  try {
    return JSON.parse(jsonStr) as CronAnalysis
  } catch {
    return null
  }
}

export function CronTool() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamedChars, setStreamedChars] = useState(0)
  const [analysis, setAnalysis] = useState<CronAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "linux",
    "aws",
    "kubernetes",
    "github_actions",
  ])

  const handleGenerate = async () => {
    const trimmed = input.trim()
    if (!trimmed || isGenerating) return

    setIsGenerating(true)
    setError(null)
    setAnalysis(null)
    setStreamedChars(0)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed }),
      })

      // Error responses come back as JSON, not a stream
      const contentType = res.headers.get("content-type") || ""
      if (!res.ok || contentType.includes("application/json")) {
        const errBody = await res.json().catch(() => ({ error: "Unknown error" }))
        setError(errBody.error || `Request failed (${res.status})`)
        return
      }
      if (!res.body) {
        setError("No response from server")
        return
      }

      // Stream consume
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setStreamedChars(accumulated.length)
      }

      const parsed = extractAnalysis(accumulated)
      if (!parsed) {
        setError("AI returned malformed output. Please try again.")
        return
      }
      setAnalysis(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const togglePlatform = (id: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  // All platforms shown in the chip row (regardless of analysis)
  const allPlatforms: Platform[] = [
    "linux",
    "aws",
    "kubernetes",
    "github_actions",
    "vercel",
    "quartz",
    "cloudflare_workers",
  ]

  const visibleExpressions: CronExpression[] = (analysis?.expressions || []).filter(
    (e) => selectedPlatforms.includes(e.platform)
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <Terminal className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="every weekday at 9am pacific time"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-mono"
            disabled={isGenerating}
            maxLength={500}
          />
          <Button
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            size="sm"
            className="shrink-0"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" />
                Thinking…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Platform filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allPlatforms.map((p) => (
          <button
            key={p}
            onClick={() => togglePlatform(p)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md border transition-all",
              selectedPlatforms.includes(p)
                ? "bg-primary/10 border-primary/50 text-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {PLATFORM_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Loading hint while streaming */}
      {isGenerating && (
        <div className="text-center py-8 text-muted-foreground">
          <Sparkles className="w-6 h-6 mx-auto mb-3 animate-pulse text-primary" />
          <p className="text-sm">
            Generating cron expressions across {selectedPlatforms.length}{" "}
            platforms…
          </p>
          {streamedChars > 0 && (
            <p className="text-xs mt-1 opacity-60 font-mono">
              {streamedChars} chars streamed
            </p>
          )}
          <p className="text-xs mt-2 opacity-60">
            Typically 15–40 seconds. AI is checking platform quirks, DST, plan
            limits.
          </p>
        </div>
      )}

      {/* Error */}
      {error && !isGenerating && (
        <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-destructive font-medium">Something went wrong</p>
            <p className="text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Validation errors (e.g., hour 25) */}
      {analysis && !analysis.is_valid && (
        <div className="mb-6 px-4 py-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <div className="flex items-center gap-2 text-destructive font-medium mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Invalid schedule</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 mb-3">
            {analysis.validation_errors.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
          </ul>
          {analysis.did_you_mean?.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground mb-2 mt-3">
                Did you mean:
              </p>
              <div className="space-y-2">
                {analysis.did_you_mean.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s.expression)}
                    className="w-full text-left px-3 py-2 bg-card border border-border rounded-md hover:border-primary/30 transition-colors"
                  >
                    <div className="text-sm text-foreground">{s.label}</div>
                    <code className="text-xs text-primary font-mono">
                      {s.expression}
                    </code>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Impossible-for-cron */}
      {analysis &&
        analysis.is_valid &&
        analysis.is_impossible_for_cron &&
        analysis.impossibility_reason && (
          <div className="mb-6 px-4 py-4 bg-warning/10 border border-warning/30 rounded-lg">
            <div className="flex items-center gap-2 text-warning font-medium mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Cron cannot natively express this</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {analysis.impossibility_reason}
            </p>
          </div>
        )}

      {/* Intent summary */}
      {analysis && analysis.is_valid && analysis.intent_summary && (
        <div className="mb-4 px-4 py-3 bg-card/40 border border-border/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Intent:</span>{" "}
            {analysis.intent_summary}
          </p>
        </div>
      )}

      {/* Expression cards */}
      {analysis && visibleExpressions.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleExpressions.map((expr, index) => {
            const id = `${expr.platform}-${index}`
            const codeToCopy = [...(expr.extra_lines || []), expr.code]
              .filter(Boolean)
              .join("\n")
            const hasWarning =
              expr.platform_specific_warnings?.length > 0 ||
              expr.support_status === "workaround" ||
              expr.support_status === "unsupported"

            return (
              <div
                key={id}
                className="group relative bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    {PLATFORM_LABELS[expr.platform]}
                  </span>
                  {hasWarning && (
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs",
                        expr.support_status === "unsupported"
                          ? "text-destructive"
                          : "text-warning"
                      )}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {expr.support_status === "unsupported"
                        ? "Unsupported"
                        : expr.support_status === "workaround"
                          ? "Workaround"
                          : "Heads up"}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <code className="flex-1 font-mono text-sm text-primary bg-code-bg px-3 py-2 rounded border border-code-border whitespace-pre-wrap break-all">
                    {expr.extra_lines && expr.extra_lines.length > 0 && (
                      <span className="text-muted-foreground text-xs block mb-1 whitespace-pre-wrap">
                        {expr.extra_lines.join("\n")}
                      </span>
                    )}
                    {expr.code}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(id, codeToCopy)}
                    className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                    aria-label="Copy"
                  >
                    {copiedId === id ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {expr.platform_specific_warnings?.length > 0 && (
                  <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                    {expr.platform_specific_warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-warning" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {expr.workaround_hint && (
                  <p className="mt-2 text-xs text-muted-foreground italic">
                    {expr.workaround_hint}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Common mistakes */}
      {analysis && analysis.common_mistakes?.length > 0 && (
        <div className="mt-6 px-4 py-3 bg-card/40 border border-border/50 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium mb-2">
            Common mistakes with this pattern:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {analysis.common_mistakes.map((m, i) => (
              <li key={i}>• {m}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Human-readable */}
      {analysis && analysis.is_valid && analysis.human_readable && (
        <div className="mt-4 px-4 py-3 bg-card/40 border border-border/50 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium mb-1">
            In plain English:
          </p>
          <p className="text-sm text-foreground">{analysis.human_readable}</p>
        </div>
      )}

      {/* Empty state */}
      {!analysis && !isGenerating && !error && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">
            Type a schedule in plain English and press Generate
          </p>
          <p className="text-xs mt-2 opacity-70">
            Try: &quot;every Monday at 8am EST&quot; or &quot;daily at midnight
            UTC&quot;
          </p>
        </div>
      )}

      {/* Small print */}
      <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
        <span>Free forever · Powered by Claude · Open prompt</span>
        <a
          href="https://github.com/lumm256/cronwiz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          Star us on GitHub →
        </a>
      </div>
    </div>
  )
}
