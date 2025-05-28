import React from 'react';

export const metadata = {
  title: 'Gap Analysis Pro',
  description: 'Interactive gap analysis tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* CSP meta tag removed to avoid conflicts with vercel.json */}
      </head>
      <body>{children}</body>
    </html>
  )
}
