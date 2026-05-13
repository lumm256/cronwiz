import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cronwiz.dev"

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/explain`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/validate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/test`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog/cron-job-not-running`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/cron-not-working`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog/best-cron-monitoring-tools-2026`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs/cronitor`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/healthchecks`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]
}
