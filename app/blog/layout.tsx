import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to cronwiz.dev
        </Link>
        <article>
          {children}
        </article>
      </div>
    </div>
  )
}
