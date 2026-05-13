"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Sparkles, Loader2 } from "lucide-react"

export function Waitlist() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === "loading") return

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setStatus("error")
        setErrorMsg(data?.error || "Something went wrong. Try again?")
        return
      }

      setStatus("success")
    } catch (err) {
      setStatus("error")
      setErrorMsg("Network error. Try again?")
    }
  }

  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Bell className="w-6 h-6 text-primary" />
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-balance">
          Coming Soon: AI Cron Monitoring
        </h2>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          {"We're building the first AI-native cron monitor. Get plain-English alerts when your jobs miss runs, fail silently, or run abnormally slow."}
        </p>

        <blockquote className="border-l-2 border-primary pl-4 text-left text-sm text-muted-foreground mb-8 italic">
          {"No more \"missed cron run on 2026-04-15 02:00 UTC\" emails. Just: \"Your nightly backup has been running 3x slower since Tuesday — here's why.\""}
        </blockquote>

        {status === "success" ? (
          <div className="flex items-center justify-center gap-2 text-success">
            <Sparkles className="w-5 h-5" />
            <span>{"You're on the list! Check your inbox for confirmation."}</span>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background"
                disabled={status === "loading"}
                required
              />
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding…
                  </>
                ) : (
                  "Notify me when it launches"
                )}
              </Button>
            </form>
            {status === "error" && (
              <p className="mt-3 text-sm text-destructive">{errorMsg}</p>
            )}
          </>
        )}

        <p className="text-xs text-muted-foreground mt-6">
          Be among the first 100 · Q3 2026 launch · From the makers of cronwiz.dev
        </p>
      </div>
    </section>
  )
}
