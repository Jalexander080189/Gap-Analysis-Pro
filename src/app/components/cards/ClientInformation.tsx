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
    <div className="card" style={{ 
      padding: '0', 
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
    }}>
      {!data.showBack ? (
        <div>
          {/* LinkedIn-style cover photo */}
          <div style={{ 
            height: '80px', 
            position: 'relative',
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
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
              aria-label="Edit cover photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          </div>
          
          {/* Profile section with overlapping avatar */}
          <div style={{ 
            position: 'relative', 
            padding: '0 16px 12px',
            paddingTop: '24px'
          }}>
            {/* Profile picture */}
            <div 
              style={{ 
                position: 'absolute',
                top: '-20px',
                left: '16px',
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#f3f4f6',
                border: '2px solid white',
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
                  fontSize: '16px',
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
            
            {/* Name and title */}
            <div style={{ marginLeft: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  margin: '0', 
                  color: '#111827'
                }}>
                  {data.companyName || 'Company Name'}
                  {/* Verified badge */}
                  <span style={{ 
                    display: 'inline-block',
                    marginLeft: '4px',
                    color: '#3b82f6'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 20.58l9.618-12.596A11.955 11.955 0 0112 2.944z" />
                    </svg>
                  </span>
                </h1>
                
                {/* Edit button */}
                <button
                  type="button"
                  onClick={toggleEdit}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              </div>
              
              <p style={{ 
                fontSize: '12px', 
                margin: '2px 0 0', 
                color: '#4b5563'
              }}>
                {data.industryType || 'Industry'}
              </p>
              
              {/* Website and social links */}
              {(data.companyWebsite || data.companyFacebookURL) && (
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  marginTop: '4px',
                  fontSize: '11px',
                  color: '#6b7280'
                }}>
                  {data.companyWebsite && (
                    <a 
                      href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        color: '#3b82f6',
                        textDecoration: 'none'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        gap: '2px',
                        color: '#3b82f6',
                        textDecoration: 'none'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                      Facebook
                    </a>
                  )}
                </div>
              )}
              
              {/* Contacts preview */}
              {data.contacts && data.contacts.length > 0 && (
                <div style={{ 
                  marginTop: '8px',
                  fontSize: '11px',
                  color: '#4b5563'
                }}>
                  <div style={{ 
                    fontWeight: '500',
                    marginBottom: '2px'
                  }}>
                    {data.contacts.length === 1 ? '1 Contact' : `${data.contacts.length} Contacts`}
                  </div>
                  <div style={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px'
                  }}>
                    {data.contacts.slice(0, 2).map((contact, index) => (
                      <div key={index} style={{
                        padding: '2px 6px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '12px',
                        fontSize: '10px'
                      }}>
                        {contact.name}
                      </div>
                    ))}
                    {data.contacts.length > 2 && (
                      <div style={{
                        padding: '2px 6px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '12px',
                        fontSize: '10px'
                      }}>
                        +{data.contacts.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Business Overview section */}
          <div style={{ 
            borderTop: '1px solid #e5e7eb',
            padding: '12px 16px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '4px'
            }}>
              <h3 style={{ 
                fontSize: '14px', 
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
                  fontSize: '12px', 
                  color: '#3b82f6', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {showBusinessOverview ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showBusinessOverview && (
              <div style={{ 
                fontSize: '12px', 
                lineHeight: '1.5',
                color: '#4b5563',
                backgroundColor: '#f9fafb', 
                padding: '8px', 
                borderRadius: '4px',
                marginTop: '4px'
              }}>
                {data.businessDescription || 'No business description available.'}
              </div>
            )}
          </div>
          
          {/* Social interaction buttons */}
          <div style={{ 
            borderTop: '1px solid #e5e7eb', 
            padding: '8px', 
            display: 'flex', 
            justifyContent: 'space-around'
          }}>
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px', 
              fontWeight: '500',
              background: 'none', 
              border: 'none', 
              color: '#4b5563', 
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Like
            </button>
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px', 
              fontWeight: '500',
              background: 'none', 
              border: 'none', 
              color: '#4b5563', 
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Comment
            </button>
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px', 
              fontWeight: '500',
              background: 'none', 
              border: 'none', 
              color: '#4b5563', 
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827' }}>Edit Profile</h2>
            <button
              type="button"
              onClick={toggleEdit}
              style={{
                padding: '6px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
          
          {/* Profile and Cover Image Upload */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', color: '#111827' }}>Profile Images</h3>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                  Profile Picture
                </label>
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
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
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                  Cover Image
                </label>
                <div 
                  style={{
                    width: '100%',
                    height: '64px',
                    border: '1px dashed #d1d5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {data.coverImage ? (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${data.coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', color: '#111827' }}>Company Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={data.companyName || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                  placeholder="Company name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                  Industry
                </label>
                <input
                  type="text"
                  name="industryType"
                  value={data.industryType || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                  placeholder="Industry"
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                  Website
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={data.companyWebsite || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                  placeholder="Website URL"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#4b5563' }}>
                  Facebook
                </label>
                <input
                  type="url"
                  name="companyFacebookURL"
                  value={data.companyFacebookURL || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '12px',
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
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#111827' }}>
                Contacts ({(data.contacts || []).length}/5)
              </h3>
              {(data.contacts || []).length < 5 && (
                <button
                  type="button"
                  onClick={addContact}
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Contact
                </button>
              )}
            </div>
            
            {data.contacts && data.contacts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.contacts.map((contact, index) => (
                  <div key={index} style={{ 
                    backgroundColor: '#f9fafb', 
                    padding: '12px', 
                    borderRadius: '8px',
                    position: 'relative',
                    border: '1px solid #e5e7eb'
                  }}>
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        cursor: 'pointer'
                      }}
                      aria-label="Remove contact"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '2px', color: '#4b5563' }}>
                          Name
                        </label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px',
                            fontSize: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                          placeholder="Name"
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '2px', color: '#4b5563' }}>
                          Title
                        </label>
                        <input
                          type="text"
                          value={contact.title}
                          onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px',
                            fontSize: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                          placeholder="Title"
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '2px', color: '#4b5563' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px',
                            fontSize: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                          placeholder="Email"
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '500', marginBottom: '2px', color: '#4b5563' }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={contact.mobile}
                          onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px',
                            fontSize: '12px',
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
                padding: '16px', 
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>No contacts added yet</p>
                <button
                  type="button"
                  onClick={addContact}
                  style={{
                    padding: '6px 16px',
                    fontSize: '12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add First Contact
                </button>
              </div>
            )}
          </div>
          
          {/* Business Overview - with simple textarea */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', color: '#111827' }}>Business Overview</h3>
            
            <textarea
              value={data.businessDescription || ''}
              onChange={handleBusinessOverviewChange}
              style={{
                width: '100%',
                height: '100px',
                padding: '8px',
                fontSize: '12px',
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
                padding: '8px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
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
