import React from 'react';
// Remove the globals.css import since it doesn't exist in your project
// import '../globals.css';

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
        {/* No CSP meta tag, but ensure all style links are present */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  )
}

