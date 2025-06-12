'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ClientDataType, ContactType } from './GPTDataBlock';

// Inline styles as backup for Tailwind classes
const cardStyles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    marginBottom: '1.5rem'
  },
  coverPhoto: {
    height: '8rem',
    position: 'relative',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)'
  },
  profileSection: {
    padding: '0 1.5rem 1rem 1.5rem'
  },
  profilePicture: {
    width: '4rem',
    height: '4rem',
    borderRadius: '9999px',
    border: '2px solid white',
    overflow: 'hidden',
    backgroundColor: '#e5e7eb'
  },
  modeToggleContainer: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  modeToggleButtons: {
    display: 'flex',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    padding: '0.25rem'
  },
  modeButtonActive: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    color: '#2563eb'
  },
  modeButtonInactive: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    borderRadius: '0.375rem',
    color: 'white'
  },
  editButton: {
    marginTop: '2rem',
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    color: '#374151',
    borderRadius: '0.375rem'
  },
  socialButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  }
};

interface ClientInformationProps {
  data: ClientDataType;
  setData: (data: ClientDataType) => void;
  mode: 'leadgen' | 'retail';
  setMode: React.Dispatch<React.SetStateAction<'leadgen' | 'retail'>>;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData, mode, setMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ClientDataType>(data);
  const [profileImage, setProfileImage] = useState<string | undefined>(data.profilePhoto);
  const [coverImage, setCoverImage] = useState<string | undefined>(data.coverPhoto);
  const [showBusinessOverview, setShowBusinessOverview] = useState(false);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Update editData when data prop changes
  useEffect(() => {
    setEditData(data);
    setProfileImage(data.profilePhoto);
    setCoverImage(data.coverPhoto);
  }, [data]);

  const handleSave = () => {
    // Include the image data in the save
    const updatedData = {
      ...editData,
      profilePhoto: profileImage,
      coverPhoto: coverImage
    };
    setData(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setProfileImage(data.profilePhoto);
    setCoverImage(data.coverPhoto);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ClientDataType, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (index: number, field: keyof ContactType, value: string) => {
    const updatedContacts = [...editData.contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    setEditData(prev => ({
      ...prev,
      contacts: updatedContacts
    }));
  };

  const addContact = () => {
    setEditData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', email: '', mobile: '', title: '' }]
    }));
  };

