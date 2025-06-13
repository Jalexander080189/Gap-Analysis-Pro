'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

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
  instagramURL?: string;
  facebookAdLibraryURL?: string;
  phoenixURL?: string;
  companyAddress?: string;
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
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Custom cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [isCoverImage, setIsCoverImage] = useState(false);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
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

  // Generate slug from company name
  useEffect(() => {
    if (data.companyName && typeof window !== 'undefined' && !window.location.pathname.includes('/reports/')) {
      const slug = data.companyName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      if (slug) {
        const newUrl = `/reports/${slug}`;
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [data.companyName]);

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
        setZoomLevel(1);
        
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
        setZoomLevel(1);
        
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

  const toggleEdit = () => {
    setData(prevData => ({
      ...prevData,
      showBack: !prevData.showBack
    }));
  };

  // Handle zoom slider change
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoomLevel(newZoom);
    
    if (imageRef.current) {
      // Adjust crop size based on zoom level
      const originalWidth = imageRef.current.naturalWidth; // Use naturalWidth for original size
      const originalHeight = imageRef.current.naturalHeight; // Use naturalHeight for original size
      
      // Calculate new dimensions based on zoom
      const newWidth = originalWidth * newZoom;
      const newHeight = originalHeight * newZoom;
      
      // Update image size for display in cropper
      setImageSize({
        width: newWidth,
        height: newHeight
      });
      
      // Adjust crop position to keep it centered
      const centerX = cropPosition.x + (cropSize.width / 2);
      const centerY = cropPosition.y + (cropSize.height / 2);
      
      const newX = centerX * newZoom - (cropSize.width / 2);
      const newY = centerY * newZoom - (cropSize.height / 2);
      
      setCropPosition({
        x: Math.max(0, Math.min(newWidth - cropSize.width, newX)),
        y: Math.max(0, Math.min(newHeight - cropSize.height, newY))
      });
    }
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
    
    // Calculate scale factors based on original image dimensions and current zoom
    const scaleX = img.naturalWidth / (imageSize.width / zoomLevel); 
    const scaleY = img.naturalHeight / (imageSize.height / zoomLevel);
    
    // Set canvas size to crop size (scaled to original image)
    canvas.width = cropSize.width * scaleX;
    canvas.height = cropSize.height * scaleY;
    
    // Draw the cropped portion
    ctx.drawImage(
      img,
      cropPosition.x * scaleX, // Crop position is relative to the zoomed image
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

  // Social button handlers
  const handleLike = () => {
    setLikeCount(prev => prev + 1);
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleShare = () => {
    // Create a shareable link
    const url = window.location.href;
    
    // Try to use the clipboard API if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(() => {
          // Fallback
          prompt('Copy this link to share:', url);
        });
    } else {
      // Fallback for browsers without clipboard API
      prompt('Copy this link to share:', url);
    }
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
                  height: imageSize.height,
                  transform: `scale(${zoomLevel})`, // Apply zoom level here
                  transformOrigin: 'center center' // Ensure zoom is centered
                }}
              >
                {/* Using img element for the cropper as Next/Image doesn't work well with canvas operations */}
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
              {/* Zoom slider */}
              <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <span style={{ marginRight: '8px', fontSize: '14px' }}>Zoom:</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoomLevel}
                  onChange={handleZoomChange}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
              
              <div>
                <button
                  onClick={cancelCropping}
                  style={{
                    padding: '8px 16px',
                    marginRight: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  type="button"
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
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  type="button"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {data.showBack ? (
        // Edit Mode
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Client Information</h2>
              <button
                onClick={toggleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                type="button"
              >
                Save
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Images</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Profile Picture</p>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => profileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <div className="flex justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Click to upload</p>
                    </div>
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Cover Photo</p>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <div className="flex justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Click to upload</p>
                    </div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Company Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={data.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Acme Corporation"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor="industryType">
                    Industry Type
                  </label>
                  <input
                    type="text"
                    id="industryType"
                    name="industryType"
                    value={data.industryType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor="companyWebsite">
                    Company Website
                  </label>
                  <input
                    type="text"
                    id="companyWebsite"
                    name="companyWebsite"
                    value={data.companyWebsite}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor="companyFacebookURL">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    id="companyFacebookURL"
                    name="companyFacebookURL"
                    value={data.companyFacebookURL}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://facebook.com/company"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor="facebookAdLibraryURL">
                    Facebook Ad Library URL
                  </label>
                  <input
                    type="text"
                    id="facebookAdLibraryURL"
                    name="facebookAdLibraryURL"
                    value={data.facebookAdLibraryURL || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.facebook.com/ads/library/?active_status=all&ad_type=all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor="instagramURL">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    id="instagramURL"
                    name="instagramURL"
                    value={data.instagramURL || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://instagram.com/company"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor="phoenixURL">
                    Phoenix URL
                  </label>
                  <input
                    type="text"
                    id="phoenixURL"
                    name="phoenixURL"
                    value={data.phoenixURL || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://phoenix.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2" htmlFor="companyAddress">
                    Company Address
                  </label>
                  <input
                    type="text"
                    id="companyAddress"
                    name="companyAddress"
                    value={data.companyAddress || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Contacts</h3>
              <p className="text-sm text-gray-500 mb-4">Add up to 5 contacts for this company</p>
              
              {data.contacts && data.contacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Contact {index + 1}</h4>
                    <button
                      onClick={() => removeContact(index)}
                      className="text-red-600 hover:text-red-800"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2" htmlFor={`contact-name-${index}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        id={`contact-name-${index}`}
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2" htmlFor={`contact-title-${index}`}>
                        Title
                      </label>
                      <input
                        type="text"
                        id={`contact-title-${index}`}
                        value={contact.title}
                        onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Job Title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2" htmlFor={`contact-email-${index}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        id={`contact-email-${index}`}
                        value={contact.email}
                        onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2" htmlFor={`contact-mobile-${index}`}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        id={`contact-mobile-${index}`}
                        value={contact.mobile}
                        onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {(!data.contacts || data.contacts.length < 5) && (
                <button
                  onClick={addContact}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Contact
                </button>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Business Overview</h3>
              <textarea
                name="businessDescription"
                value={data.businessDescription}
                onChange={handleBusinessOverviewChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                placeholder="Provide a brief description of the business..."
              ></textarea>
            </div>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cover Image */}
          <div 
            className="h-48 bg-gray-200 relative"
            style={{
              backgroundImage: data.coverImage ? `url(${data.coverImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />
          </div>

          <div className="p-6 relative">
            {/* Profile Image - Positioned correctly within Card 1 */}
            <div className="absolute -top-16 left-6 z-10"> {/* Added z-index here */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  {data.profileImage ? (
                    // Using Image component for profile image in view mode
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <Image 
                        src={data.profileImage} 
                        alt="Profile" 
                        fill 
                        style={{ objectFit: 'cover' }} 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 transition-colors"
                  type="button"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Lead Gen/Retail Toggle - Right Side */}
            <div className="absolute top-0 right-0 p-4 flex items-center">
              <div className="text-sm text-gray-600 mr-2">Mode:</div>
              <div className="flex bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => handleModeChange('leadgen')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    mode === 'leadgen'
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
                    mode === 'retail'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  type="button"
                >
                  Retail
                </button>
              </div>
              <button
                onClick={toggleEdit}
                className="ml-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                type="button"
              >
                Edit
              </button>
            </div>

            {/* Company Info */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold">{data.companyName || 'Company Name'}</h2>
              <div className="flex flex-col mt-1">
                <span className="text-gray-600">{data.industryType || 'Industry Type'}</span>
                {/* Display company address instead of "United States" */}
                <span className="text-gray-600">{data.companyAddress || 'Company Address'}</span>
                <div className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer mt-1">
                  {data.contacts?.length || 0} contact{(data.contacts?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>

              {/* URL Links - Including new fields */}
              <div className="flex flex-wrap items-center mt-2 gap-2">
                {data.companyWebsite && (
                  <a 
                    href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    Website
                  </a>
                )}
                
                {data.companyFacebookURL && (
                  <a 
                    href={data.companyFacebookURL.startsWith('http') ? data.companyFacebookURL : `https://${data.companyFacebookURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                )}
                
                {data.instagramURL && (
                  <a 
                    href={data.instagramURL.startsWith('http') ? data.instagramURL : `https://${data.instagramURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </a>
                )}
                
                {data.facebookAdLibraryURL && (
                  <a 
                    href={data.facebookAdLibraryURL.startsWith('http') ? data.facebookAdLibraryURL : `https://${data.facebookAdLibraryURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                      <path d="M12 8v3.5l3 1.5-1 2-4-2V8z"/>
                    </svg>
                    Ad Library
                  </a>
                )}
                
                {data.phoenixURL && (
                  <a 
                    href={data.phoenixURL.startsWith('http') ? data.phoenixURL : `https://${data.phoenixURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                    </svg>
                    Phoenix
                  </a>
                )}
              </div>

              {/* Business Overview */}
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Business Overview</h3>
                  <button
                    onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    type="button"
                  >
                    {showBusinessOverview ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showBusinessOverview && (
                  <div className="mt-2 text-gray-700">
                    {data.businessDescription || 'No business description provided.'}
                  </div>
                )}
              </div>

              {/* Social Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                <button
                  onClick={handleLike}
                  className="flex items-center text-gray-600 hover:text-blue-600"
                  type="button"
                >
                  <span className="mr-1">👍</span>
                  Like{likeCount > 0 ? ` (${likeCount})` : ''}
                </button>
                
                <button
                  onClick={handleComment}
                  className="flex items-center text-gray-600 hover:text-blue-600"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comment
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center text-gray-600 hover:text-blue-600"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
              
              {/* Comments Section */}
              {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-2"></div>
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {commentText && (
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => setCommentText('')}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 mr-2"
                            type="button"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              // Handle comment submission
                              setCommentText('');
                            }}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            type="button"
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInformation;
