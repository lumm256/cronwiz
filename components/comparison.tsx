import { Check, X } from "lucide-react"

const comparisons = [
  { feature: "Plain English input", cronGuru: false, cronWiz: true },
  { feature: "Multi-platform output", cronGuru: "Linux only", cronWiz: "8 platforms" },
  { feature: "Plan limit warnings", cronGuru: false, cronWiz: true },
  { feature: "Edge case detection", cronGuru: false, cronWiz: true },
  { feature: "Reverse explanation", cronGuru: true, cronWiz: true },
  { feature: "Free, no signup", cronGuru: true, cronWiz: true },
  { feature: "Cron monitoring", cronGuru: "Cronitor (paid)", cronWiz: "Coming Q3 ($5+)" },
]

export function Comparison() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4 text-balance">
          Why Not Just Use crontab.guru?
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          crontab.guru is great for Linux cron, but modern deployments need more.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Feature</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">crontab.guru</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-primary">cronwiz.dev</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-4 px-4 text-sm text-foreground">{row.feature}</td>
                  <td className="py-4 px-4 text-center">
                    {typeof row.cronGuru === "boolean" ? (
                      row.cronGuru ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-muted-foreground">{row.cronGuru}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof row.cronWiz === "boolean" ? (
                      row.cronWiz ? (
                        <Check className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-primary">{row.cronWiz}</span>
                    )}
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