  const removeContact = (index: number) => {
    setEditData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (type: 'profile' | 'cover', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'profile') {
        setProfileImage(result);
      } else {
        setCoverImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Edit Form View
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={cardStyles.container}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Client Information</h2>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            style={{padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.375rem'}}
          >
            Save
          </button>
        </div>

        {/* Images Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Images</h3>
          <div className="grid grid-cols-2 gap-4" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center" 
                style={{border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center'}}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-2" 
                    style={{width: '5rem', height: '5rem', borderRadius: '9999px', margin: '0 auto 0.5rem'}} />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{width: '5rem', height: '5rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span className="text-gray-400">+</span>
                  </div>
                )}
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('profile', file);
                  }}
                  className="hidden"
                  style={{display: 'none'}}
                />
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700"
                  style={{color: '#2563eb'}}
                  type="button"
                >
                  Click to add profile photo
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
                style={{border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center'}}>
                {coverImage ? (
                  <img src={coverImage} alt="Cover" className="w-full h-20 object-cover rounded mb-2"
                    style={{width: '100%', height: '5rem', objectFit: 'cover', borderRadius: '0.25rem', marginBottom: '0.5rem'}} />
                ) : (
                  <div className="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center"
                    style={{width: '100%', height: '5rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span className="text-gray-400">+</span>
                  </div>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('cover', file);
                  }}
                  className="hidden"
                  style={{display: 'none'}}
                />
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700"
                  style={{color: '#2563eb'}}
                  type="button"
                >
                  Click to add cover photo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Company Information</h3>
          <div className="grid grid-cols-2 gap-4" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
            {/* Row 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={editData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
              <input
                type="text"
                value={editData.industryType}
                onChange={(e) => handleInputChange('industryType', e.target.value)}
                placeholder="e.g., Technology, Healthcare"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>
            
            {/* Row 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
              <input
                type="url"
                value={editData.companyWebsite}
                onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                placeholder="https://company.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={editData.companyFacebookURL}
                onChange={(e) => handleInputChange('companyFacebookURL', e.target.value)}
                placeholder="https://facebook.com/company"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>
            
            {/* Row 3 - NEW FIELDS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={editData.instagramURL || ''}
                onChange={(e) => handleInputChange('instagramURL', e.target.value)}
                placeholder="https://instagram.com/company"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Ad Library URL</label>
              <input
                type="url"
                value={editData.facebookAdLibraryURL || ''}
                onChange={(e) => handleInputChange('facebookAdLibraryURL', e.target.value)}
                placeholder="https://facebook.com/ads/library"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>
            
            {/* Row 4 - NEW FIELDS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phoenix URL</label>
              <input
                type="url"
                value={editData.phoenixURL || ''}
                onChange={(e) => handleInputChange('phoenixURL', e.target.value)}
                placeholder="https://phoenix.platform.url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
              <input
                type="text"
                value={editData.companyAddress || ''}
                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                placeholder="123 Main St, City, State 12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
              />
            </div>
          </div>
        </div>

        {/* Contacts Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Contacts</h3>
            <button
              onClick={addContact}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              style={{padding: '0.25rem 0.75rem', backgroundColor: '#2563eb', color: 'white', fontSize: '0.875rem', borderRadius: '0.375rem'}}
              type="button"
            >
              + Add Contact
            </button>
          </div>
          
          {editData.contacts.length === 0 ? (
            <p className="text-gray-500 text-center py-4" style={{color: '#6b7280', textAlign: 'center', padding: '1rem 0'}}>No contacts added yet</p>
          ) : (
            <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {editData.contacts.map((contact, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4" style={{border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem'}}>
                  <div className="grid grid-cols-2 gap-4 mb-3" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '0.75rem'}}>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      placeholder="Contact Name"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                    />
                    <input
                      type="text"
                      value={contact.title}
                      onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                      placeholder="Job Title"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                    />
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                      placeholder="Email"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                    />
                    <input
                      type="tel"
                      value={contact.mobile}
                      onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                      placeholder="Mobile"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                    />
                  </div>
                  <button
                    onClick={() => removeContact(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                    style={{color: '#dc2626', fontSize: '0.875rem'}}
                    type="button"
                  >
                    Remove Contact
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={addContact}
            className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            style={{marginTop: '1rem', padding: '0.5rem 1rem', border: '1px solid #2563eb', color: '#2563eb', borderRadius: '0.375rem'}}
            type="button"
          >
            + Add First Contact
          </button>
        </div>

        {/* Business Overview Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Business Overview</h3>
          <textarea
            value={editData.businessDescription}
            onChange={(e) => handleInputChange('businessDescription', e.target.value)}
            placeholder="Enter a brief description of the business, its services, target market, and key value propositions..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', minHeight: '6rem'}}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3" style={{display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'}}>
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            style={{padding: '0.5rem 1rem', border: '1px solid #d1d5db', color: '#374151', borderRadius: '0.375rem'}}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            style={{padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.375rem'}}
            type="button"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  // Card View (Default) - PRODUCTION-SAFE IMPLEMENTATION WITH INLINE STYLES BACKUP
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6" style={cardStyles.container}>
      {/* Cover Photo with Mode Toggle */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative" style={cardStyles.coverPhoto}>
        {data.coverPhoto && (
          <img src={data.coverPhoto} alt="Cover" className="w-full h-full object-cover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        )}
        
        {/* Mode Toggle in top-right corner */}
        <div className="absolute top-4 right-4 flex items-center space-x-2" style={cardStyles.modeToggleContainer}>
          <span className="text-white text-sm font-medium" style={{color: 'white', fontSize: '0.875rem', fontWeight: '500'}}>Mode:</span>
          <div className="flex bg-white bg-opacity-20 rounded-lg p-1" style={cardStyles.modeToggleButtons}>
            <button
              onClick={() => setMode('leadgen')}
              className={mode === 'leadgen' 
                ? "px-3 py-1 text-xs font-medium rounded-md bg-white text-blue-600" 
                : "px-3 py-1 text-xs font-medium rounded-md text-white hover:bg-white hover:bg-opacity-20"}
              style={mode === 'leadgen' ? cardStyles.modeButtonActive : cardStyles.modeButtonInactive}
              type="button"
            >
              Lead Gen
            </button>
            <button
              onClick={() => setMode('retail')}
              className={mode === 'retail' 
                ? "px-3 py-1 text-xs font-medium rounded-md bg-white text-blue-600" 
                : "px-3 py-1 text-xs font-medium rounded-md text-white hover:bg-white hover:bg-opacity-20"}
              style={mode === 'retail' ? cardStyles.modeButtonActive : cardStyles.modeButtonInactive}
              type="button"
            >
              Retail
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 pb-4" style={cardStyles.profileSection}>
        <div className="flex items-start justify-between -mt-8" style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: '-2rem'}}>
          {/* Profile Picture */}
          <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
            <div className="w-16 h-16 bg-gray-200 rounded-full border-2 border-white overflow-hidden" style={cardStyles.profilePicture}>
              {data.profilePhoto ? (
                <img src={data.profilePhoto} alt="Profile" className="w-full h-full object-cover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span className="text-gray-400 text-xl" style={{color: '#9ca3af', fontSize: '1.25rem'}}>+</span>
                </div>
              )}
            </div>
            <div className="ml-4 pt-8" style={{marginLeft: '1rem', paddingTop: '2rem'}}>
              <h2 className="text-xl font-semibold" style={{fontSize: '1.25rem', fontWeight: '600'}}>{data.companyName || 'Company Name'}</h2>
              <p className="text-gray-600" style={{color: '#4b5563'}}>{data.industryType || 'Industry'}</p>
            </div>
          </div>
          
          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-8 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            style={cardStyles.editButton}
            type="button"
          >
            Edit
          </button>
        </div>
        
        {/* Company Details */}
        <div className="mt-6" style={{marginTop: '1.5rem'}}>
          <div className="flex items-center text-gray-600 mb-2" style={{display: 'flex', alignItems: 'center', color: '#4b5563', marginBottom: '0.5rem'}}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <a href={data.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" style={{color: '#2563eb', textDecoration: 'none'}}>
              {data.companyWebsite || 'Website not provided'}
            </a>
          </div>
          <div className="flex items-center text-gray-600" style={{display: 'flex', alignItems: 'center', color: '#4b5563'}}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{data.contacts?.length || 0} contacts</span>
          </div>
        </div>
        
        {/* Business Overview Section */}
        <div className="mt-6" style={{marginTop: '1.5rem'}}>
          <div className="flex justify-between items-center mb-2" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
            <h3 className="text-lg font-medium" style={{fontSize: '1.125rem', fontWeight: '500'}}>Business Overview</h3>
            <button
              onClick={() => setShowBusinessOverview(!showBusinessOverview)}
              className="text-blue-600 hover:text-blue-700 text-sm"
              style={{color: '#2563eb', fontSize: '0.875rem'}}
              type="button"
            >
              {showBusinessOverview ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showBusinessOverview && (
            <div className="bg-gray-50 p-4 rounded-lg" style={{backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem'}}>
              <p className="text-gray-700 whitespace-pre-wrap" style={{color: '#374151', whiteSpace: 'pre-wrap'}}>
                {data.businessDescription || 'No business description provided.'}
              </p>
              
              {/* Business Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-4" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem'}}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem'}}>Annual Website Visitors</label>
                  <input
                    type="number"
                    value={data.annualWebsiteVisitors || 0}
                    onChange={(e) => setData({...data, annualWebsiteVisitors: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem'}}>Annual Leads Generated</label>
                  <input
                    type="number"
                    value={data.annualLeadsGenerated || 0}
                    onChange={(e) => setData({...data, annualLeadsGenerated: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem'}}>Annual New Accounts Closed</label>
                  <input
                    type="number"
                    value={data.annualNewAccountsClosed || 0}
                    onChange={(e) => setData({...data, annualNewAccountsClosed: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem'}}>Annual Revenue ($)</label>
                  <input
                    type="number"
                    value={data.annualRevenue || 0}
                    onChange={(e) => setData({...data, annualRevenue: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                  />
                </div>
              </div>
              
              {/* Note about data flow */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4" style={{backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.375rem', padding: '0.75rem', marginTop: '1rem'}}>
                <p className="text-sm text-blue-800" style={{fontSize: '0.875rem', color: '#1e40af'}}>
                  <span className="font-medium" style={{fontWeight: '500'}}>Note:</span> These values automatically update the calculations in the Gaps & Opportunities card.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Social Interaction Buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200" style={cardStyles.socialButtons}>
          <button
            className="flex items-center text-gray-600 hover:text-blue-600"
            style={{display: 'flex', alignItems: 'center', color: '#4b5563'}}
            type="button"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '1.25rem', height: '1.25rem', marginRight: '0.25rem'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Like
          </button>
          <button
            className="flex items-center text-gray-600 hover:text-blue-600"
            style={{display: 'flex', alignItems: 'center', color: '#4b5563'}}
            type="button"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '1.25rem', height: '1.25rem', marginRight: '0.25rem'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Comment
          </button>
          <button
            className="flex items-center text-gray-600 hover:text-blue-600"
            style={{display: 'flex', alignItems: 'center', color: '#4b5563'}}
            type="button"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '1.25rem', height: '1.25rem', marginRight: '0.25rem'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;
