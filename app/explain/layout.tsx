import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cron Expression Explainer — Paste Any Cron, Get Plain English | cronwiz.dev",
  description: "Paste any cron expression (5-field, 6-field AWS, or 7-field Quartz) and get a plain-English explanation with platform-specific notes and warnings.",
  alternates: { canonical: "https://cronwiz.dev/explain" },
  openGraph: {
    title: "Cron Expression Explainer",
    description: "Paste any cron expression and get a plain-English breakdown with platform-specific notes.",
    url: "https://cronwiz.dev/explain",
  },
}

export default function ExplainLayout({ children }: { children: React.ReactNode }) {
  return children
}
