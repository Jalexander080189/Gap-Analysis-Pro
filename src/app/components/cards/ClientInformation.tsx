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
  phoenixURL?: string;
  companyAddress?: string;
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

interface GapsData {
  mode: "leadgen" | "retail";
  leadgen: {
    annualWebsiteVisitors: string;
    annualLeadsGenerated: string;
    annualNewAccountsClosed: string;
    visibilityReachGap: number;
    leadGenGap: number;
    closeRateGap: number;
  };
  retail: {
    annualStoreVisitors: string;
    annualNewAccountsClosed: string;
    visibilityReachGap: number;
    closeRateGap: number;
  };
  showBack: boolean;
}

interface ClientInformationProps {
  data: ClientDataType;
  setData: React.Dispatch<React.SetStateAction<ClientDataType>>;
  gapsData: GapsData;
  setGapsData: React.Dispatch<React.SetStateAction<GapsData>>;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData, gapsData, setGapsData }) => {
  const [showBusinessOverview, setShowBusinessOverview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  // Handle Lead Gen/Retail mode change
  const handleModeChange = (mode: "leadgen" | "retail") => {
    setGapsData({
      ...gapsData,
      mode
    });
  };

  // Contact management functions
  const addContact = () => {
    if (data.contacts.length < 5) {
      setData({
        ...data,
        contacts: [...data.contacts, { name: '', email: '', mobile: '', title: '' }]
      });
    }
  };

  const updateContact = (index: number, field: keyof ContactType, value: string) => {
    const updatedContacts = [...data.contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setData({
      ...data,
      contacts: updatedContacts
    });
  };

  const removeContact = (index: number) => {
    const updatedContacts = data.contacts.filter((_, i) => i !== index);
    setData({
      ...data,
      contacts: updatedContacts
    });
  };

  // Image handling functions
  const handleImageUpload = (file: File, isProfile: boolean) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCropperImage(result);
      setIsCoverImage(!isProfile);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0], true);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Cropper functions
  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageSize({ width: naturalWidth, height: naturalHeight });
      
      // Set initial crop size and position
      const cropWidth = isCoverImage ? Math.min(400, naturalWidth) : Math.min(200, naturalWidth);
      const cropHeight = isCoverImage ? Math.min(150, naturalHeight) : Math.min(200, naturalHeight);
      
      setCropSize({ width: cropWidth, height: cropHeight });
      setCropPosition({ 
        x: (naturalWidth - cropWidth) / 2, 
        y: (naturalHeight - cropHeight) / 2 
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropPosition.x, y: e.clientY - cropPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageRef.current) {
      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, imageSize.width - cropSize.width));
      const newY = Math.max(0, Math.min(e.clientY - dragStart.y, imageSize.height - cropSize.height));
      setCropPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const applyCrop = () => {
    if (cropperImage && imageRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = cropSize.width;
        canvas.height = cropSize.height;
        
        ctx?.drawImage(
          img,
          cropPosition.x,
          cropPosition.y,
          cropSize.width,
          cropSize.height,
          0,
          0,
          cropSize.width,
          cropSize.height
        );
        
        const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        if (isCoverImage) {
          setData({ ...data, coverImage: croppedImageUrl });
        } else {
          setData({ ...data, profileImage: croppedImageUrl });
        }
        
        setShowCropper(false);
        setCropperImage(null);
      };
      
      img.src = cropperImage;
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setCropperImage(null);
  };

  // Determine if we're in edit mode or view mode
  const isEditMode = data.showBack;

  if (isEditMode) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Edit Client Information</h2>
        
        {/* Images Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Images</h3>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Profile Picture */}
            <div>
              <label className="form-label">Profile Picture</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => profileInputRef.current?.click()}
              >
                {data.profileImage ? (
                  <div className="relative w-full h-full">
                    <img src={data.profileImage} alt="Profile" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity">
                      <span className="text-white opacity-0 hover:opacity-100">Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl text-gray-300 mb-2">+</div>
                    <p className="text-sm text-gray-500">Upload profile picture</p>
                  </div>
                )}
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
                  className="hidden"
                />
              </div>
            </div>
            
            {/* Cover Photo */}
            <div>
              <label className="form-label">Cover Photo</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => coverInputRef.current?.click()}
              >
                {data.coverImage ? (
                  <div className="relative w-full h-full">
                    <img src={data.coverImage} alt="Cover" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity">
                      <span className="text-white opacity-0 hover:opacity-100">Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl text-gray-300 mb-2">+</div>
                    <p className="text-sm text-gray-500">Upload cover photo</p>
                  </div>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], false)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Company Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Company Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={data.companyName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Acme Corporation"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Industry Type</label>
              <input
                type="text"
                name="industryType"
                value={data.industryType}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Technology, Healthcare"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Website</label>
              <input
                type="text"
                name="companyWebsite"
                value={data.companyWebsite}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://company.com"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Facebook URL</label>
              <input
                type="text"
                name="companyFacebookURL"
                value={data.companyFacebookURL}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://facebook.com/company"
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
                placeholder="https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&view_all_page_id=..."
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
                placeholder="https://instagram.com/company"
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
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>
            
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
          </div>
        </div>
        
        {/* Contacts */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Contacts</h3>
            <button
              onClick={addContact}
              disabled={data.contacts.length >= 5}
              className={`px-3 py-1 rounded text-sm ${
                data.contacts.length >= 5
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              type="button"
            >
              + Add Contact
            </button>
          </div>
          
          {data.contacts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No contacts added yet
            </div>
          ) : (
            <div className="space-y-4">
              {data.contacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => removeContact(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => updateContact(index, 'name', e.target.value)}
                        className="form-input"
                        placeholder="Full Name"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        value={contact.title}
                        onChange={(e) => updateContact(index, 'title', e.target.value)}
                        className="form-input"
                        placeholder="Job Title"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateContact(index, 'email', e.target.value)}
                        className="form-input"
                        placeholder="Email Address"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Mobile</label>
                      <input
                        type="tel"
                        value={contact.mobile}
                        onChange={(e) => updateContact(index, 'mobile', e.target.value)}
                        className="form-input"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Business Overview */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Business Overview</h3>
          <textarea
            name="businessDescription"
            value={data.businessDescription}
            onChange={handleTextareaChange}
            className="form-textarea h-32"
            placeholder="Brief description of the business..."
          />
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <div 
        className="h-48 bg-blue-500 relative"
        style={{
          backgroundImage: data.coverImage ? `url(${data.coverImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!data.coverImage && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <span className="opacity-50">No cover image</span>
          </div>
        )}
      </div>

      <div className="p-6 relative">
        {/* Profile Image */}
        <div className="absolute -top-16 left-6">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            {data.profileImage ? (
              <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Mode Toggle - Right Side */}
        <div className="absolute top-6 right-6 flex items-center">
          <div className="text-sm text-gray-600 mr-2">Mode:</div>
          <div className="bg-gray-100 rounded-md p-1 flex">
            <button
              onClick={() => handleModeChange('leadgen')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                gapsData.mode === 'leadgen'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              type="button"
            >
              Lead Gen
            </button>
            <button
              onClick={() => handleModeChange('retail')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                gapsData.mode === 'retail'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              type="button"
            >
              Retail
            </button>
          </div>
          
          <button
            onClick={() => setData({ ...data, showBack: true })}
            className="ml-4 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            Edit
          </button>
        </div>

        {/* Company Info */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold">{data.companyName || 'Company Name'}</h2>
          <p className="text-gray-600">{data.industryType || 'Industry Type'}</p>
          
          <div className="flex items-center space-x-4 mt-2">
            <p className="profile-location">
              📍 {data.companyAddress || 'United States'}
            </p>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => setShowContactDetails(!showContactDetails)}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              type="button"
            >
              {data.contacts.length} contact{data.contacts.length !== 1 ? 's' : ''}
            </button>
          </div>
          
          {/* Profile Links */}
          <div className="flex flex-wrap gap-3 mt-3">
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
                📸 Instagram
              </a>
            )}
            {data.facebookAdLibraryURL && (
              <a href={data.facebookAdLibraryURL} className="profile-link" target="_blank" rel="noopener noreferrer">
                📊 FB Ad Library
              </a>
            )}
            {data.phoenixURL && (
              <a href={data.phoenixURL} className="profile-link" target="_blank" rel="noopener noreferrer">
                🔥 Phoenix
              </a>
            )}
          </div>
        </div>

        {/* Contact Details Modal/Expandable Section */}
        {showContactDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Contact Information</h3>
              <button
                onClick={() => setShowContactDetails(false)}
                className="text-gray-400 hover:text-gray-600"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {data.contacts.length === 0 ? (
              <p className="text-gray-500 text-center py-2">No contacts available</p>
            ) : (
              <div className="space-y-3">
                {data.contacts.map((contact, index) => (
                  <div key={index} className="bg-white rounded p-3">
                    <div className="font-medium">{contact.name || 'No Name'}</div>
                    <div className="text-sm text-gray-600">{contact.title || 'No Title'}</div>
                    <div className="mt-2 text-sm">
                      {contact.email && (
                        <div className="flex items-center mb-1">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                        </div>
                      )}
                      {contact.mobile && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${contact.mobile}`} className="text-blue-600 hover:underline">{contact.mobile}</a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Business Overview */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-lg">Business Overview</h3>
            <button
              onClick={() => setShowBusinessOverview(!showBusinessOverview)}
              className="text-blue-600 hover:text-blue-800 text-sm"
              type="button"
            >
              {showBusinessOverview ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showBusinessOverview && (
            <div className="text-gray-700 mt-2">
              {data.businessDescription ? (
                <p>{data.businessDescription}</p>
              ) : (
                <p className="text-gray-500 italic">No business description available</p>
              )}
            </div>
          )}
        </div>

        {/* Social Actions */}
        <div className="mt-6 flex border-t pt-4">
          <button
            className="flex items-center text-gray-600 hover:text-blue-600 mr-6"
            type="button"
          >
            <span className="mr-1">👍</span> Like
          </button>
          <button
            className="flex items-center text-gray-600 hover:text-blue-600 mr-6"
            type="button"
          >
            <span className="mr-1">💬</span> Comment
          </button>
          <button
            className="flex items-center text-gray-600 hover:text-blue-600"
            type="button"
          >
            <span className="mr-1">↗️</span> Share
          </button>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && cropperImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium mb-4">
              Crop {isCoverImage ? 'Cover Image' : 'Profile Image'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag the selection area to position your crop
            </p>
            
            <div 
              className="relative overflow-hidden mb-4 border"
              style={{ height: '400px' }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={cropperImage}
                alt="Crop preview"
                className="max-w-full"
                onLoad={handleImageLoad}
                style={{ maxHeight: '400px' }}
              />
              
              <div
                className="absolute border-2 border-blue-500 cursor-move"
                style={{
                  left: `${cropPosition.x}px`,
                  top: `${cropPosition.y}px`,
                  width: `${cropSize.width}px`,
                  height: `${cropSize.height}px`
                }}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zoom:
              </label>
              <input
                type="range"
                min="1"
                max="2"
                step="0.01"
                className="w-full"
                onChange={(e) => {
                  const scale = parseFloat(e.target.value);
                  if (imageRef.current) {
                    const { naturalWidth, naturalHeight } = imageRef.current;
                    const newWidth = Math.min(cropSize.width, naturalWidth * scale);
                    const newHeight = Math.min(cropSize.height, naturalHeight * scale);
                    setCropSize({ width: newWidth, height: newHeight });
                  }
                }}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelCrop}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                type="button"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInformation;
