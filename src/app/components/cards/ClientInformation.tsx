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
  facebookAdLibraryURL?: string;
  instagramURL?: string;
  companyAddress?: string;
  phoenixURL?: string;
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
  mode: "leadgen" | "retail";
  setMode: React.Dispatch<React.SetStateAction<"leadgen" | "retail">>;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData, mode, setMode }) => {
  const [showBusinessOverview, setShowBusinessOverview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Custom cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [isCoverImage, setIsCoverImage] = useState(false);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

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

  const handleModeChange = (newMode: "leadgen" | "retail") => {
    setMode(newMode);
  };

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
        
        // Load image to get dimensions
        const img = new window.Image();
        img.onload = () => {
          const containerWidth = 600;
          const containerHeight = 400;
          const aspectRatio = img.width / img.height;
          
          let displayWidth = containerWidth;
          let displayHeight = containerWidth / aspectRatio;
          
          if (displayHeight > containerHeight) {
            displayHeight = containerHeight;
            displayWidth = containerHeight * aspectRatio;
          }
          
          setImageSize({ width: displayWidth, height: displayHeight });
          
          // Set initial crop size (square for profile)
          const cropSizeValue = Math.min(displayWidth, displayHeight) * 0.6;
          setCropSize({ width: cropSizeValue, height: cropSizeValue });
          setCropPosition({ 
            x: (displayWidth - cropSizeValue) / 2, 
            y: (displayHeight - cropSizeValue) / 2 
          });
        };
        img.src = result;
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
        
        // Load image to get dimensions
        const img = new window.Image();
        img.onload = () => {
          const containerWidth = 600;
          const containerHeight = 400;
          const aspectRatio = img.width / img.height;
          
          let displayWidth = containerWidth;
          let displayHeight = containerWidth / aspectRatio;
          
          if (displayHeight > containerHeight) {
            displayHeight = containerHeight;
            displayWidth = containerHeight * aspectRatio;
          }
          
          setImageSize({ width: displayWidth, height: displayHeight });
          
          // Set initial crop size (4:1 aspect ratio for cover)
          const cropHeight = displayHeight * 0.6;
          const cropWidth = cropHeight * 4;
          setCropSize({ width: Math.min(cropWidth, displayWidth), height: cropHeight });
          setCropPosition({ 
            x: (displayWidth - Math.min(cropWidth, displayWidth)) / 2, 
            y: (displayHeight - cropHeight) / 2 
          });
        };
        img.src = result;
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

  // Custom cropper functions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropPosition.x,
      y: e.clientY - cropPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(imageSize.width - cropSize.width, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(imageSize.height - cropSize.height, e.clientY - dragStart.y));
    
    setCropPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const createCroppedImage = () => {
    if (!cropperImage || !imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    
    // Calculate scale factors
    const scaleX = img.naturalWidth / imageSize.width;
    const scaleY = img.naturalHeight / imageSize.height;
    
    // Set canvas size to crop size
    canvas.width = cropSize.width * scaleX;
    canvas.height = cropSize.height * scaleY;
    
    // Draw the cropped portion
    ctx.drawImage(
      img,
      cropPosition.x * scaleX,
      cropPosition.y * scaleY,
      cropSize.width * scaleX,
      cropSize.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    
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
    
    cancelCropping();
  };

  const cancelCropping = () => {
    setShowCropper(false);
    setCropperImage(null);
    setCropPosition({ x: 0, y: 0 });
    setCropSize({ width: 200, height: 200 });
    setImageSize({ width: 0, height: 0 });
    setIsDragging(false);
  };

  return (
    <div className="linkedin-card" style={{ marginTop: 0, paddingTop: 0 }}>
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
              maxWidth: '700px',
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
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                Drag the selection area to position your crop
              </p>
            </div>
            
            <div 
              style={{
                position: 'relative',
                height: '450px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Image */}
              <div
                style={{
                  position: 'relative',
                  width: imageSize.width,
                  height: imageSize.height
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={cropperImage}
                  alt="Crop preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                />
                
                {/* Crop overlay */}
                <div
                  style={{
                    position: 'absolute',
                    left: cropPosition.x,
                    top: cropPosition.y,
                    width: cropSize.width,
                    height: cropSize.height,
                    border: '2px solid #0a66c2',
                    borderRadius: isCoverImage ? '4px' : '50%',
                    cursor: 'move',
                    backgroundColor: 'rgba(10, 102, 194, 0.1)',
                    boxSizing: 'border-box'
                  }}
                  onMouseDown={handleMouseDown}
                />
                
                {/* Dark overlay for non-cropped areas */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    pointerEvents: 'none'
                  }}
                />
                
                {/* Clear area for crop selection */}
                <div
                  style={{
                    position: 'absolute',
                    left: cropPosition.x,
                    top: cropPosition.y,
                    width: cropSize.width,
                    height: cropSize.height,
                    backgroundColor: 'transparent',
                    borderRadius: isCoverImage ? '4px' : '50%',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Zoom:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value="1"
                  style={{ width: '100px' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
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
        <>
          {/* Cover Photo */}
          <div 
            className="profile-cover"
            style={{
              backgroundImage: data.coverImage ? `url(${data.coverImage})` : undefined,
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <button 
              className="edit-cover-btn"
              onClick={() => coverInputRef.current?.click()}
              title="Edit cover photo"
            >
              📷
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden-input"
            />
          </div>

          {/* Profile Picture - FIXED POSITIONING */}
          <div 
            className={`profile-picture ${dragActive ? 'drag-active' : ''}`}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '-60px',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid white',
              backgroundColor: 'white',
              zIndex: '20',
              overflow: 'hidden'
            }}
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

          {/* Profile Information */}
          <div className="profile-info" style={{ marginTop: '60px' }}>
            <div className="profile-header">
              <div>
                <h1 className="profile-name">
                  {data.companyName || 'Company Name'}
                  <span style={{ fontSize: '14px', color: '#0a66c2', marginLeft: '8px' }}>
                    ●
                  </span>
                </h1>
                <p className="profile-industry">
                  {data.industryType || 'Industry Type'}
                </p>
                <p className="profile-location">
                  📍 {data.companyAddress || 'United States'}
                </p>
                <p className="profile-contacts">
                  {(data.contacts || []).length} contacts
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Lead Gen/Retail Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                    Mode:
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleModeChange('leadgen')}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: mode === 'leadgen' ? '#0a66c2' : '#f3f4f6',
                        color: mode === 'leadgen' ? 'white' : '#6b7280',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Lead Gen
                    </button>
                    <button
                      onClick={() => handleModeChange('retail')}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: mode === 'retail' ? '#0a66c2' : '#f3f4f6',
                        color: mode === 'retail' ? 'white' : '#6b7280',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Retail
                    </button>
                  </div>
                </div>
                <button 
                  onClick={toggleEdit}
                  className="edit-profile-btn"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Profile Links */}
            <div className="profile-links">
              {data.companyWebsite && (
                <a 
                  href={data.companyWebsite.startsWith('http' ) ? data.companyWebsite : `https://${data.companyWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  🌐 Website
                </a>
               )}
              {data.companyFacebookURL && (
                <a 
                  href={data.companyFacebookURL.startsWith('http' ) ? data.companyFacebookURL : `https://${data.companyFacebookURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  📱 Facebook
                </a>
               )}
              {data.instagramURL && (
                <a 
                  href={data.instagramURL.startsWith('http' ) ? data.instagramURL : `https://${data.instagramURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  📸 Instagram
                </a>
               )}
              {data.facebookAdLibraryURL && (
                <a 
                  href={data.facebookAdLibraryURL.startsWith('http' ) ? data.facebookAdLibraryURL : `https://${data.facebookAdLibraryURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  📊 Ad Library
                </a>
               )}
              {data.phoenixURL && (
                <a 
                  href={data.phoenixURL.startsWith('http' ) ? data.phoenixURL : `https://${data.phoenixURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  🔍 Phoenix
                </a>
               )}
            </div>

            <div className="section-divider"></div>

            {/* Business Overview */}
            <div className="business-overview">
              <div className="business-overview-header">
                <h2 className="business-overview-title">Business Overview</h2>
                <button 
                  onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                  className="toggle-overview-btn"
                >
                  {showBusinessOverview ? 'Hide' : 'Show'}
                </button>
              </div>
              {showBusinessOverview && (
                <div className="business-overview-content">
                  {data.businessDescription || 'No business description available.'}
                </div>
              )}
            </div>

            <div className="button-divider"></div>

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
        </>
      ) : (
        <div className="edit-mode">
          <div className="edit-header">
            <h2 className="edit-title">Edit Profile</h2>
            <button 
              onClick={toggleEdit}
              className="save-profile-btn"
            >
              Done
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
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Click or drag to upload
                      </div>
                    </div>
                  )}
                </div>
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
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🖼️</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Click to upload
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Info Section */}
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
                <label className="form-label">Company Address</label>
                <input
                  type="text"
                  name="companyAddress"
                  value={data.companyAddress || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter company address"
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
                  placeholder="Enter company website URL"
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
                  placeholder="Enter Facebook URL"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Instagram URL</label>
                <input
                  type="text"
                  name="instagramURL"
                  value={data.instagramURL || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter Instagram URL"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Facebook Ad Library URL</label>
                <input
                  type="text"
                  name="facebookAdLibraryURL"
                  value={data.facebookAdLibraryURL || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter Facebook Ad Library URL"
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
                  placeholder="Enter Phoenix URL"
                />
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="contacts-section">
            <div className="contacts-header">
              <h3 className="section-title">Contacts</h3>
              {(data.contacts || []).length > 0 && (data.contacts || []).length < 5 && (
                <button 
                  onClick={addContact}
                  className="add-contact-btn"
                >
                  + Add Contact
                </button>
              )}
            </div>
            
            {(data.contacts || []).length > 0 ? (
              <div className="contacts-list">
                {(data.contacts || []).map((contact, index) => (
                  <div key={index} className="contact-item">
                    {index > 0 && (
                      <button 
                        onClick={() => removeContact(index)}
                        className="remove-contact-btn"
                      >
                        ×
                      </button>
                    )}
                    <div className="contact-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            value={contact.name || ''}
                            onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                            className="form-input"
                            placeholder="Enter contact name"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            value={contact.title || ''}
                            onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                            className="form-input"
                            placeholder="Enter contact title"
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
                            placeholder="Enter contact email"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Mobile</label>
                          <input
                            type="tel"
                            value={contact.mobile || ''}
                            onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                            className="form-input"
                            placeholder="Enter contact mobile"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-contacts">
                <p className="no-contacts-text">No contacts added yet.</p>
                <button 
                  onClick={addContact}
                  className="add-first-contact-btn"
                >
                  + Add First Contact
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
                placeholder="Enter business description..."
              />
            </div>
          </div>

          <div className="save-container">
            <button 
              onClick={toggleEdit}
              className="save-profile-btn-large"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInformation;
