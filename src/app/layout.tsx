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
}

/* LinkedIn Profile Card Styles */
.linkedin-card {
  margin-bottom: 24px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

/* Cropper Modal */
.cropper-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cropper-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cropper-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.cropper-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.cropper-content {
  position: relative;
  height: 400px;
  background-color: #f3f4f6;
  flex: 1;
}

.cropper-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
}

.cropper-zoom {
  display: flex;
  align-items: center;
}

.cropper-zoom-label {
  margin-right: 8px;
  font-size: 14px;
}

.cropper-zoom-slider {
  width: 100px;
}

.cropper-actions {
  display: flex;
  gap: 8px;
}

.cropper-cancel-btn {
  padding: 8px 16px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cropper-apply-btn {
  padding: 8px 16px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Profile View */
.profile-cover {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 25%; /* 4:1 aspect ratio */
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  background-size: cover;
  background-position: center;
}

.edit-cover-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.profile-picture {
  position: absolute;
  left: 24px;
  bottom: -32px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f3f4f6;
  border: 3px solid white;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

.profile-picture.drag-active {
  background-color: #eff6ff;
}

.profile-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.profile-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: #6b7280;
  background-color: #e5e7eb;
}

.profile-info {
  padding-top: 40px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 16px;
  background-color: white;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.profile-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-industry {
  font-size: 14px;
  margin: 4px 0 0;
  color: #4b5563;
}

.profile-location {
  font-size: 14px;
  margin: 4px 0 0;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-contacts {
  font-size: 14px;
  margin: 8px 0 0;
  color: #0a66c2;
  font-weight: 600;
}

.edit-profile-btn {
  padding: 6px 16px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.profile-links {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  font-size: 14px;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #0a66c2;
  text-decoration: none;
  font-weight: 500;
}

.section-divider {
  height: 8px;
  background-color: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.business-overview {
  padding: 16px 24px;
  background-color: white;
}

.business-overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.business-overview-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.toggle-overview-btn {
  font-size: 14px;
  color: #0a66c2;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.business-overview-content {
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 4px;
  margin-top: 8px;
  border: 1px solid #e5e7eb;
}

.button-divider {
  height: 1px;
  background-color: #e5e7eb;
}

.social-buttons {
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  background-color: white;
}

.social-button {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.social-button:hover {
  background-color: #f3f4f6;
}

/* Edit Mode */
.edit-mode {
  padding: 24px;
  background-color: white;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.edit-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #111827;
}

.save-profile-btn {
  padding: 8px 20px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.image-upload-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #111827;
}

.image-upload-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.profile-upload {
  flex: 0 0 auto;
}

.cover-upload {
  flex: 1;
}

.upload-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #4b5563;
}

.profile-upload-area {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  cursor: pointer;
  overflow: hidden;
}

.profile-upload-area.drag-active {
  background-color: #eff6ff;
}

.cover-upload-area {
  width: 100%;
  height: 0;
  padding-bottom: 25%;
  border: 1px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.upload-preview {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.cover-preview {
  position: absolute;
  top: 0;
  left: 0;
}

.upload-icon {
  width: 32px;
  height: 32px;
  color: #9ca3af;
}

.hidden-input {
  display: none;
}

.company-info-section {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #4b5563;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  outline: none;
}

.contacts-section {
  margin-bottom: 24px;
}

.contacts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.add-contact-btn {
  padding: 6px 16px;
  font-size: 14px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  position: relative;
  border: 1px solid #e5e7eb;
}

.remove-contact-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #ef4444;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.contact-form {
  margin-top: 8px;
}

.no-contacts {
  background-color: #f9fafb;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.no-contacts-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.add-first-contact-btn {
  padding: 8px 20px;
  font-size: 14px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.business-overview-section {
  margin-bottom: 24px;
}

.textarea-container {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  overflow: hidden;
}

.business-overview-textarea {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: none;
  outline: none;
  resize: vertical;
  font-family: inherit;
}

.save-container {
  text-align: center;
}

.save-profile-btn-large {
  padding: 10px 32px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}`}
        </style>
      </head>
      <body>{children}</body>
    </html>
  )
}

