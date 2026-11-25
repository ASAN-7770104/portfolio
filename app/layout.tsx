import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Асан — Fullstack Разработчик | Казахстан',
  description:
    'Fullstack разработчик из Астаны. Создаю быстрые, красивые и масштабируемые решения на React, Next.js и PostgreSQL.',
  keywords: ['fullstack разработчик', 'React', 'Next.js', 'PostgreSQL', 'Астана', 'Казахстан'],
  authors: [{ name: 'Асан', url: 'https://asan.dev' }],
  creator: 'Асан',
  publisher: 'Асан',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://asan.dev',
    title: 'Асан — Fullstack Разработчик',
    description: 'Создаю быстрые, красивые и масштабируемые решения',
    siteName: 'Асан Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Асан — Fullstack Разработчик',
    description: 'Создаю быстрые, красивые и масштабируемые решения',
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
