import type { Metadata } from "next"
import Link from "next/link"
import { Check, X } from "lucide-react"

export const metadata: Metadata = {
  title: "cronwiz vs Healthchecks.io — Honest Comparison (2026) | cronwiz.dev",
  description: "Healthchecks.io vs cronwiz: free tiers, features, and who should pick which. An honest comparison from the cronwiz team.",
  alternates: { canonical: "https://cronwiz.dev/vs/healthchecks" },
  openGraph: {
    title: "cronwiz vs Healthchecks.io — Which Cron Monitor Is Right for You?",
    description: "Healthchecks.io vs cronwiz: free tiers, features, pricing, and self-hosting options.",
    url: "https://cronwiz.dev/vs/healthchecks",
    type: "article",
  },
}

type CellValue = boolean | string

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value
      ? <Check className="w-5 h-5 text-success mx-auto" />
      : <X className="w-5 h-5 text-muted-foreground mx-auto" />
  }
  return <span className={`text-sm ${highlight ? "text-primary" : "text-muted-foreground"}`}>{value}</span>
}

const rows: { feature: string; healthchecks: CellValue; cronwiz: CellValue }[] = [
  { feature: "Cron monitoring", healthchecks: true, cronwiz: "Coming Q3 2026" },
  { feature: "Cron generator", healthchecks: false, cronwiz: true },
  { feature: "Cron explainer", healthchecks: false, cronwiz: true },
  { feature: "Cross-platform validator", healthchecks: false, cronwiz: true },
  { feature: "Free monitors", healthchecks: "20", cronwiz: "3" },
  { feature: "Paid plan starting price", healthchecks: "$20/mo", cronwiz: "$5/mo" },
  { feature: "Paid monitors", healthchecks: "50+", cronwiz: "25" },
  { feature: "Alert channels", healthchecks: "Email, Slack, PagerDuty, Telegram, webhooks, 20+", cronwiz: "Email, Slack, Discord" },
  { feature: "Grace periods", healthchecks: true, cronwiz: "Planned" },
  { feature: "Self-hostable", healthchecks: "Yes (open source)", cronwiz: false },
  { feature: "API access", healthchecks: true, cronwiz: "Planned" },
  { feature: "Run history", healthchecks: "Varies by plan", cronwiz: "90 days" },
  { feature: "AI-powered alerts", healthchecks: false, cronwiz: true },
]

export default function VsHealthchecks() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
        cronwiz vs Healthchecks.io
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        An honest comparison. Healthchecks.io is open source and has the most generous free tier in the market — we respect that.
      </p>

      <hr className="border-border mb-8" />

      <h2 className="text-xl font-semibold text-foreground mb-4">The Short Version</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Choose Healthchecks.io</strong> if you want monitoring today, need more than 3 free monitors, want to self-host, or prefer open-source tools. It has 20 free monitors and an excellent track record.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        <strong className="text-foreground">Consider cronwiz</strong> if you want cron generation, explanation, and validation alongside monitoring, prefer AI-powered alerts, and are okay waiting until Q3 2026. Our paid plan will be cheaper ($5 vs $20/mo), but Healthchecks.io free tier is hard to beat.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4">Feature Comparison</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground">Feature</th>
              <th className="text-center py-3 px-3 text-sm font-medium text-muted-foreground">Healthchecks.io</th>
              <th className="text-center py-3 px-3 text-sm font-medium text-primary">cronwiz</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-3 px-3 text-sm text-foreground">{row.feature}</td>
                <td className="py-3 px-3 text-center"><Cell value={row.healthchecks} /></td>
                <td className="py-3 px-3 text-center"><Cell value={row.cronwiz} highlight /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-4">The Free Tier Question</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Healthchecks.io offers 20 free monitors — the most generous free tier in the cron monitoring space. cronwiz will offer 3 free monitors. If you just need basic monitoring for free, Healthchecks.io is the clear winner.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        However, cronwiz includes free cron generation, explanation, and validation tools that Healthchecks.io does not offer. If you use these tools regularly, cronwiz provides more overall value even with fewer free monitors.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4">Self-Hosting</h2>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Healthchecks.io is fully open source (BSD license) and can be self-hosted for free with unlimited monitors. This is a massive advantage for homelabbers and teams with internal infrastructure. cronwiz has no self-hosting option and no plans to add one.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4">Where Healthchecks.io Wins</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-8">
        <li>20 free monitors (vs 3)</li>
        <li>Open source and self-hostable</li>
        <li>Available today, proven reliability</li>
        <li>20+ alert integrations</li>
        <li>Grace periods for late pings</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4">Where cronwiz Wins</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-8">
        <li>Cron generation + explanation + validation included</li>
        <li>AI-powered plain-English alerts</li>
        <li>Cheaper paid plan ($5 vs $20/month)</li>
        <li>Multi-platform support (7+ platforms vs generic)</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4">Can You Use Both?</h2>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Yes. Use cronwiz for generating and validating your cron expressions (free today), and Healthchecks.io for monitoring them (free with 20 monitors). When cronwiz monitoring launches, you can evaluate whether consolidating to one tool makes sense for your workflow.
      </p>

      <div className="bg-card border border-primary/30 rounded-xl p-6">
        <p className="text-foreground font-medium mb-2">Our recommendation</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Start with <Link href="/" className="text-primary hover:underline">cronwiz</Link> for cron generation (free now) and Healthchecks.io for monitoring (free tier). When we launch monitoring in Q3 2026, you can decide if consolidating makes sense. <Link href="/#waitlist" className="text-primary hover:underline">Join the waitlist</Link> to get notified.
        </p>
      </div>
    </>
  )
}
