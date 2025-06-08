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

  // Default cover gradient if no image is provided
  const defaultCoverGradient = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';

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
        setData(prevData => ({
          ...prevData,
          profileImage: reader.result as string
        }));
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
        setData(prevData => ({
          ...prevData,
          coverImage: reader.result as string
        }));
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
        setData(prevData => ({
          ...prevData,
          profileImage: reader.result as string
        }));
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

  return (
    <div style={{ 
      marginBottom: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
    }}>
      {!data.showBack ? (
        <div>
          {/* LinkedIn-style cover photo - full width with 4:1 aspect ratio */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '0',
            paddingBottom: '25%', // 4:1 aspect ratio
            background: data.coverImage ? `url(${data.coverImage})` : defaultCoverGradient,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {/* Edit cover button */}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
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
                style={{ display: 'none' }}
              />
            </button>
            
            {/* Profile picture overlapping the cover photo */}
            <div 
              style={{ 
                position: 'absolute',
                left: '24px',
                bottom: '-32px',
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#f3f4f6',
                border: '3px solid white',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
              }}
              onClick={() => profileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {data.profileImage ? (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundImage: `url(${data.profileImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  backgroundColor: '#e5e7eb'
                }}>
                  {data.companyName ? data.companyName.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <input 
                ref={profileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleProfileImageUpload} 
                style={{ display: 'none' }}
              />
            </div>
          </div>
          
          {/* Profile information section with proper spacing */}
          <div style={{ 
            paddingTop: '40px', // Space for the overlapping profile picture
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingBottom: '16px',
            backgroundColor: 'white'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div>
                <h1 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  margin: '0', 
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {data.companyName || 'Company Name'}
                  {/* Verified badge */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0a66c2">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 20.58l9.618-12.596A11.955 11.955 0 0112 2.944z" />
                  </svg>
                </h1>
                
                <p style={{ 
                  fontSize: '14px', 
                  margin: '4px 0 0', 
                  color: '#4b5563'
                }}>
                  {data.industryType || 'Industry'}
                </p>
                
                {/* Location info */}
                <p style={{ 
                  fontSize: '14px', 
                  margin: '4px 0 0', 
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  United States
                </p>
                
                {/* Connections/Contacts count */}
                <p style={{ 
                  fontSize: '14px', 
                  margin: '8px 0 0', 
                  color: '#0a66c2',
                  fontWeight: '600'
                }}>
                  {data.contacts && data.contacts.length > 0 
                    ? `${data.contacts.length} ${data.contacts.length === 1 ? 'contact' : 'contacts'}`
                    : 'No contacts'}
                </p>
              </div>
              
              {/* Edit button */}
              <button
                type="button"
                onClick={toggleEdit}
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#0a66c2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </div>
            
            {/* Website and social links */}
            {(data.companyWebsite || data.companyFacebookURL) && (
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                marginTop: '12px',
                fontSize: '14px'
              }}>
                {data.companyWebsite && (
                  <a 
                    href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#0a66c2',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
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
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#0a66c2',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>
          
          {/* Clear separation between sections */}
          <div style={{ 
            height: '8px', 
            backgroundColor: '#f3f4f6',
            borderTop: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb'
          }}></div>
          
          {/* Business Overview section */}
          <div style={{ 
            padding: '16px 24px',
            backgroundColor: 'white'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                margin: 0,
                color: '#111827'
              }}>
                Business Overview
              </h3>
              <button
                type="button"
                onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                style={{ 
                  fontSize: '14px', 
                  color: '#0a66c2', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {showBusinessOverview ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showBusinessOverview && (
              <div style={{ 
                fontSize: '14px', 
                lineHeight: '1.5',
                color: '#4b5563',
                backgroundColor: '#f9fafb', 
                padding: '12px', 
                borderRadius: '4px',
                marginTop: '8px',
                border: '1px solid #e5e7eb'
              }}>
                {data.businessDescription || 'No business description available.'}
              </div>
            )}
          </div>
          
          {/* Clear separation before social buttons */}
          <div style={{ 
            height: '1px', 
            backgroundColor: '#e5e7eb'
          }}></div>
          
          {/* Social interaction buttons */}
          <div style={{ 
            padding: '12px 24px', 
            display: 'flex', 
            justifyContent: 'space-between',
            backgroundColor: 'white'
          }}>
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px', 
              fontWeight: '600',
              background: 'none', 
              border: 'none', 
              color: '#6b7280', 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Like
            </button>
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px', 
              fontWeight: '600',
              background: 'none', 
              border: 'none', 
              color: '#6b7280', 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Comment
            </button>
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px', 
              fontWeight: '600',
              background: 'none', 
              border: 'none', 
              color: '#6b7280', 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '24px', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111827' }}>Edit Profile</h2>
            <button
              type="button"
              onClick={toggleEdit}
              style={{
                padding: '8px 20px',
                backgroundColor: '#0a66c2',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
          
          {/* Profile and Cover Image Upload */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#111827' }}>Profile Images</h3>
            
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#4b5563' }}>
                  Profile Picture
                </label>
                <div 
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '1px dashed #d1d5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: dragActive ? '#eff6ff' : '#f9fafb',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => profileInputRef.current?.click()}
                >
                  {data.profileImage ? (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${data.profileImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  <input 
                    ref={profileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileImageUpload} 
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#4b5563' }}>
                  Cover Image
                </label>
                <div 
                  style={{
                    width: '100%',
                    height: '0',
                    paddingBottom: '25%', // 4:1 aspect ratio
                    border: '1px dashed #d1d5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {data.coverImage ? (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${data.coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '32px', 
                      height: '32px', 
                      color: '#9ca3af' 
                    }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  <input 
                    ref={coverInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleCoverImageUpload} 
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Company Information */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#111827' }}>Company Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4b5563' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={data.companyName || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                  placeholder="Company name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4b5563' }}>
                  Industry
                </label>
                <input
                  type="text"
                  name="industryType"
                  value={data.industryType || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                  placeholder="Industry"
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4b5563' }}>
                  Website
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={data.companyWebsite || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                  placeholder="Website URL"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#4b5563' }}>
                  Facebook
                </label>
                <input
                  type="url"
                  name="companyFacebookURL"
                  value={data.companyFacebookURL || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                  placeholder="Facebook URL"
                />
              </div>
            </div>
          </div>
          
          {/* Contacts Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#111827' }}>
                Contacts ({(data.contacts || []).length}/5)
              </h3>
              {(data.contacts || []).length < 5 && (
                <button
                  type="button"
                  onClick={addContact}
                  style={{
                    padding: '6px 16px',
                    fontSize: '14px',
                    backgroundColor: '#0a66c2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Contact
                </button>
              )}
            </div>
            
            {data.contacts && data.contacts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.contacts.map((contact, index) => (
                  <div key={index} style={{ 
                    backgroundColor: '#f9fafb', 
                    padding: '16px', 
                    borderRadius: '8px',
                    position: 'relative',
                    border: '1px solid #e5e7eb'
                  }}>
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        cursor: 'pointer'
                      }}
                      aria-label="Remove contact"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                          Name
                        </label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                          placeholder="Name"
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                          Title
                        </label>
                        <input
                          type="text"
                          value={contact.title}
                          onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                          placeholder="Title"
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                          placeholder="Email"
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={contact.mobile}
                          onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                          placeholder="Phone"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                backgroundColor: '#f9fafb', 
                padding: '24px', 
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0' }}>No contacts added yet</p>
                <button
                  type="button"
                  onClick={addContact}
                  style={{
                    padding: '8px 20px',
                    fontSize: '14px',
                    backgroundColor: '#0a66c2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add First Contact
                </button>
              </div>
            )}
          </div>
          
          {/* Business Overview - with simple textarea */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#111827' }}>Business Overview</h3>
            
            <textarea
              value={data.businessDescription || ''}
              onChange={handleBusinessOverviewChange}
              style={{
                width: '100%',
                height: '120px',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                resize: 'vertical',
                outline: 'none'
              }}
              placeholder="Describe your business..."
            />
          </div>
          
          {/* Save button at bottom */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={toggleEdit}
              style={{
                padding: '10px 32px',
                backgroundColor: '#0a66c2',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
              }}
            >
              Save Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInformation;
