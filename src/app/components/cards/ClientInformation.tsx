'use client';

import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';

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

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData }) => {
  const [showBusinessOverview, setShowBusinessOverview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCoverImage, setIsCoverImage] = useState(false);

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
    
    // Initialize industryType if it doesn't exist
    if (!data.industryType && data.businessType) {
      setData(prevData => ({
        ...prevData,
        industryType: prevData.businessType || ''
      }));
    }
    
    // Initialize companyWebsite if it doesn't exist
    if (!data.companyWebsite && data.businessType) {
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
        const result = reader.result as string;
        setIsCoverImage(false);
        setCropperImage(result);
        setShowCropper(true);
        // Reset cropper state
        setCrop({ x: 0, y: 0 });
        setZoom(1);
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
        const result = reader.result as string;
        setIsCoverImage(true);
        setCropperImage(result);
        setShowCropper(true);
        // Reset cropper state
        setCrop({ x: 0, y: 0 });
        setZoom(1);
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

  // Handle drop event for profile image
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIsCoverImage(false);
        setCropperImage(result);
        setShowCropper(true);
        // Reset cropper state
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = () => {
    setData(prevData => ({
      ...prevData,
      showBack: !prevData.showBack
    }));
  };

  // Cropper functions
  const onCropComplete = (_: Point, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    if (!cropperImage || !croppedAreaPixels) return;

    try {
      const canvas = document.createElement('canvas');
      const image = new Image();
      image.src = cropperImage;
      
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      // Calculate the size of the cropped image
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(
        image,
        croppedAreaPixels.x * scaleX,
        croppedAreaPixels.y * scaleY,
        croppedAreaPixels.width * scaleX,
        croppedAreaPixels.height * scaleY,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      
      const croppedImageUrl = canvas.toDataURL('image/jpeg');
      
      if (isCoverImage) {
        setData(prevData => ({
          ...prevData,
          coverImage: croppedImageUrl
        }));
      } else {
        setData(prevData => ({
          ...prevData,
          profileImage: croppedImageUrl
        }));
      }
      
      setShowCropper(false);
      setCropperImage(null);
      setCroppedAreaPixels(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (e) {
      console.error('Error creating cropped image:', e);
    }
  };

  const cancelCropping = () => {
    setShowCropper(false);
    setCropperImage(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="linkedin-card">
      {/* Image Cropper Modal */}
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div 
              style={{
                padding: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <h3 
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                Crop {isCoverImage ? 'Cover' : 'Profile'} Image
              </h3>
            </div>
            
            <div 
              style={{
                position: 'relative',
                height: '400px',
                backgroundColor: '#f3f4f6',
                flex: 1,
                overflow: 'hidden'
              }}
            >
              <Cropper
                image={cropperImage}
                crop={crop}
                zoom={zoom}
                aspect={isCoverImage ? 4 : 1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                objectFit="horizontal-cover"
                style={{
                  containerStyle: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#f3f4f6'
                  },
                  mediaStyle: {
                    display: 'block'
                  },
                  cropAreaStyle: {
                    border: '2px solid #0a66c2',
                    borderRadius: isCoverImage ? '4px' : '50%'
                  }
                }}
              />
            </div>
            
            <div 
              style={{
                padding: '16px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <label 
                  style={{
                    marginRight: '8px',
                    fontSize: '14px'
                  }}
                >
                  Zoom:
                </label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  style={{
                    width: '100px'
                  }}
                />
              </div>
              
              <div 
                style={{
                  display: 'flex',
                  gap: '8px'
                }}
              >
                <button
                  onClick={cancelCropping}
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
                  onClick={createCroppedImage}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#0a66c2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!data.showBack ? (
        <div>
          {/* LinkedIn-style cover photo - full width with 4:1 aspect ratio */}
          <div 
            className="profile-cover"
            style={{ 
              backgroundImage: data.coverImage ? `url(${data.coverImage})` : undefined
            }}
          >
            {/* Edit cover button */}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="edit-cover-btn"
              aria-label="Edit cover photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <input 
                ref={coverInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleCoverImageUpload} 
                className="hidden-input"
              />
            </button>
            
            {/* Profile picture overlapping the cover photo */}
            <div 
              className={`profile-picture ${dragActive ? 'drag-active' : ''}`}
              onClick={() => profileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
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
              <input 
                ref={profileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleProfileImageUpload} 
                className="hidden-input"
              />
            </div>
          </div>
          
          {/* Profile information section with proper spacing */}
          <div className="profile-info">
            <div className="profile-header">
              <div>
                <h1 className="profile-name">
                  {data.companyName || 'Company Name'}
                  {/* Verified badge */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0a66c2">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 20.58l9.618-12.596A11.955 11.955 0 0112 2.944z" />
                  </svg>
                </h1>
                
                <p className="profile-industry">
                  {data.industryType || 'Industry'}
                </p>
                
                {/* Location info */}
                <p className="profile-location">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  United States
                </p>
                
                {/* Connections/Contacts count */}
                <p className="profile-contacts">
                  {data.contacts && data.contacts.length > 0 
                    ? `${data.contacts.length} ${data.contacts.length === 1 ? 'contact' : 'contacts'}`
                    : 'No contacts'}
                </p>
              </div>
              
              {/* Edit button */}
              <button
                type="button"
                onClick={toggleEdit}
                className="edit-profile-btn"
              >
                Edit
              </button>
            </div>
            
            {/* Website and social links */}
            {(data.companyWebsite || data.companyFacebookURL) && (
              <div className="profile-links">
                {data.companyWebsite && (
                  <a 
                    href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Website
                  </a>
                )}
                
                {data.companyFacebookURL && (
                  <a 
                    href={data.companyFacebookURL.startsWith('http') ? data.companyFacebookURL : `https://${data.companyFacebookURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#1877f2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>
          
          {/* Section divider */}
          <div className="section-divider"></div>
          
          {/* Business Overview section */}
          <div className="business-overview">
            <div className="business-overview-header">
              <h3 className="business-overview-title">Business Overview</h3>
              <button
                type="button"
                onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                className="toggle-overview-btn"
              >
                {showBusinessOverview ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showBusinessOverview && (
              <div 
                className="business-overview-content"
                dangerouslySetInnerHTML={{ __html: data.businessDescription || 'No business overview provided.' }}
              />
            )}
          </div>
          
          {/* Button divider */}
          <div className="button-divider"></div>
          
          {/* Social interaction buttons */}
          <div className="social-buttons">
            <button className="social-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Like
            </button>
            
            <button className="social-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Comment
            </button>
            
            <button className="social-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16,6 12,2 8,6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share
            </button>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="edit-mode">
          <div className="edit-header">
            <h2 className="edit-title">Edit Profile</h2>
            <button
              type="button"
              onClick={toggleEdit}
              className="save-profile-btn"
            >
              Save
            </button>
          </div>
          
          {/* Image Upload Section */}
          <div className="image-upload-section">
            <h3 className="section-title">Profile Images</h3>
            <div className="image-upload-container">
              {/* Profile Image Upload */}
              <div className="profile-upload">
                <label className="upload-label">Profile Picture</label>
                <div 
                  className={`profile-upload-area ${dragActive ? 'drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => profileInputRef.current?.click()}
                >
                  {data.profileImage ? (
                    <div 
                      className="upload-preview" 
                      style={{ backgroundImage: `url(${data.profileImage})` }}
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  <input 
                    ref={profileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileImageUpload} 
                    className="hidden-input"
                  />
                </div>
              </div>
              
              {/* Cover Image Upload */}
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
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
          </div>
          
          {/* Company Information */}
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
                <label className="form-label">Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={data.companyWebsite || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Facebook URL</label>
                <input
                  type="url"
                  name="companyFacebookURL"
                  value={data.companyFacebookURL || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://facebook.com/company"
                />
              </div>
            </div>
          </div>
          
          {/* Contacts Section */}
          <div className="contacts-section">
            <div className="contacts-header">
              <h3 className="section-title">Contacts</h3>
              {(data.contacts || []).length < 5 && (
                <button
                  type="button"
                  onClick={addContact}
                  className="add-contact-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Contact
                </button>
              )}
            </div>
            
            {data.contacts && data.contacts.length > 0 ? (
              <div className="contacts-list">
                {data.contacts.map((contact, index) => (
                  <div key={index} className="contact-item">
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="remove-contact-btn"
                      aria-label="Remove contact"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    
                    <div className="contact-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            value={contact.name}
                            onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                            className="form-input"
                            placeholder="Contact name"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            value={contact.title}
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
                            value={contact.email}
                            onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                            className="form-input"
                            placeholder="email@example.com"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Mobile</label>
                          <input
                            type="tel"
                            value={contact.mobile}
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
            ) : (
              <div className="no-contacts">
                <p className="no-contacts-text">No contacts added yet</p>
                <button
                  type="button"
                  onClick={addContact}
                  className="add-first-contact-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Contact
                </button>
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
                placeholder="Enter business overview..."
                rows={6}
              />
            </div>
          </div>
          
          {/* Save Button */}
          <div className="save-container">
            <button
              type="button"
              onClick={toggleEdit}
              className="save-profile-btn-large"
            >
              Save Client Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInformation;

