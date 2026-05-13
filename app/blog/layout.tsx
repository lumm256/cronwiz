import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-14">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {children}
        </div>
      </div>
      <Footer />
    </>
  )
}
