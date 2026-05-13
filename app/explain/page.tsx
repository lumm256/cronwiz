"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Sparkles, AlertCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CronAnalysis } from "@/lib/types"
import { PLATFORM_LABELS } from "@/lib/types"

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

export default function ExplainPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<CronAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleExplain = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    setIsLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: `Explain this cron expression: ${trimmed}` }),
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cronwiz.dev
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
          Cron Expression Explainer
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Paste any cron expression and get a plain-English breakdown with platform-specific notes.
        </p>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary/50 mb-8">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExplain()}
            placeholder="0 */6 * * 1-5"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-mono"
            disabled={isLoading}
          />
          <Button onClick={handleExplain} disabled={!input.trim() || isLoading} size="sm">
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" />
                Explaining…
              </>
            ) : (
              "Explain"
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
            <p className="text-sm">Analyzing your cron expression…</p>
            <p className="text-xs mt-2 opacity-60">Typically 10–30 seconds.</p>
          </div>
        )}

        {/* Result */}
        {analysis && (
          <div className="space-y-6">
            {/* Human readable */}
            {analysis.human_readable && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-sm font-medium text-muted-foreground mb-2">Plain English</h2>
                <p className="text-lg text-foreground">{analysis.human_readable}</p>
                <button
                  onClick={() => handleCopy(analysis.human_readable)}
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}

            {/* Intent */}
            {analysis.intent_summary && (
              <div className="bg-card/50 border border-border/50 rounded-lg px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Intent:</span> {analysis.intent_summary}
                </p>
              </div>
            )}

            {/* Platform expressions */}
            {analysis.expressions.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">Platform breakdown</h2>
                <div className="space-y-2">
                  {analysis.expressions.map((expr, i) => (
                    <div key={i} className="bg-card border border-border rounded-lg px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {PLATFORM_LABELS[expr.platform]}
                        </span>
                        <code className="font-mono text-sm text-primary">{expr.code}</code>
                      </div>
                      {expr.platform_specific_warnings?.length > 0 && (
                        <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                          {expr.platform_specific_warnings.map((w, j) => (
                            <li key={j} className="text-warning">⚠ {w}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common mistakes */}
            {analysis.common_mistakes?.length > 0 && (
              <div className="bg-warning/5 border border-warning/20 rounded-lg px-4 py-3">
                <h2 className="text-sm font-medium text-warning mb-2">Watch out</h2>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {analysis.common_mistakes.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!analysis && !isLoading && !error && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Paste a cron expression above and press Explain</p>
            <p className="text-xs mt-2 opacity-70">
              Supports 5-field (Linux), 6-field (AWS), and 7-field (Quartz/Spring)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
