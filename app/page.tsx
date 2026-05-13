import { ArrowDown, Github } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CronTool } from "@/components/cron-tool"
import { ExplainBlock, ValidateBlock, TroubleshootBlock } from "@/components/seo-blocks"
import { Features } from "@/components/features"
import { UseCases } from "@/components/use-cases"
import { Comparison } from "@/components/comparison"
import { Waitlist } from "@/components/waitlist"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a cron expression?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A cron expression is a string that defines when a scheduled task should run. The classic format has 5 fields: minute, hour, day-of-month, month, day-of-week. Different platforms (AWS, Quartz, Kubernetes) extend or modify this format.",
      },
    },
    {
      "@type": "Question",
      name: "Which cron format should I use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on where you deploy. Linux servers use standard 5-field. AWS Lambda/EventBridge uses 6-field with year. Kubernetes CronJob uses 5-field with an optional timeZone field. GitHub Actions uses 5-field UTC-only. Spring/Quartz uses 6-7 fields with seconds. cronwiz.dev shows you all of them simultaneously.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my cron job not running?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common causes include timezone mismatch (your 9am might be 9am UTC, not local time), day-of-month vs day-of-week ambiguity (Linux requires both, AWS uses ?), platform-specific limits (GitHub Actions 5-min minimum, Vercel Hobby 1 cron/day), and invalid syntax that is silently accepted but never matches (e.g., Feb 30).",
      },
    },
    {
      "@type": "Question",
      name: "Is cronwiz free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The cron generator, explainer, and validator are 100% free with no signup required. Our paid product (AI Cron Monitor) is launching Q3 2026 at $5/month.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use cron in GitHub Actions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. GitHub Actions supports cron via the schedule trigger. It uses standard 5-field syntax but only runs in UTC. The shortest interval allowed is every 5 minutes. cronwiz.dev generates GitHub Actions cron with automatic UTC conversion.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use cron in Vercel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Vercel supports cron jobs via vercel.json. Hobby plans allow 1 cron job per day, Pro plans allow up to every 10 minutes. cronwiz.dev warns you about these plan limits when generating expressions.",
      },
    },
    {
      "@type": "Question",
      name: "How is cronwiz different from Cronitor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cronitor is a dedicated cron monitoring service starting at $20/month. cronwiz combines AI-powered cron generation, explanation, and validation in one free tool, with affordable monitoring coming at $5/month for indie developers and small teams.",
      },
    },
    {
      "@type": "Question",
      name: "How is cronwiz different from crontab.guru?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "crontab.guru is a great Linux cron reference tool but only supports standard 5-field syntax. cronwiz generates expressions for 7+ platforms, handles timezone conversion, warns about platform limits, and detects edge cases like DST transitions.",
      },
    },
    {
      "@type": "Question",
      name: "How do timezones work in cron?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most cron systems run in UTC by default. Some platforms (Linux crontab, Kubernetes v1.27+) let you specify a timezone. Others (AWS EventBridge, GitHub Actions, Vercel) only accept UTC — you must convert manually and account for DST yourself.",
      },
    },
    {
      "@type": "Question",
      name: "What platforms does cronwiz support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "cronwiz supports Linux crontab, AWS EventBridge, Kubernetes CronJob, Quartz/Spring, GitHub Actions, Vercel Cron, and Cloudflare Workers. Each platform has different syntax rules and limitations — cronwiz generates the correct expression for each one.",
      },
    },
  ],
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-foreground flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              C
            </span>
            cronwiz.dev
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#tool" className="hover:text-foreground transition-colors">Tool</Link>
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
          </nav>
          <a
            href="https://github.com/lumm256/cronwiz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="cronwiz on GitHub"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
            AI Cron Expression Generator{" "}
            <span className="text-primary">with Job Monitoring</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed text-balance">
            Type schedules in plain English, validate any expression, and monitor cron jobs across 7 platforms. Free for indies.
          </p>
          <Button size="lg" asChild>
            <a href="#tool" className="gap-2">
              <ArrowDown className="w-4 h-4" />
              Try the generator now — no signup
            </a>
          </Button>
        </div>
      </section>

      {/* H2.1: Generate */}
      <section id="tool" className="py-12 px-4 scroll-mt-20">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-balance">
            Generate Cron Expressions in Plain English
          </h2>
        </div>
        <CronTool />
      </section>

      {/* H2.2: Explain */}
      <ExplainBlock />

      {/* H2.3: Validate */}
      <ValidateBlock />

      {/* Features */}
      <section id="features" className="scroll-mt-20">
        <Features />
      </section>

      {/* Use Cases */}
      <UseCases />

      {/* H2.4: Troubleshoot */}
      <TroubleshootBlock />

      {/* H2.6: Comparison / Alternatives */}
      <Comparison />

      {/* Waitlist */}
      <Waitlist />

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <FAQ />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
