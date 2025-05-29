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
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; script-src-elem 'self' 'unsafe-inline'; script-src-attr 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self';"
        />
        <style>
          {`
          /* Card styling */
          .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1 ), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin-bottom: 2rem;
            padding: 1.5rem;
            position: relative;
          }

          /* Card headers */
          .section-title {
            color: #1e293b;
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 1rem;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 0.75rem;
          }

          .card-title {
            color: #1e293b;
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }

          /* Form elements */
          input[type="text"], 
          input[type="email"], 
          input[type="tel"], 
          input[type="number"],
          textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          input[type="text"]:focus, 
          input[type="email"]:focus, 
          input[type="tel"]:focus, 
          input[type="number"]:focus,
          textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }

          textarea {
            min-height: 100px;
            resize: vertical;
          }

          /* Labels */
          label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #1e293b;
          }

          /* Buttons */
          button {
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.375rem;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
          }

          button:hover {
            background-color: #2563eb;
          }

          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* Social buttons */
          .social-button {
            display: inline-flex;
            align-items: center;
            background-color: transparent;
            color: #64748b;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            padding: 0.25rem 0.75rem;
            font-size: 0.875rem;
          }

          .social-button:hover {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
          }

          /* Sliders */
          input[type="range"] {
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: #e2e8f0;
            outline: none;
            -webkit-appearance: none;
            margin: 0.5rem 0 1rem 0;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: none;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }

          /* Tables */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
          }

          th {
            background-color: rgba(59, 130, 246, 0.1);
            color: #1e293b;
            font-weight: 600;
            text-align: left;
            padding: 0.75rem;
            border-bottom: 2px solid #e2e8f0;
          }

          td {
            padding: 0.75rem;
            border-bottom: 1px solid #e2e8f0;
          }

          tr:hover {
            background-color: rgba(59, 130, 246, 0.05);
          }

          /* Spacing between cards */
          body > div > div {
            margin-bottom: 2rem;
          }
          
          /* Add container padding */
          body {
            background-color: #f8fafc;
            padding: 1rem;
          }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  )
}
