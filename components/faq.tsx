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
    answer: "It depends on where you deploy. Linux servers use standard 5-field. AWS Lambda/EventBridge uses 6-field with year. Kubernetes CronJob uses 5-field with an optional timeZone field. GitHub Actions uses 5-field UTC-only. Spring/Quartz uses 6-7 fields with seconds. cronwiz.dev shows you all of them simultaneously.",
  },
  {
    question: "How do timezones work in cron?",
    answer: "Most cron systems run in UTC by default. Some platforms (Linux crontab, Kubernetes v1.27+) let you specify a timezone. Others (AWS EventBridge, GitHub Actions, Vercel) only accept UTC — you must convert manually and account for DST yourself.",
  },
  {
    question: "Why is my cron job not running?",
    answer: "Common causes include timezone mismatch (your \"9am\" might be 9am UTC, not local time), day-of-month vs day-of-week ambiguity (Linux requires both, AWS uses ?), platform-specific limits (GitHub Actions 5-min minimum, Vercel Hobby 1 cron/day), and invalid syntax that is silently accepted but never matches (e.g., Feb 30).",
  },
  {
    question: "Is cronwiz free?",
    answer: "The cron generator, explainer, and validator are 100% free with no signup required. Our paid product (AI Cron Monitor) is launching Q3 2026 at $5/month — join the waitlist above.",
  },
  {
    question: "Can I use cron in GitHub Actions?",
    answer: "Yes. GitHub Actions supports cron via the schedule trigger. It uses standard 5-field syntax but only runs in UTC. The shortest interval allowed is every 5 minutes. cronwiz.dev generates GitHub Actions cron with automatic UTC conversion.",
  },
  {
    question: "Can I use cron in Vercel?",
    answer: "Yes. Vercel supports cron jobs via vercel.json. Hobby plans allow 1 cron job per day, Pro plans allow up to every 10 minutes. cronwiz.dev warns you about these plan limits when generating expressions.",
  },
  {
    question: "How is cronwiz different from Cronitor?",
    answer: "Cronitor is a dedicated cron monitoring service starting at $20/month. cronwiz combines AI-powered cron generation, explanation, and validation in one free tool, with affordable monitoring coming at $5/month. cronwiz is built for indie developers and small teams who need monitoring without enterprise pricing.",
  },
  {
    question: "How is cronwiz different from crontab.guru?",
    answer: "crontab.guru is a great Linux cron reference tool but only supports standard 5-field syntax. cronwiz generates expressions for 7+ platforms (AWS, Kubernetes, GitHub Actions, Vercel, etc.), handles timezone conversion, warns about platform limits, and detects edge cases like DST transitions.",
  },
  {
    question: "What platforms does cronwiz support?",
    answer: "cronwiz supports Linux crontab, AWS EventBridge, Kubernetes CronJob, Quartz/Spring, GitHub Actions, Vercel Cron, and Cloudflare Workers. Each platform has different syntax rules and limitations — cronwiz generates the correct expression for each one.",
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
