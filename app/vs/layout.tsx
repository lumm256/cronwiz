import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function VsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-14">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
            <ol className="flex items-center gap-1.5">
              <li><a href="/" className="hover:text-foreground transition-colors">Home</a></li>
              <li>/</li>
              <li className="text-foreground">Compare</li>
            </ol>
          </nav>
          {children}
        </div>
      </div>
      <Footer />
    </>
  )
}
