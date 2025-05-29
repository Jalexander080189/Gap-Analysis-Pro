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
/* Social Media Style for Gap Analysis Pro */

/* Base styles */
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
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05 );
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius: 0.75rem; /* More rounded corners */
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

/* Main container with side margins */
body > div {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 4rem; /* Increased side padding */
}

/* Card styling - social media post look */
div[id^="card-"], 
div[id*=" card-"],
div:has(> h1),
div:has(> h2),
div:has(> h3),
div:has(> button.show-back) {
  background-color: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  position: relative;
  border: 1px solid var(--border-color);
  transition: box-shadow 0.3s ease;
}

div[id^="card-"]:hover, 
div[id*=" card-"]:hover,
div:has(> h1):hover,
div:has(> h2):hover,
div:has(> h3):hover,
div:has(> button.show-back):hover {
  box-shadow: var(--shadow-lg);
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

/* LinkedIn-style profile card (Card 1) */
body > div > div:first-child {
  background-color: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

/* Profile header/banner */
body > div > div:first-child::before {
  content: "";
  display: block;
  height: 80px;
  background-color: var(--primary-color);
  margin-bottom: 1rem;
}

/* Profile content */
body > div > div:first-child > div {
  padding: 0 1.5rem 1.5rem;
}

/* Profile sections */
body > div > div:first-child h2 {
  font-size: 1.25rem;
  color: var(--primary-color);
  border-bottom: none;
  margin-top: 1.5rem;
}

/* Horizontal layout for cards 2, 3, 4 */
body > div > div:nth-child(2),
body > div > div:nth-child(3),
body > div > div:nth-child(4) {
  width: calc(33.333% - 1rem);
  display: inline-block;
  vertical-align: top;
  margin-right: 1.5rem;
  box-sizing: border-box;
}

body > div > div:nth-child(4) {
  margin-right: 0;
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
  transition: background-color 0.3s ease, transform 0.1s ease;
}

button:hover {
  background-color: var(--primary-hover);
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  transition: background-color 0.3s ease, color 0.3s ease;
}

.social-button:hover, button.like:hover, button.comment:hover, button.share:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

/* Sliders */
input[type="range"] {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--border-color);
  outline: none;
  -webkit-appearance: none;
  margin: 0.5rem 0 1rem 0;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-sm);
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  border-radius: var(--radius);
  overflow: hidden;
}

th {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--text-primary);
  font-weight: 600;
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid var(--border-color);
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  body > div {
    padding: 1rem 2rem;
  }
  
  body > div > div:nth-child(2),
  body > div > div:nth-child(3),
  body > div > div:nth-child(4) {
    width: 100%;
    display: block;
    margin-right: 0;
  }
}

/* Show Back button styling */
button.show-back {
  background-color: var(--primary-color);
  color: white;
  margin-top: 0.5rem;
}

/* Add some spacing between social buttons and show back button */
div:has(> button.show-back) {
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
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  )
}
