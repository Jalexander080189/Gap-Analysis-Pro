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
        <div className="card-front">
          {/* LinkedIn-style Profile Header */}
          <div className="profile-header mb-6">
            {/* Cover Photo Section */}
            <div className="relative">
              <div 
                className="profile-banner relative overflow-hidden cursor-pointer"
                onClick={() => coverInputRef.current?.click()}
              >
                {data.coverImage && (
                  <img 
                    src={data.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <span className="text-white text-sm">
                    {data.coverImage ? 'Change cover photo' : 'Click to add cover photo'}
                  </span>
                </div>
              </div>
              
              {/* Profile Avatar */}
              <div 
                className="profile-avatar cursor-pointer flex items-center justify-center"
                onClick={() => profileInputRef.current?.click()}
              >
                {data.profileImage ? (
                  <img 
                    src={data.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Company Name and Industry */}
            <div className="mt-12 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {data.companyName || 'Company Name'}
              </h2>
              <p className="text-gray-600">
                Industry Type: {data.industryType || 'Years in business'}
              </p>
              <div className="flex items-center mt-2">
                <button 
                  onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {data.contacts?.length || 0} contacts
                </button>
                
                {/* Lead Gen/Retail Toggle */}
                <div className="ml-auto">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Mode:</span>
                    <button
                      onClick={() => handleModeChange(mode === 'leadgen' ? 'retail' : 'leadgen')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        mode === 'leadgen' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {mode === 'leadgen' ? 'Lead Gen' : 'Retail'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
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

              <div>
                <label className="form-label">Industry Type</label>
                <input
                  type="text"
                  name="industryType"
                  value={data.industryType || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>

              <div>
                <label className="form-label">Company Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={data.companyWebsite || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <label className="form-label">Years in Business</label>
                <input
                  type="text"
                  name="yearsInBusiness"
                  value={data.yearsInBusiness || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className="form-label">Facebook URL</label>
                <input
                  type="url"
                  name="companyFacebookURL"
                  value={data.companyFacebookURL || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="form-label">Instagram URL</label>
                <input
                  type="url"
                  name="instagramURL"
                  value={data.instagramURL || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="form-label">Business Description</label>
                <textarea
                  name="businessDescription"
                  value={data.businessDescription || ''}
                  onChange={handleBusinessOverviewChange}
                  className="form-input"
                  rows={4}
                  placeholder="Brief description of the business..."
                />
              </div>

              {/* Business Overview Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-gray-700 mb-4">Business Overview</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Annual Website Visitors</label>
                    <input
                      type="number"
                      name="annualWebsiteVisitors"
                      value={data.annualWebsiteVisitors || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., 10000"
                    />
                  </div>

                  <div>
                    <label className="form-label">Annual Leads Generated</label>
                    <input
                      type="number"
                      name="annualLeadsGenerated"
                      value={data.annualLeadsGenerated || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., 1000"
                    />
                  </div>

                  <div>
                    <label className="form-label">Annual New Accounts Closed</label>
                    <input
                      type="number"
                      name="annualNewAccountsClosed"
                      value={data.annualNewAccountsClosed || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., 100"
                    />
                  </div>

                  <div>
                    <label className="form-label">Annual Revenue ($ )</label>
                    <input
                      type="number"
                      name="annualRevenue"
                      value={data.annualRevenue || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., 1000000"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> These values will automatically update the calculations in the Gaps & Opportunities card.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details Modal */}
            {showBusinessOverview && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                {data.contacts && data.contacts.length > 0 ? (
                  data.contacts.map((contact, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded">
                      <p><strong>{contact.name}</strong> - {contact.title}</p>
                      <p className="text-sm text-gray-600">{contact.email} | {contact.mobile}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No contacts added yet</p>
                )}
                <button
                  onClick={addContact}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Add Contact
                </button>
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageUpload}
            />
            
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageUpload}
            />
          </div>
        ) : (
          <div className="card-back">
            <div className="card-header">
              <h3 className="card-title">Business Overview</h3>
            </div>
            
            <div className="card-content">
              {data.businessDescription && (
                <div>
                  <h3 className="font-medium text-gray-700">Business Description</h3>
                  <p className="text-gray-600">{data.businessDescription}</p>
                </div>
              )}

              {/* Contact Information on Back of Card */}
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                {data.contacts && data.contacts.length > 0 ? (
                  data.contacts.map((contact, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded">
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                        className="form-input mb-1"
                        placeholder="Contact Name"
                      />
                      <input
                        type="text"
                        value={contact.title}
                        onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                        className="form-input mb-1"
                        placeholder="Contact Title"
                      />
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                        className="form-input mb-1"
                        placeholder="Contact Email"
                      />
                      <input
                        type="tel"
                        value={contact.mobile}
                        onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                        className="form-input mb-1"
                        placeholder="Contact Phone"
                      />
                      <button
                        onClick={() => removeContact(index)}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No contacts added yet</p>
                )}
                <button
                  onClick={addContact}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        )}
      
      {/* Social interaction buttons */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className={`social-button ${data.showBack ? 'hidden' : ''}`}
            onClick={() => console.log('Like clicked')}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.60L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Like
          </button>
          
          <button 
            className={`social-button ${data.showBack ? 'hidden' : ''}`}
            onClick={( ) => console.log('Comment clicked')}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Comment
          </button>
          
          <button 
            className={`social-button ${data.showBack ? 'hidden' : ''}`}
            onClick={( ) => console.log('Share clicked')}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
        
        <button 
          className="toggle-button"
          onClick={toggleEdit}
          type="button"
        >
          {data.showBack ? 'Show Front' : 'Show Back'}
        </button>
      </div>
    </div>
   );
};

export default ClientInformation;
