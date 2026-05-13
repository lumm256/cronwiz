"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Play, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Cron } from "croner"

function getNextRuns(expression: string, count: number, tz?: string): Date[] | null {
  try {
    const job = new Cron(expression, { timezone: tz || undefined })
    const runs: Date[] = []
    let prev: Date | undefined
    for (let i = 0; i < count; i++) {
      const next = job.nextRun(prev)
      if (!next) break
      runs.push(next)
      prev = new Date(next.getTime() + 1000)
    }
    return runs.length > 0 ? runs : null
  } catch {
    return null
  }
}

function formatDate(d: Date): string {
  return d.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  })
}

function formatRelative(d: Date, now: Date): string {
  const diffMs = d.getTime() - now.getTime()
  if (diffMs < 0) return "past"
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `in ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `in ${hours}h ${mins % 60}m`
  const days = Math.floor(hours / 24)
  return `in ${days}d ${hours % 24}h`
}

const COMMON_TZ = [
  { label: "Local", value: "" },
  { label: "UTC", value: "UTC" },
  { label: "US Eastern", value: "America/New_York" },
  { label: "US Pacific", value: "America/Los_Angeles" },
  { label: "Europe/London", value: "Europe/London" },
  { label: "Asia/Shanghai", value: "Asia/Shanghai" },
  { label: "Asia/Tokyo", value: "Asia/Tokyo" },
]

export default function TestPage() {
  const [input, setInput] = useState("")
  const [tz, setTz] = useState("")
  const [submitted, setSubmitted] = useState("")

  const now = useMemo(() => new Date(), [])

  const handleTest = () => {
    const trimmed = input.trim()
    if (trimmed) setSubmitted(trimmed)
  }

  const runs = useMemo(() => {
    if (!submitted) return null
    return getNextRuns(submitted, 10, tz || undefined)
  }, [submitted, tz])

  const parseError = submitted && !runs

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
          Cron Expression Tester
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Preview the next 10 scheduled runs for any cron expression. Runs entirely in your browser — instant results, no API call.
        </p>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary/50 mb-4">
          <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTest()}
            placeholder="*/15 * * * *"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-mono"
          />
          <Button onClick={handleTest} disabled={!input.trim()} size="sm">
            <Play className="w-4 h-4" />
            Test
          </Button>
        </div>

        {/* Timezone selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {COMMON_TZ.map((t) => (
            <button
              key={t.value}
              onClick={() => setTz(t.value)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                tz === t.value
                  ? "bg-primary/10 border-primary/50 text-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Parse error */}
        {parseError && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-destructive font-medium">Invalid cron expression</p>
              <p className="text-muted-foreground mt-1">
                Make sure you&apos;re using standard 5-field format: minute hour day-of-month month day-of-week
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {runs && (
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Next 10 runs {tz ? `(${tz})` : "(local time)"}
            </h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {runs.map((run, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i < runs.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5 text-right font-mono">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground font-mono">
                      {formatDate(run)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatRelative(run, now)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!submitted && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Enter a cron expression and press Test</p>
            <p className="text-xs mt-2 opacity-70">
              Try: &quot;0 9 * * 1-5&quot; (weekdays at 9am) or &quot;*/15 * * * *&quot; (every 15 min)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
