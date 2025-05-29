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
          {`/* Direct CSS approach for Gap Analysis Pro */

/* Reset and base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Variables */
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --background-color: #f0f2f5; /* Facebook-like background */
  --card-background: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.15 );
  --shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.2);
  --radius: 12px; /* More rounded corners */
}

/* Global layout */
body {
  background-color: var(--background-color);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  padding: 0;
  margin: 0;
}

/* Main container with fixed width and center alignment */
body > div {
  max-width: 1000px !important;
  margin: 0 auto !important;
  padding: 2rem !important;
}

/* Card styling - social media post look */
body > div > div {
  background-color: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  position: relative;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  overflow: hidden;
}

body > div > div:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

/* LinkedIn-style profile card (Card 1) */
body > div > div:first-child {
  padding: 0;
}

/* Profile header/banner */
body > div > div:first-child::before {
  content: "";
  display: block;
  height: 100px;
  background-color: var(--primary-color);
  background-image: linear-gradient(to right, var(--primary-color), var(--primary-hover));
}

/* Profile content */
body > div > div:first-child > div {
  padding: 1.5rem;
}

/* Profile sections */
body > div > div:first-child h2 {
  font-size: 1.25rem;
  color: var(--primary-color);
  border-bottom: none;
  margin-top: 1.5rem;
}

/* Force horizontal layout for cards 2, 3, 4 */
body > div > div:nth-child(2),
body > div > div:nth-child(3),
body > div > div:nth-child(4) {
  display: inline-block !important;
  width: 32% !important;
  vertical-align: top !important;
  margin-right: 2% !important;
}

body > div > div:nth-child(4) {
  margin-right: 0 !important;
}

/* Clear the float after the horizontal cards */
body > div > div:nth-child(4)::after {
  content: "";
  display: table;
  clear: both;
}

/* Card headers */
h1, h2, h3, .section-title {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

/* Form elements */
input[type="text"], 
input[type="email"], 
input[type="tel"], 
input[type="number"],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

input[type="text"]:focus, 
input[type="email"]:focus, 
input[type="tel"]:focus, 
input[type="number"]:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
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
  color: var(--text-primary);
}

/* Buttons */
button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

button:active {
  transform: translateY(1px);
}

/* Social buttons */
.social-button, button.like, button.comment, button.share {
  display: inline-flex;
  align-items: center;
  background-color: transparent;
  color: var(--secondary-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
}

.social-button:hover, button.like:hover, button.comment:hover, button.share:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

/* Show Back button styling */
button.show-back {
  background-color: var(--primary-color);
  color: white;
  margin-top: 0.5rem;
}

/* Save button styling */
button[type="submit"], button.save {
  background-color: var(--success-color);
  color: white;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
}

button[type="submit"]:hover, button.save:hover {
  background-color: #0d9488;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  body > div > div:nth-child(2),
  body > div > div:nth-child(3),
  body > div > div:nth-child(4) {
    width: 100% !important;
    display: block !important;
    margin-right: 0 !important;
  }
}`}
        </style>
      </head>
      <body>{children}</body>
    </html>
  )
}
