'use client';

import './globals.css'; // Import global CSS

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add Content Security Policy to fix CSP issues */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
        />
        {/* Force client-side JavaScript execution */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', function( ) {
            // Force hydration of all interactive elements
            document.querySelectorAll('button, input, select').forEach(el => {
              const clone = el.cloneNode(true);
              el.parentNode.replaceChild(clone, el);
            });
          });
        `}} />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
