/* Updated styles for Gap Analysis Pro with horizontal card layout */

/* Base styles */
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --background-color: #f8fafc;
  --card-background: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius: 0.375rem;
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
}

/* Card styling */
div[id^="card-"], 
div[id*=" card-"],
div:has(> h1),
div:has(> h2),
div:has(> h3) {
  background-color: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  position: relative;
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

/* Horizontal layout for cards 2, 3, 4 */
.horizontal-cards {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.horizontal-cards > div {
  flex: 1;
  min-width: 0; /* Prevents flex items from overflowing */
}

/* Apply horizontal layout to specific cards */
body > div > div:nth-child(2),
body > div > div:nth-child(3),
body > div > div:nth-child(4) {
  width: calc(33.333% - 1rem);
  display: inline-block;
  vertical-align: top;
  margin-right: 1rem;
}

body > div > div:nth-child(4) {
  margin-right: 0;
}

/* Clear the float after the horizontal cards */
body > div > div:nth-child(4)::after {
  content: "";
  display: table;
  clear: both;
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
}

button:hover {
  background-color: var(--primary-hover);
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
