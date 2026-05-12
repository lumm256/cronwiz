"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "What is a cron expression?",
    answer: "A cron expression is a string that defines when a scheduled task should run. The classic format has 5 fields: minute, hour, day-of-month, month, day-of-week. Different platforms (AWS, Quartz, Kubernetes) extend or modify this format.",
  },
  {
    question: "Which cron format should I use?",
    answer: `It depends on where you'll deploy:
• Linux servers → standard 5-field
• AWS Lambda/EventBridge → 6-field with year
• Kubernetes CronJob → standard 5-field, but with optional timeZone field
• GitHub Actions → 5-field UTC-only
• Spring/Quartz → 6-7 field with seconds

cronwiz.dev shows you all of them simultaneously.`,
  },
  {
    question: "How do timezones work in cron?",
    answer: "Most cron systems run in UTC by default. Some platforms (Linux crontab, Kubernetes v1.27+) let you specify a timezone. Others (AWS EventBridge, GitHub Actions, Vercel) only accept UTC — you must convert manually and account for DST yourself.",
  },
  {
    question: "Why does my cron job not run?",
    answer: `Common causes:
• Timezone mismatch (your "9am" might be 9am UTC, not local)
• Day-of-month + day-of-week ambiguity (Linux requires both, AWS uses ?)
• Platform-specific limits (GitHub Actions 5-min minimum, Vercel Hobby 1/day)
• Invalid syntax silently accepted but never matches (e.g., Feb 30)`,
  },
  {
    question: "Is cronwiz.dev free?",
    answer: "The cron generator and explainer are 100% free, no signup needed. Our paid product (AI Cron Monitor) is launching Q3 2026 — join the waitlist above.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-balance">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-card/50 transition-colors"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
