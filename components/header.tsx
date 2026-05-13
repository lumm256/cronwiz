import Link from "next/link"
import { Github } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-foreground flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            C
          </span>
          cronwiz.dev
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/#tool" className="hover:text-foreground transition-colors">Tool</Link>
          <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <Link href="/#faq" className="hover:text-foreground transition-colors">FAQ</Link>
        </nav>
        <a
          href="https://github.com/lumm256/cronwiz"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="cronwiz on GitHub"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  )
}
