"use client"

import { useState } from "react"
import { ShieldCheck, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CronAnalysis } from "@/lib/types"
import { PLATFORM_LABELS, type Platform } from "@/lib/types"

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

type ValidationStatus = "valid" | "warning" | "error"

function getStatus(expr: CronAnalysis["expressions"][number]): ValidationStatus {
  if (expr.support_status === "unsupported") return "error"
  if (expr.support_status === "workaround" || expr.platform_specific_warnings?.length > 0) return "warning"
  return "valid"
}

const statusConfig: Record<ValidationStatus, { icon: string; color: string; label: string }> = {
  valid: { icon: "✓", color: "text-success", label: "Valid" },
  warning: { icon: "⚠", color: "text-warning", label: "Warning" },
  error: { icon: "✗", color: "text-destructive", label: "Invalid" },
}

const platforms: Platform[] = [
  "linux", "aws", "kubernetes", "github_actions", "vercel", "quartz", "cloudflare_workers",
]

export default function ValidatePage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<CronAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleValidate = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    setIsLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: `Validate this cron expression across all platforms: ${trimmed}` }),
      })

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

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
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
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
          Cron Expression Validator
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Check if your cron expression is valid across Linux, AWS, Kubernetes, GitHub Actions, Vercel, and more.
        </p>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary/50 mb-8">
          <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidate()}
            placeholder="*/5 * * * *"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-mono"
            disabled={isLoading}
          />
          <Button onClick={handleValidate} disabled={!input.trim() || isLoading} size="sm">
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" />
                Validating…
              </>
            ) : (
              "Validate"
            )}
          </Button>
        </div>

        {/* Error */}
        {error && !isLoading && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkles className="w-6 h-6 mx-auto mb-3 animate-pulse text-primary" />
            <p className="text-sm">Validating across {platforms.length} platforms…</p>
            <p className="text-xs mt-2 opacity-60">Typically 10–30 seconds.</p>
          </div>
        )}

        {/* Validation errors */}
        {analysis && !analysis.is_valid && (
          <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-xl p-6">
            <h2 className="text-destructive font-medium mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Invalid expression
            </h2>
            <ul className="text-sm text-muted-foreground space-y-1 mb-4">
              {analysis.validation_errors.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
            {analysis.did_you_mean?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Did you mean:</p>
                {analysis.did_you_mean.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s.expression)}
                    className="block w-full text-left px-3 py-2 mb-1 bg-card border border-border rounded-md hover:border-primary/30"
                  >
                    <span className="text-sm text-foreground">{s.label}</span>
                    <code className="block text-xs text-primary font-mono mt-0.5">{s.expression}</code>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Platform validation results */}
        {analysis && analysis.is_valid && analysis.expressions.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Validation results by platform
            </h2>
            {analysis.expressions.map((expr, i) => {
              const status = getStatus(expr)
              const cfg = statusConfig[status]
              return (
                <div key={i} className="bg-card border border-border rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {PLATFORM_LABELS[expr.platform]}
                    </span>
                    <span className={`flex items-center gap-1.5 text-sm ${cfg.color}`}>
                      <span>{cfg.icon}</span>
                      {cfg.label}
                    </span>
                  </div>
                  {expr.code && status !== "error" && (
                    <code className="block mt-2 text-xs font-mono text-primary bg-code-bg border border-code-border rounded px-2 py-1">
                      {expr.code}
                    </code>
                  )}
                  {expr.platform_specific_warnings?.map((w, j) => (
                    <p key={j} className="mt-2 text-xs text-warning">⚠ {w}</p>
                  ))}
                  {expr.workaround_hint && (
                    <p className="mt-1 text-xs text-muted-foreground italic">{expr.workaround_hint}</p>
                  )}
                </div>
              )
            })}

            {/* Human readable */}
            {analysis.human_readable && (
              <div className="mt-4 bg-card/50 border border-border/50 rounded-lg px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Means:</span> {analysis.human_readable}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!analysis && !isLoading && !error && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Paste a cron expression above and press Validate</p>
            <p className="text-xs mt-2 opacity-70">
              We&apos;ll check it against Linux, AWS, Kubernetes, GitHub Actions, Vercel, Quartz, and Cloudflare
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
