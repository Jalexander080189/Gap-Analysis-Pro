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
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      {!data.showBack ? (
        <div>
          {/* Absolute minimal profile header */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
            {/* Tiny profile image */}
            <div 
              style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: '#f3f4f6',
                marginRight: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                cursor: 'pointer'
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
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#9ca3af'
                }}>
                  {data.companyName ? data.companyName.charAt(0) : '?'}
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
            
            {/* Company info */}
            <div style={{ flexGrow: 1, overflow: 'hidden' }}>
              <h1 style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                margin: '0', 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {data.companyName || 'Company Name'}
              </h1>
              <p style={{ 
                fontSize: '10px', 
                margin: '0', 
                color: '#4b5563',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {data.industryType || 'Industry'}
              </p>
            </div>
            
            {/* Edit button */}
            <button
              type="button"
              onClick={toggleEdit}
              style={{
                padding: '4px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              Edit
            </button>
          </div>
          
          {/* Business Overview - ultra minimal */}
          <div style={{ padding: '0 8px 8px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '4px'
            }}>
              <h3 style={{ fontSize: '10px', fontWeight: 'bold', margin: 0 }}>Business Overview</h3>
              <button
                type="button"
                onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                style={{ fontSize: '10px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showBusinessOverview ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showBusinessOverview && (
              <div style={{ 
                fontSize: '10px', 
                backgroundColor: '#f9fafb', 
                padding: '4px', 
                borderRadius: '4px' 
              }}>
                {data.businessDescription || 'No business description available.'}
              </div>
            )}
          </div>
          
          {/* Social buttons - ultra minimal */}
          <div style={{ 
            borderTop: '1px solid #e5e7eb', 
            padding: '4px 8px', 
            display: 'flex', 
            gap: '8px' 
          }}>
            <button style={{ fontSize: '10px', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer' }}>Like</button>
            <button style={{ fontSize: '10px', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer' }}>Comment</button>
            <button style={{ fontSize: '10px', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer' }}>Share</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>Edit Profile</h2>
            <button
              type="button"
              onClick={toggleEdit}
              style={{
                padding: '4px 8px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
          
          {/* Company Information - ultra-compact */}
          <div style={{ marginBottom: '8px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Company Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '500', marginBottom: '2px' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={data.companyName || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '2px 4px',
                    fontSize: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                  placeholder="Company name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '500', marginBottom: '2px' }}>
                  Industry
                </label>
                <input
                  type="text"
                  name="industryType"
                  value={data.industryType || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '2px 4px',
                    fontSize: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                  placeholder="Industry"
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '500', marginBottom: '2px' }}>
                  Website
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={data.companyWebsite || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '2px 4px',
                    fontSize: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                  placeholder="Website URL"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '500', marginBottom: '2px' }}>
                  Facebook
                </label>
                <input
                  type="url"
                  name="companyFacebookURL"
                  value={data.companyFacebookURL || ''}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '2px 4px',
                    fontSize: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                  placeholder="Facebook URL"
                />
              </div>
            </div>

            {/* Profile and Cover Image Upload - ultra-compact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '500', marginBottom: '2px' }}>
                  Profile Image
                </label>
                <div 
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1px dashed #d1d5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: dragActive ? '#eff6ff' : '#f9fafb',
                    cursor: 'pointer'
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
                      borderRadius: '50%',
                      backgroundImage: `url(${data.profileImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '12px', height: '12px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '500', marginBottom: '2px' }}>
                  Cover Image
                </label>
                <div 
                  style={{
                    width: '100%',
                    height: '24px',
                    border: '1px dashed #d1d5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer'
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
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '12px', height: '12px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          
          {/* Contacts Section - ultra-compact */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: 0 }}>Contacts ({(data.contacts || []).length}/5)</h3>
              {(data.contacts || []).length < 5 && (
                <button
                  type="button"
                  onClick={addContact}
                  style={{
                    padding: '2px 4px',
                    fontSize: '10px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '8px', height: '8px', marginRight: '2px' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add
                </button>
              )}
            </div>
            
            {data.contacts && data.contacts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {data.contacts.map((contact, index) => (
                  <div key={index} style={{ 
                    backgroundColor: '#f9fafb', 
                    padding: '4px', 
                    borderRadius: '4px',
                    position: 'relative',
                    fontSize: '10px'
                  }}>
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        cursor: 'pointer'
                      }}
                      aria-label="Remove contact"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '8px', height: '8px' }} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      <div>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '2px 4px',
                            fontSize: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                          }}
                          placeholder="Name"
                        />
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          value={contact.title}
                          onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '2px 4px',
                            fontSize: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                          }}
                          placeholder="Title"
                        />
                      </div>
                      
                      <div>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '2px 4px',
                            fontSize: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                          }}
                          placeholder="Email"
                        />
                      </div>
                      
                      <div>
                        <input
                          type="tel"
                          value={contact.mobile}
                          onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '2px 4px',
                            fontSize: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
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
                padding: '4px', 
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '10px'
              }}>
                <button
                  type="button"
                  onClick={addContact}
                  style={{
                    padding: '2px 4px',
                    fontSize: '10px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '8px', height: '8px', marginRight: '2px' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Contact
                </button>
              </div>
            )}
          </div>
          
          {/* Business Overview - ultra-compact with simple textarea instead of ReactQuill */}
          <div style={{ marginBottom: '8px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Business Overview</h3>
            
            <textarea
              value={data.businessDescription || ''}
              onChange={handleBusinessOverviewChange}
              style={{
                width: '100%',
                height: '60px',
                padding: '4px',
                fontSize: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                resize: 'vertical'
              }}
              placeholder="Describe your business..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInformation;
