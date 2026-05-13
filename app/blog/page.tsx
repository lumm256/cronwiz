import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | cronwiz.dev",
  description: "Guides on cron expressions, debugging scheduled jobs, and monitoring best practices for Linux, AWS, Kubernetes, GitHub Actions, and more.",
  alternates: { canonical: "https://cronwiz.dev/blog" },
}

const posts = [
  {
    slug: "cron-job-not-running",
    title: "Why Is My Cron Job Not Running? 8 Causes & Fixes",
    description: "Your cron job isn't firing? Here are the 8 most common reasons — from timezone mismatches to platform-specific limits — and how to fix each one.",
    tag: "Troubleshooting",
  },
  {
    slug: "cron-not-working",
    title: "Cron Not Working? A Debugging Checklist for Every Platform",
    description: "Platform-specific debugging checklist for cron issues on Linux, AWS, Kubernetes, GitHub Actions, and Vercel.",
    tag: "Debugging",
  },
  {
    slug: "best-cron-monitoring-tools-2026",
    title: "5 Best Cron Monitoring Tools for Indies & Small Teams (2026)",
    description: "An honest comparison of cron monitoring tools under $20/month: Cronitor, Healthchecks.io, Better Uptime, Upptime, and cronwiz.",
    tag: "Comparison",
  },
]

export default function BlogPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-foreground mb-2">Blog</h1>
      <p className="text-muted-foreground mb-10">
        Guides on cron expressions, debugging scheduled jobs, and monitoring best practices.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group rounded-lg border border-border p-6 hover:border-primary/50 hover:bg-muted/30 transition-colors"
          >
            <span className="inline-block text-xs font-medium text-primary bg-primary/10 rounded px-2 py-0.5 mb-3">
              {post.tag}
            </span>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">{post.description}</p>
            <span className="inline-flex items-center gap-1 text-sm text-primary">
              Read more <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
