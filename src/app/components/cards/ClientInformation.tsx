'use client';

import React, { useState, useRef, useEffect } from 'react';

// Define proper TypeScript interfaces
export interface ContactType {
  name: string;
  email: string;
  mobile: string;
  title: string;
}

export interface ClientDataType {
  companyName: string;
  companyWebsite: string;
  companyFacebookURL: string;
  facebookAdLibraryURL: string;
  instagramURL: string;
  phoenixURL: string;
  yearsInBusiness: string;
  industryType: string;
  contacts: ContactType[];
  businessDescription: string;
  showBack: boolean;
  profileImage?: string;
  coverImage?: string;
  
  // Legacy fields for backward compatibility
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactTitle?: string;
  businessType?: string;
}

interface ClientInformationProps {
  data: ClientDataType;
  setData: React.Dispatch<React.SetStateAction<ClientDataType>>;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData }) => {
  const [showBusinessOverview, setShowBusinessOverview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Custom cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [isCoverImage, setIsCoverImage] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Initialize contacts array if it doesn't exist (for backward compatibility)
  useEffect(() => {
    if (!data.contacts) {
      // Convert legacy contact data to new format if it exists
      if (data.contactName || data.contactEmail || data.contactPhone || data.contactTitle) {
        setData(prevData => ({
          ...prevData,
          contacts: [{
            name: prevData.contactName || '',
            email: prevData.contactEmail || '',
            mobile: prevData.contactPhone || '',
            title: prevData.contactTitle || ''
          }],
          // Keep legacy fields for backward compatibility
          contactName: prevData.contactName,
          contactEmail: prevData.contactEmail,
          contactPhone: prevData.contactPhone,
          contactTitle: prevData.contactTitle
        }));
      } else {
        // Initialize with empty contacts array
        setData(prevData => ({
          ...prevData,
          contacts: []
        }));
      }
    }
    
    // Initialize new fields if they don't exist
    if (!data.facebookAdLibraryURL) {
      setData(prevData => ({
        ...prevData,
        facebookAdLibraryURL: ''
      }));
    }
    
    if (!data.instagramURL) {
      setData(prevData => ({
        ...prevData,
        instagramURL: ''
      }));
    }
    
    if (!data.phoenixURL) {
      setData(prevData => ({
        ...prevData,
        phoenixURL: ''
      }));
    }
    
    if (!data.yearsInBusiness) {
      setData(prevData => ({
        ...prevData,
        yearsInBusiness: ''
      }));
    }
    
    // Initialize industryType if it doesn't exist
    if (!data.industryType && data.businessType) {
      setData(prevData => ({
        ...prevData,
        industryType: prevData.businessType || ''
      }));
    }
    
    // Initialize companyWebsite if it doesn't exist
    if (!data.companyWebsite) {
      setData(prevData => ({
        ...prevData,
        companyWebsite: ''
      }));
    }
  }, [data, setData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleBusinessOverviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prevData => ({
      ...prevData,
      businessDescription: e.target.value
    }));
  };

  const handleContactChange = (index: number, field: keyof ContactType, value: string) => {
    setData(prevData => {
      const updatedContacts = [...(prevData.contacts || [])];
      if (!updatedContacts[index]) {
        updatedContacts[index] = { name: '', email: '', mobile: '', title: '' };
      }
      updatedContacts[index] = { ...updatedContacts[index], [field]: value };
      
      // Also update legacy fields if this is the first contact (for backward compatibility)
      const legacyUpdates = index === 0 ? {
        contactName: field === 'name' ? value : prevData.contactName,
        contactEmail: field === 'email' ? value : prevData.contactEmail,
        contactPhone: field === 'mobile' ? value : prevData.contactPhone,
        contactTitle: field === 'title' ? value : prevData.contactTitle
      } : {};
      
      return {
        ...prevData,
        contacts: updatedContacts,
        ...legacyUpdates
      };
    });
  };

  const addContact = () => {
    if ((data.contacts || []).length < 5) {
      setData(prevData => ({
        ...prevData,
        contacts: [...(prevData.contacts || []), { name: '', email: '', mobile: '', title: '' }]
      }));
    }
  };
  
  const removeContact = (index: number) => {
    setData(prevData => {
      const updatedContacts = [...(prevData.contacts || [])];
      updatedContacts.splice(index, 1);
      
      // If removing the first contact, update legacy fields to empty or next contact
      const legacyUpdates = index === 0 ? {
        contactName: updatedContacts[0]?.name || '',
        contactEmail: updatedContacts[0]?.email || '',
        contactPhone: updatedContacts[0]?.mobile || '',
        contactTitle: updatedContacts[0]?.title || ''
      } : {};
      
      return {
        ...prevData,
        contacts: updatedContacts,
        ...legacyUpdates
      };
    });
  };

  // Handle profile image upload
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsCoverImage(false);
        setCropperImage(reader.result as string);
        setShowCropper(true);
        setCropArea({ x: 50, y: 50, width: 200, height: 200 }); // Square crop for profile
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsCoverImage(true);
        setCropperImage(reader.result as string);
        setShowCropper(true);
        setCropArea({ x: 50, y: 50, width: 400, height: 100 }); // 4:1 ratio for cover
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events for profile image
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsCoverImage(false);
        setCropperImage(reader.result as string);
        setShowCropper(true);
        setCropArea({ x: 50, y: 50, width: 200, height: 200 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom cropper functions
  const handleCropMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropArea.x, y: e.clientY - cropArea.y });
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(500 - cropArea.width, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(400 - cropArea.height, e.clientY - dragStart.y));
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    }
  };

  const handleCropMouseUp = () => {
    setIsDragging(false);
  };

  const applyCrop = () => {
    if (!cropperImage) return;

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate scale factors
      const scaleX = img.width / 500; // 500 is our display width
      const scaleY = img.height / 400; // 400 is our display height

      // Set canvas size to crop area
      canvas.width = cropArea.width * scaleX;
      canvas.height = cropArea.height * scaleY;

      // Draw the cropped image
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      if (isCoverImage) {
        setData(prevData => ({ ...prevData, coverImage: croppedImageUrl }));
      } else {
        setData(prevData => ({ ...prevData, profileImage: croppedImageUrl }));
      }
      
      setShowCropper(false);
      setCropperImage(null);
    };
    img.src = cropperImage;
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setCropperImage(null);
  };

  const toggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const saveProfile = () => {
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <div style={{ marginTop: 0, paddingTop: 0 }} className="linkedin-card">
        <div className="edit-mode">
          <div className="edit-header">
            <h2 className="edit-title">Edit Profile</h2>
            <button onClick={saveProfile} className="save-profile-btn">
              Save
            </button>
          </div>

          {/* Image Upload Section */}
          <div className="image-upload-section">
            <h3 className="section-title">Profile Images</h3>
            <div className="image-upload-container">
              <div className="profile-upload">
                <label className="upload-label">Profile Picture</label>
                <div 
                  className={`profile-upload-area ${dragActive ? 'drag-active' : ''}`}
                  onClick={() => profileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {data.profileImage ? (
                    <div 
                      className="upload-preview"
                      style={{ backgroundImage: `url(${data.profileImage})` }}
                    />
                  ) : (
                    <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </div>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden-input"
                />
              </div>
              
              <div className="cover-upload">
                <label className="upload-label">Cover Photo</label>
                <div 
                  className="cover-upload-area"
                  onClick={() => coverInputRef.current?.click()}
                >
                  {data.coverImage ? (
                    <div 
                      className="upload-preview cover-preview"
                      style={{ backgroundImage: `url(${data.coverImage})` }}
                    />
                  ) : (
                    <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden-input"
                />
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          <div className="company-info-section">
            <h3 className="section-title">Company Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={data.companyName || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter company name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Industry Type</label>
                <input
                  type="text"
                  name="industryType"
                  value={data.industryType || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter industry type"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Website</label>
                <input
                  type="text"
                  name="companyWebsite"
                  value={data.companyWebsite || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://www.example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Facebook URL</label>
                <input
                  type="text"
                  name="companyFacebookURL"
                  value={data.companyFacebookURL || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://facebook.com/yourcompany"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Facebook Ad Library URL</label>
                <input
                  type="text"
                  name="facebookAdLibraryURL"
                  value={data.facebookAdLibraryURL || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://www.facebook.com/ads/library/"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram URL</label>
                <input
                  type="text"
                  name="instagramURL"
                  value={data.instagramURL || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://instagram.com/yourcompany"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phoenix URL</label>
                <input
                  type="text"
                  name="phoenixURL"
                  value={data.phoenixURL || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://phoenix.example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Years in Business</label>
                <input
                  type="text"
                  name="yearsInBusiness"
                  value={data.yearsInBusiness || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 5 years"
                />
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="contacts-section">
            <div className="contacts-header">
              <h3 className="section-title">Contacts</h3>
              {(data.contacts || []).length < 5 && (
                <button onClick={addContact} className="add-contact-btn">
                  <span>+</span> Add Contact
                </button>
              )}
            </div>
            
            {(data.contacts || []).length === 0 ? (
              <div className="no-contacts">
                <p className="no-contacts-text">No contacts added yet</p>
                <button onClick={addContact} className="add-first-contact-btn">
                  <span>+</span> Add First Contact
                </button>
              </div>
            ) : (
              <div className="contacts-list">
                {(data.contacts || []).map((contact, index) => (
                  <div key={index} className="contact-item">
                    <button 
                      onClick={() => removeContact(index)}
                      className="remove-contact-btn"
                    >
                      ×
                    </button>
                    <div className="contact-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            value={contact.name || ''}
                            onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                            className="form-input"
                            placeholder="Contact name"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            value={contact.title || ''}
                            onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                            className="form-input"
                            placeholder="Job title"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            value={contact.email || ''}
                            onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                            className="form-input"
                            placeholder="email@example.com"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Mobile</label>
                          <input
                            type="tel"
                            value={contact.mobile || ''}
                            onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                            className="form-input"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Business Overview Section */}
          <div className="business-overview-section">
            <h3 className="section-title">Business Overview</h3>
            <div className="textarea-container">
              <textarea
                value={data.businessDescription || ''}
                onChange={handleBusinessOverviewChange}
                className="business-overview-textarea"
                placeholder="Enter a detailed description of your business, services, and what makes you unique..."
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="save-container">
            <button onClick={saveProfile} className="save-profile-btn-large">
              Save Profile
            </button>
          </div>
        </div>

        {/* Custom Image Cropper Modal */}
        {showCropper && cropperImage && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                maxWidth: '600px',
                width: '90%'
              }}
            >
              <h3 style={{ marginBottom: '16px' }}>
                {isCoverImage ? 'Crop Cover Photo' : 'Crop Profile Picture'}
              </h3>
              
              <div 
                style={{
                  position: 'relative',
                  width: '500px',
                  height: '400px',
                  border: '1px solid #ccc',
                  overflow: 'hidden',
                  margin: '0 auto 20px'
                }}
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={cropperImage} 
                  alt="Crop preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    userSelect: 'none'
                  }}
                  draggable={false}
                />
                
                {/* Crop overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                  }}
                />
                
                {/* Crop selection area */}
                <div 
                  style={{
                    position: 'absolute',
                    left: `${cropArea.x}px`,
                    top: `${cropArea.y}px`,
                    width: `${cropArea.width}px`,
                    height: `${cropArea.height}px`,
                    border: '2px solid #0066cc',
                    backgroundColor: 'transparent',
                    cursor: 'move'
                  }}
                  onMouseDown={handleCropMouseDown}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={cancelCrop}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f3f4f6',
                      color: '#4b5563',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={applyCrop}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#0066cc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // View Mode
  return (
    <div style={{ marginTop: 0, paddingTop: 0 }} className="linkedin-card">
      {/* Cover Photo */}
      <div 
        className="profile-cover"
        style={{
          backgroundImage: data.coverImage ? `url(${data.coverImage})` : undefined,
          marginTop: 0,
          paddingTop: 0
        }}
      >
        <button onClick={toggleEdit} className="edit-cover-btn">
          ✏️
        </button>
        
        {/* Profile Picture */}
        <div className="profile-picture">
          {data.profileImage ? (
            <div 
              className="profile-image"
              style={{ backgroundImage: `url(${data.profileImage})` }}
            />
          ) : (
            <div className="profile-initial">
              {data.companyName ? data.companyName.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="profile-info">
        <div className="profile-header">
          <div>
            <h1 className="profile-name">
              {data.companyName || 'Company Name'} 
              <span style={{ color: '#0a66c2', fontSize: '16px' }}>✓</span>
            </h1>
            <p className="profile-industry">{data.industryType || 'Industry'}</p>
            <p className="profile-location">
              📍 {data.industryType ? 'United States' : 'Location'}
            </p>
            <p className="profile-contacts">
              {(data.contacts || []).length} contact{(data.contacts || []).length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={toggleEdit} className="edit-profile-btn">
            Edit
          </button>
        </div>

        {/* Links */}
        <div className="profile-links">
          {data.companyWebsite && (
            <a href={data.companyWebsite} className="profile-link" target="_blank" rel="noopener noreferrer">
              🌐 Website
            </a>
          )}
          {data.companyFacebookURL && (
            <a href={data.companyFacebookURL} className="profile-link" target="_blank" rel="noopener noreferrer">
              📘 Facebook
            </a>
          )}
          {data.instagramURL && (
            <a href={data.instagramURL} className="profile-link" target="_blank" rel="noopener noreferrer">
              📷 Instagram
            </a>
          )}
          {data.facebookAdLibraryURL && (
            <a href={data.facebookAdLibraryURL} className="profile-link" target="_blank" rel="noopener noreferrer">
              📊 Ad Library
            </a>
          )}
          {data.phoenixURL && (
            <a href={data.phoenixURL} className="profile-link" target="_blank" rel="noopener noreferrer">
              🔥 Phoenix
            </a>
          )}
        </div>

        {data.yearsInBusiness && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              <strong>Years in Business:</strong> {data.yearsInBusiness}
            </p>
          </div>
        )}

        <div className="section-divider" />

        {/* Business Overview */}
        <div className="business-overview">
          <div className="business-overview-header">
            <h3 className="business-overview-title">Business Overview</h3>
            <button 
              onClick={() => setShowBusinessOverview(!showBusinessOverview)}
              className="toggle-overview-btn"
            >
              {showBusinessOverview ? 'Hide' : 'Show'}
            </button>
          </div>
          {showBusinessOverview && (
            <div className="business-overview-content">
              {data.businessDescription || 'No business overview available.'}
            </div>
          )}
        </div>

        <div className="button-divider" />

        {/* Social Buttons */}
        <div className="social-buttons">
          <button className="social-button">
            👍 Like
          </button>
          <button className="social-button">
            💬 Comment
          </button>
          <button className="social-button">
            📤 Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;

