import type { Metadata } from "next"
import Link from "next/link"
import { Check, X } from "lucide-react"

export const metadata: Metadata = {
  title: "cronwiz vs Cronitor — Honest Comparison for Indie Developers (2026) | cronwiz.dev",
  description: "Cronitor vs cronwiz: pricing, features, and who each tool is best for. An honest comparison from the cronwiz team.",
  alternates: { canonical: "https://cronwiz.dev/vs/cronitor" },
  openGraph: {
    title: "cronwiz vs Cronitor — Which Cron Monitor Is Right for You?",
    description: "An honest feature and pricing comparison between Cronitor and cronwiz for indie developers.",
    url: "https://cronwiz.dev/vs/cronitor",
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

const rows: { feature: string; cronitor: CellValue; cronwiz: CellValue }[] = [
  { feature: "Cron monitoring", cronitor: true, cronwiz: "Coming Q3 2026" },
  { feature: "Cron generator", cronitor: false, cronwiz: true },
  { feature: "Cron explainer", cronitor: false, cronwiz: true },
  { feature: "Cross-platform validator", cronitor: false, cronwiz: true },
  { feature: "Free monitors", cronitor: "5", cronwiz: "3" },
  { feature: "Paid plan starting price", cronitor: "$20/mo", cronwiz: "$5/mo" },
  { feature: "Paid monitors", cronitor: "20+", cronwiz: "25" },
  { feature: "Alert channels", cronitor: "Email, Slack, PagerDuty, OpsGenie, SMS", cronwiz: "Email, Slack, Discord" },
  { feature: "Incident management", cronitor: true, cronwiz: false },
  { feature: "HTTP monitoring", cronitor: true, cronwiz: false },
  { feature: "Run history", cronitor: "90 days+", cronwiz: "90 days" },
  { feature: "API access", cronitor: true, cronwiz: "Planned" },
  { feature: "Team features", cronitor: true, cronwiz: false },
  { feature: "Self-hostable", cronitor: false, cronwiz: false },
]

export default function VsCronitor() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
        cronwiz vs Cronitor
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        An honest comparison. We build cronwiz, so we are biased — but we will tell you when Cronitor is the better choice.
      </p>

      <hr className="border-border mb-8" />

      <h2 className="text-xl font-semibold text-foreground mb-4">The Short Version</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">Choose Cronitor</strong> if you need battle-tested monitoring today, team features, incident management, or PagerDuty/OpsGenie integration. Cronitor has been around for years and is the most mature tool in the space.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        <strong className="text-foreground">Consider cronwiz</strong> if you are an indie developer or small team who wants cron generation + monitoring in one tool at a lower price point. Note: our monitoring is not yet launched (Q3 2026).
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4">Feature Comparison</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground">Feature</th>
              <th className="text-center py-3 px-3 text-sm font-medium text-muted-foreground">Cronitor</th>
              <th className="text-center py-3 px-3 text-sm font-medium text-primary">cronwiz</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-3 px-3 text-sm text-foreground">{row.feature}</td>
                <td className="py-3 px-3 text-center"><Cell value={row.cronitor} /></td>
                <td className="py-3 px-3 text-center"><Cell value={row.cronwiz} highlight /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-4">Pricing</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Cronitor starts at $20/month for 20 monitors. For teams with larger infrastructure, this is reasonable and well worth the cost given the maturity of the product.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        cronwiz will launch at $5/month for 25 monitors, specifically targeting indie developers and small teams who are running a handful of cron jobs and cannot justify $20+/month on monitoring alone.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4">Where Cronitor Wins</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-8">
        <li>Proven reliability — years of uptime and trust</li>
        <li>Enterprise integrations (PagerDuty, OpsGenie, SMS escalation)</li>
        <li>HTTP and uptime monitoring in addition to cron</li>
        <li>Team features with role-based access</li>
        <li>Incident management and status pages</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4">Where cronwiz Wins</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-8">
        <li>4x cheaper ($5 vs $20/month)</li>
        <li>Cron generation, explanation, and validation included</li>
        <li>AI-powered plain-English alerts (not just raw timestamps)</li>
        <li>Designed for indie developers from day one</li>
      </ul>

      <div className="bg-card border border-primary/30 rounded-xl p-6">
        <p className="text-foreground font-medium mb-2">Our take</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you need monitoring right now and have the budget, go with Cronitor — it is an excellent product. If you are watching costs and can wait until Q3 2026, <Link href="/#waitlist" className="text-primary hover:underline">join our waitlist</Link> and we will notify you at launch.
        </p>
      </div>
    </>
  )
}
