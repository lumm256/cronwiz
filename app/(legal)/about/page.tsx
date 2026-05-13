import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About | cronwiz.dev",
  description: "cronwiz.dev is an AI-powered cron expression generator and monitor built for indie developers and small teams.",
  alternates: { canonical: "https://cronwiz.dev/about" },
}

export default function AboutPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-foreground mb-8">About cronwiz.dev</h1>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          <strong className="text-foreground">cronwiz.dev</strong> is an AI-powered cron expression tool built for developers who would rather ship than memorize cron syntax.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">What we do</h2>
        <p>
          We help you generate, explain, validate, and test cron expressions across 7+ platforms — Linux, AWS EventBridge, Kubernetes, GitHub Actions, Vercel, Cloudflare Workers, and Quartz/Spring.
        </p>
        <p>
          Type a schedule in plain English, and we produce production-ready cron with timezone handling, platform-specific warnings, and edge case detection built in.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">What&apos;s coming</h2>
        <p>
          We are building <strong className="text-foreground">AI Cron Monitoring</strong> — a service that watches your cron jobs and alerts you in plain English when something goes wrong. No more cryptic timestamp emails. Launching Q3 2026, starting at $5/month.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Who we are</h2>
        <p>
          cronwiz is built by an indie developer who got tired of debugging silent cron failures at 2am. The tools are free. The generator and explainer will always be free.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Tech stack</h2>
        <p>
          Next.js, React, Tailwind, and Claude (via{" "}
          <a href="https://kie.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">kie.ai</a>
          ). Hosted on Vercel. Email via Resend. Source code on{" "}
          <a href="https://github.com/lumm256/cronwiz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Contact</h2>
        <p>
          Email us at{" "}
          <a href="mailto:hi@cronwiz.dev" className="text-primary hover:underline">hi@cronwiz.dev</a>
          {" "}or find us on{" "}
          <a href="https://x.com/lumm256" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">X</a>.
        </p>
      </div>
    </>
  )
}
