'use client';

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
        {/* Force client-side JavaScript execution */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', function() {
            // Force hydration of all interactive elements
            document.querySelectorAll('button, input, select').forEach(el => {
              const clone = el.cloneNode(true);
              el.parentNode.replaceChild(clone, el);
            });
          });
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
