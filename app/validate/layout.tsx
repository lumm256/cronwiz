import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cron Expression Validator — Check Syntax Across 7 Platforms | cronwiz.dev",
  description: "Validate your cron expression against Linux, AWS EventBridge, Kubernetes, GitHub Actions, Vercel, Quartz, and Cloudflare Workers. Catch platform-specific issues before they break production.",
  alternates: { canonical: "https://cronwiz.dev/validate" },
  openGraph: {
    title: "Cron Expression Validator",
    description: "Check if your cron expression is valid across Linux, AWS, Kubernetes, GitHub Actions, Vercel, and more.",
    url: "https://cronwiz.dev/validate",
  },
}

export default function ValidateLayout({ children }: { children: React.ReactNode }) {
  return children
}
