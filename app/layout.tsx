import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AI Cron Expression Generator with Job Monitoring | cronwiz.dev',
  description: 'Type schedules in plain English, validate any cron expression, and monitor cron jobs across 7 platforms. Free cron generator for Linux, AWS, Kubernetes, GitHub Actions, Vercel, and more.',
  keywords: ['cron expression generator', 'cron explainer', 'cron validator', 'cron monitoring', 'cron job not running', 'crontab generator'],
  authors: [{ name: 'cronwiz.dev' }],
  openGraph: {
    title: 'AI Cron Expression Generator with Job Monitoring',
    description: 'Type schedules in plain English, validate any cron expression, and monitor cron jobs across 7 platforms. Free for indies.',
    url: 'https://cronwiz.dev',
    siteName: 'cronwiz.dev',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Cron Expression Generator with Job Monitoring',
    description: 'Type schedules in plain English, validate any cron expression, and monitor cron jobs across 7 platforms. Free for indies.',
  },
  alternates: {
    canonical: 'https://cronwiz.dev',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
