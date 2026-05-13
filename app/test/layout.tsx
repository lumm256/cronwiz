import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cron Expression Tester — Preview Next 10 Scheduled Runs | cronwiz.dev",
  description: "Enter any cron expression and instantly preview the next 10 scheduled runs. Client-side computation with timezone support — no API call needed.",
  alternates: { canonical: "https://cronwiz.dev/test" },
  openGraph: {
    title: "Cron Expression Tester",
    description: "Preview the next 10 scheduled runs for any cron expression. Instant results in your browser.",
    url: "https://cronwiz.dev/test",
  },
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return children
}
