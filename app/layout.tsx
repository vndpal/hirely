import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hirely – AI Interview Platform',
  description: 'AI-powered screening interviews for smarter hiring.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
