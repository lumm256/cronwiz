import { Check, X } from "lucide-react"

type CellValue = boolean | string

const competitors = ["crontab.guru", "Cronitor", "Healthchecks"] as const

const comparisons: { feature: string; values: Record<string, CellValue>; cronWiz: CellValue }[] = [
  {
    feature: "Plain English input",
    values: { "crontab.guru": false, Cronitor: false, Healthchecks: false },
    cronWiz: true,
  },
  {
    feature: "Multi-platform output",
    values: { "crontab.guru": "Linux only", Cronitor: false, Healthchecks: false },
    cronWiz: "8 platforms",
  },
  {
    feature: "Plan limit warnings",
    values: { "crontab.guru": false, Cronitor: false, Healthchecks: false },
    cronWiz: true,
  },
  {
    feature: "Edge case detection",
    values: { "crontab.guru": false, Cronitor: false, Healthchecks: false },
    cronWiz: true,
  },
  {
    feature: "Reverse explanation",
    values: { "crontab.guru": true, Cronitor: false, Healthchecks: false },
    cronWiz: true,
  },
  {
    feature: "Free tier",
    values: { "crontab.guru": true, Cronitor: "5 monitors", Healthchecks: "20 monitors" },
    cronWiz: "Free + $5/mo",
  },
  {
    feature: "Cron monitoring",
    values: { "crontab.guru": false, Cronitor: "From $20/mo", Healthchecks: "From $20/mo" },
    cronWiz: "Coming Q3 ($5)",
  },
]

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value
      ? <Check className="w-5 h-5 text-success mx-auto" />
      : <X className="w-5 h-5 text-muted-foreground mx-auto" />
  }
  return <span className={`text-sm ${highlight ? "text-primary" : "text-muted-foreground"}`}>{value}</span>
}

export function Comparison() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4 text-balance">
          How Is cronwiz Different from Cronitor and Healthchecks?
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Cronitor and Healthchecks are pure monitors. crontab.guru is a generator but Linux-only. cronwiz does both &mdash; generate, explain, validate, and soon monitor.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Feature</th>
                {competitors.map((name) => (
                  <th key={name} className="text-center py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">{name}</th>
                ))}
                <th className="text-center py-4 px-4 text-sm font-medium text-primary">cronwiz.dev</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-4 px-4 text-sm text-foreground">{row.feature}</td>
                  {competitors.map((name) => (
                    <td key={name} className="py-4 px-4 text-center hidden sm:table-cell">
                      <Cell value={row.values[name]} />
                    </td>
                  ))}
                  <td className="py-4 px-4 text-center">
                    <Cell value={row.cronWiz} highlight />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
