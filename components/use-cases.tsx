"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const useCases = [
  {
    title: "Daily backup at 3am Singapore time",
    input: "backup at 3am SGT every day",
    outputs: [
      { platform: "Linux", code: "0 3 * * *", note: "TZ=Asia/Singapore" },
      { platform: "Kubernetes", code: "0 3 * * *", note: "timeZone: Asia/Singapore" },
    ],
  },
  {
    title: "Trigger weekly newsletter on Mondays",
    input: "every Monday at 8am EST",
    outputs: [
      { platform: "GitHub Actions", code: `on:\n  schedule:\n    - cron: '0 13 * * 1'`, note: "UTC offset applied" },
    ],
  },
  {
    title: "Run K8s job last weekday of each month",
    input: "last business day of every month at 6pm UTC",
    outputs: [
      { platform: "Kubernetes", code: "0 18 L * 1-5", note: "Requires workaround for 'L'" },
    ],
  },
  {
    title: "Hourly health check, business hours only",
    input: "every hour from 9am to 5pm Mon-Fri UTC",
    outputs: [
      { platform: "Vercel", code: "0 9-17 * * 1-5" },
      { platform: "Cloudflare", code: "0 9-17 * * 1-5" },
    ],
  },
]

export function UseCases() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeCase = useCases[activeIndex]

  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-balance">
          Real-World Use Cases
        </h2>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {useCases.map((useCase, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "px-4 py-2 text-sm rounded-lg border transition-all",
                activeIndex === index
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              )}
            >
              {useCase.title.split(" ").slice(0, 3).join(" ")}...
            </button>
          ))}
        </div>

        {/* Active Case Display */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-medium text-foreground">{activeCase.title}</h3>
            </div>
            
            {/* Input */}
            <div className="px-6 py-4 border-b border-border bg-code-bg">
              <p className="text-xs text-muted-foreground mb-1">Input</p>
              <code className="font-mono text-primary">{activeCase.input}</code>
            </div>
            
            {/* Outputs */}
            <div className="px-6 py-4 space-y-4">
              {activeCase.outputs.map((output, index) => (
                <div key={index}>
                  <p className="text-xs text-muted-foreground mb-2">{output.platform}</p>
                  <pre className="font-mono text-sm bg-code-bg border border-code-border rounded-lg p-3 text-foreground overflow-x-auto">
                    {output.code}
                  </pre>
                  {output.note && (
                    <p className="text-xs text-muted-foreground mt-1">{output.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
