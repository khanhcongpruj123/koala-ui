import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import TopBar from '@/components/TopBar'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { SessionProvider } from 'next-auth/react'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-black via-black/70 to-gray-900/5">
                <TopBar />
              </header>
              <div className="w-full">{children}</div>
              <div className="divider-base-300 divider"></div>
              <div className="mt-4 flex h-fit flex-col items-center justify-end gap-2 px-4 pb-4 pt-8">
                <Footer />
              </div>
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
