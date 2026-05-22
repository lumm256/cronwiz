import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <Link href="/" className="font-semibold text-foreground text-lg">
              cronwiz.dev
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              AI cron expressions for the rest of us
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <a
              href="https://x.com/lumm256"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="cronwiz on X"
              className="hover:text-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/lumm256/cronwiz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="cronwiz on GitHub"
              className="hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" aria-hidden="true" />
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>
            Made for developers who&apos;d rather ship than memorize cron syntax.
            <span className="mx-2">·</span>
            Powered by Claude.
          </p>
          <p>
            <a href="https://viesearch.com/">Viesearch - The Human-curated Search Engine</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
