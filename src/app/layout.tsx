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

/* OPTIMAL WIDTH WITH SIDE MARGINS */
html body > div,
body > div,
div[data-reactroot] > div,
#__next > div,
main > div {
  max-width: 1200px !important;
  width: 1200px !important;
  margin: 0 auto !important;
  padding: 2rem 3rem !important;
  box-sizing: border-box !important;
}

/* Additional fallback for any container */
body > div:first-child {
  max-width: 1200px !important;
  width: 1200px !important;
  margin: 0 auto !important;
  padding: 2rem 3rem !important;
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

/* LinkedIn-style profile card (Card 1) - REMOVE ALL SPACING */
body > div > div:first-child {
  padding: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 1.5rem !important;
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

/* Cards 2, 3, 4 horizontal layout */
body > div > div:nth-child(2),
body > div > div:nth-child(3),
body > div > div:nth-child(4) {
  width: 32% !important;
  display: inline-block !important;
  margin-right: 2% !important;
  vertical-align: top !important;
}

body > div > div:nth-child(4) {
  margin-right: 0 !important;
}

/* Form styling */
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

/* Secondary buttons */
.btn-secondary {
  background-color: var(--secondary-color);
}

.btn-secondary:hover {
  background-color: #475569;
}

/* Success buttons */
.btn-success {
  background-color: var(--success-color);
}

.btn-success:hover {
  background-color: #059669;
}

/* Danger buttons */
.btn-danger {
  background-color: var(--danger-color);
}

.btn-danger:hover {
  background-color: #dc2626;
}

/* Warning buttons */
.btn-warning {
  background-color: var(--warning-color);
}

.btn-warning:hover {
  background-color: #d97706;
}

/* Card headers */
h1, h2, h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.875rem;
  font-weight: 700;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

/* LinkedIn Profile Card Styles - REMOVE TOP SPACING */
.linkedin-card {
  margin-bottom: 24px !important;
  margin-top: 0 !important;
  padding-top: 0 !important;
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

.cropper-content {
  position: relative;
  height: 400px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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

/* Profile View - REMOVE TOP SPACING */
.profile-cover {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 25%; /* 4:1 aspect ratio */
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  background-size: cover;
  background-position: center;
  margin-top: 0 !important;
  padding-top: 0 !important;
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
  font-size: 24px;
  font-weight: bold;
  color: #6b7280;
  background-color: #f9fafb;
}

.hidden-input {
  display: none;
}

.profile-info {
  padding: 48px 24px 24px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-industry {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.profile-location {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-contacts {
  font-size: 14px;
  color: #0a66c2;
  margin: 0;
}

.edit-profile-btn {
  padding: 8px 16px;
  background-color: transparent;
  color: #0a66c2;
  border: 1px solid #0a66c2;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-profile-btn:hover {
  background-color: #0a66c2;
  color: white;
  transform: none;
}

.profile-links {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #0a66c2;
  text-decoration: none;
  font-size: 14px;
}

.profile-link:hover {
  text-decoration: underline;
}

.section-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 16px 0;
}

.business-overview {
  margin-bottom: 16px;
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
  color: #1f2937;
  margin: 0;
}

.toggle-overview-btn {
  padding: 4px 8px;
  background-color: transparent;
  color: #0a66c2;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.toggle-overview-btn:hover {
  background-color: #f3f4f6;
  transform: none;
}

.business-overview-content {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  padding: 12px 0;
}

.button-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 16px 0;
}

.social-buttons {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
}

.social-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: transparent;
  color: #6b7280;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.social-button:hover {
  background-color: #f3f4f6;
  color: #374151;
  transform: none;
}

/* Edit Mode Styles */
.edit-mode {
  padding: 24px;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.edit-title {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.save-profile-btn {
  padding: 8px 16px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.save-profile-btn:hover {
  background-color: #084c94;
  transform: none;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.image-upload-section {
  margin-bottom: 32px;
}

.image-upload-container {
  display: flex;
  gap: 24px;
}

.profile-upload, .cover-upload {
  flex: 1;
}

.upload-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.profile-upload-area, .cover-upload-area {
  width: 100%;
  height: 120px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.profile-upload-area:hover, .cover-upload-area:hover {
  border-color: #0a66c2;
  background-color: #f8fafc;
}

.profile-upload-area.drag-active {
  border-color: #0a66c2;
  background-color: #eff6ff;
}

.upload-preview {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.cover-preview {
  background-size: cover;
}

.upload-icon {
  width: 32px;
  height: 32px;
  color: #9ca3af;
}

.company-info-section {
  margin-bottom: 32px;
}

.form-row {
  display: flex;
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
  color: #374151;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 0;
}

.form-input:focus {
  outline: none;
  border-color: #0a66c2;
  box-shadow: 0 0 0 2px rgba(10, 102, 194, 0.2);
}

.contacts-section {
  margin-bottom: 32px;
}

.contacts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.add-contact-btn, .add-first-contact-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.add-contact-btn:hover, .add-first-contact-btn:hover {
  background-color: #084c94;
  transform: none;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  position: relative;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f9fafb;
}

.remove-contact-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.remove-contact-btn:hover {
  background-color: #dc2626;
  transform: none;
}

.contact-form {
  margin-right: 32px;
}

.no-contacts {
  text-align: center;
  padding: 32px;
  color: #6b7280;
}

.no-contacts-text {
  margin-bottom: 16px;
  font-size: 14px;
}

.business-overview-section {
  margin-bottom: 32px;
}

.textarea-container {
  margin-top: 8px;
}

.business-overview-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 0;
}

.business-overview-textarea:focus {
  outline: none;
  border-color: #0a66c2;
  box-shadow: 0 0 0 2px rgba(10, 102, 194, 0.2);
}

.save-container {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.save-profile-btn-large {
  padding: 12px 32px;
  background-color: #0a66c2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.save-profile-btn-large:hover {
  background-color: #084c94;
  transform: none;
}

@media (max-width: 768px) {
  /* Reduce side padding on mobile and allow responsive width */
  html body > div,
  body > div,
  div[data-reactroot] > div,
  #__next > div,
  main > div {
    max-width: 100% !important;
    width: 100% !important;
    padding: 1rem 1.5rem !important;
  }
  
  body > div:first-child {
    max-width: 100% !important;
    width: 100% !important;
    padding: 1rem 1.5rem !important;
  }
  
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
      <body>
        {children}
      </body>
    </html>
  )
}

