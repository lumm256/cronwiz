import { Sparkles, Layers, Shield } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Plain English In, Cron Out",
    description: "Stop memorizing 5-field syntax. Stop guessing day-of-week numbering. Just describe your schedule.",
  },
  {
    icon: Layers,
    title: "8 Platforms, One Prompt",
    description: "Linux · AWS EventBridge · Kubernetes · Quartz · Spring · GitHub Actions · Vercel · Cloudflare Workers",
  },
  {
    icon: Shield,
    title: "AI Catches the Tricky Bits",
    description: "DST transitions · UTC requirements · plan limits · platform-specific syntax · invalid edge cases",
  },
]

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-balance">
          Why Developers Use CronWiz
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
