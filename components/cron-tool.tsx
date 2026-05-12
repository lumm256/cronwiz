"use client"

import { useState } from "react"
import { Check, Copy, AlertTriangle, Clock, Zap, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Platform = {
  id: string
  name: string
  expression: string
  note?: string
  hasWarning?: boolean
}

const EXAMPLE_PLATFORMS: Platform[] = [
  { id: "linux", name: "Linux", expression: "0 9 * * 1-5" },
  { id: "aws", name: "AWS EventBridge", expression: "cron(0 9 ? * MON-FRI *)" },
  { id: "k8s", name: "Kubernetes", expression: "0 9 * * 1-5", note: "timeZone: America/Los_Angeles" },
  { id: "github", name: "GitHub Actions", expression: "0 16 * * 1-5", note: "UTC offset applied", hasWarning: true },
  { id: "vercel", name: "Vercel", expression: "0 16 * * 1-5", note: "UTC only" },
  { id: "quartz", name: "Quartz/Spring", expression: "0 0 9 ? * MON-FRI" },
  { id: "cloudflare", name: "Cloudflare Workers", expression: "0 16 * * 1-5" },
]

export function CronTool() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linux", "aws", "k8s", "github"])

  const handleGenerate = () => {
    if (!input.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
    }, 800)
  }

  const handleCopy = (id: string, expression: string) => {
    navigator.clipboard.writeText(expression)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const visiblePlatforms = EXAMPLE_PLATFORMS.filter(p => selectedPlatforms.includes(p.id))

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Section */}
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
          />
          <Button 
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            size="sm"
            className="shrink-0"
          >
            {isGenerating ? (
              <>
                <Zap className="w-4 h-4 animate-pulse" />
                Generating...
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

      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {EXAMPLE_PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md border transition-all",
              selectedPlatforms.includes(platform.id)
                ? "bg-primary/10 border-primary/50 text-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {platform.name}
          </button>
        ))}
      </div>

      {/* Output Cards */}
      {hasGenerated && (
        <div className="grid gap-3 sm:grid-cols-2">
          {visiblePlatforms.map((platform, index) => (
            <div
              key={platform.id}
              className="group relative bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">{platform.name}</span>
                {platform.hasWarning && (
                  <span className="flex items-center gap-1 text-xs text-warning">
                    <AlertTriangle className="w-3 h-3" />
                    DST
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-sm text-primary bg-code-bg px-3 py-2 rounded border border-code-border">
                  {platform.expression}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(platform.id, platform.expression)}
                  className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  {copiedId === platform.id ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {platform.note && (
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {platform.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!hasGenerated && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">Type a schedule in plain English and press Generate</p>
          <p className="text-xs mt-2 opacity-70">Try: &quot;every Monday at 8am EST&quot; or &quot;daily at midnight UTC&quot;</p>
        </div>
      )}

      {/* Small Print */}
      <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
        <span>Free forever · Powered by Claude · Open source prompt</span>
        <a href="#" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
          Star us on GitHub →
        </a>
      </div>
    </div>
  )
}
