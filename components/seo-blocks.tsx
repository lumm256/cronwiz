import { ArrowRight, Search, ShieldCheck, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExplainBlock() {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-balance">
              Explain Existing Cron Expressions
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Paste any cron expression and get a plain-English breakdown: what it does, when it fires next, and what platform quirks to watch for.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Supports standard 5-field, AWS 6-field, Quartz 6-7 field, and Spring expressions.
            </p>
            <Button variant="outline" asChild>
              <a href="/explain" className="gap-2">
                Try the cron explainer
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
          <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Example</span>
            </div>
            <div className="space-y-3">
              <div className="bg-code-bg border border-code-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Input</p>
                <code className="font-mono text-sm text-primary">0 */6 * * 1-5</code>
              </div>
              <div className="bg-code-bg border border-code-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Output</p>
                <p className="text-sm text-foreground">Every 6 hours on weekdays (Mon-Fri), at minute 0. Next run: Monday 00:00 UTC.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ValidateBlock() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Validation result</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-success mt-0.5">&#10003;</span>
                <span className="text-foreground">Valid Linux crontab syntax</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success mt-0.5">&#10003;</span>
                <span className="text-foreground">Valid Kubernetes CronJob</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-warning mt-0.5">&#9888;</span>
                <span className="text-foreground">AWS EventBridge requires 6 fields &mdash; add year</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">&#10007;</span>
                <span className="text-foreground">Invalid for GitHub Actions: interval &lt; 5 min</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-balance">
              Validate Cron Syntax Across Platforms
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A cron expression that works on Linux might silently fail on AWS or GitHub Actions. Our validator checks your expression against all 7 platforms at once.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Catch plan limits, syntax mismatches, and edge cases before they break production.
            </p>
            <Button variant="outline" asChild>
              <a href="/validate" className="gap-2">
                Validate your cron expression
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

const troubleshootItems = [
  {
    title: "Timezone mismatch",
    description: "Your \"9am\" might be 9am UTC, not your local time. GitHub Actions and Vercel only accept UTC.",
  },
  {
    title: "Day-of-week numbering",
    description: "Sunday is 0 on Linux but 1 on Quartz/Spring. One wrong number and your job runs on Saturday instead.",
  },
  {
    title: "Platform limits",
    description: "GitHub Actions enforces a 5-minute minimum. Vercel Hobby plans allow only 1 cron per day. Your expression might be valid but rejected.",
  },
  {
    title: "Feb 30 and impossible dates",
    description: "Expressions like \"0 0 31 2 *\" are syntactically valid but never fire. Most platforms accept them silently.",
  },
  {
    title: "AWS day-of-month vs day-of-week",
    description: "AWS EventBridge requires a \"?\" in one of these fields. Using \"*\" in both is an error that Linux cron allows.",
  },
  {
    title: "DST transitions",
    description: "A 2:30am job might run twice or skip entirely during daylight saving changes, depending on the platform's timezone handling.",
  },
]

export function TroubleshootBlock() {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-balance">
            Why Does My Cron Job Not Run?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The 6 most common reasons your scheduled job silently fails &mdash; and how to fix each one.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {troubleshootItems.map((item, index) => (
            <div key={index} className="bg-background border border-border rounded-xl p-5">
              <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <a href="#tool" className="gap-2">
              Test your expression now
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
