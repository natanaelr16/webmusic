import { Inter } from 'next/font/google'
import './globals.css'
import { PageTransition } from '@/components/layout/PageTransition'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WebMusic Concert - Boletas Oficiales',
  description: 'Sistema de venta de boletas para concierto con QR de verificación',
  keywords: 'concierto, boletas, tickets, música, WebMusic, eventos',
  authors: [{ name: 'WebMusic Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}