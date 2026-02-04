import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LanguageProvider from '@/components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FINORA - Your Financial Guide',
  description: 'Vernacular-first financial guidance platform for Indian users',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
