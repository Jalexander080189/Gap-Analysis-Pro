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
  instagramURL: string;
  facebookAdLibraryURL: string;
  phoenixURL: string;
  companyAddress: string;
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
  mode: 'leadgen' | 'retail';
  setMode: React.Dispatch<React.SetStateAction<'leadgen' | 'retail'>>;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData, mode, setMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ClientDataType>(data);
  const profileFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  // Update editData when data changes
  useEffect(() => {
    setEditData(data);
  }, [data]);

  const handleSave = () => {
    setData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  const handleAddContact = () => {
    setEditData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', email: '', mobile: '', title: '' }]
    }));
  };

  const handleRemoveContact = (index: number) => {
    setEditData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const handleContactChange = (index: number, field: keyof ContactType, value: string) => {
    setEditData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const handleImageUpload = (type: 'profile' | 'cover', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData(prev => ({
          ...prev,
          [type === 'profile' ? 'profileImage' : 'coverImage']: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // If editing, show the edit form
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Edit Client Information</h2>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>

          {/* Images Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Images</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {editData.profileImage ? (
                    <img src={editData.profileImage} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-2" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">+</span>
                    </div>
                  )}
                  <input
                    ref={profileFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('profile', e)}
                    className="hidden"
                  />
                  <button
                    onClick={() => profileFileRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700"
                    type="button"
                  >
                    Choose File
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {editData.coverImage ? (
                    <img src={editData.coverImage} alt="Cover" className="w-full h-20 object-cover rounded mb-2" />
                  ) : (
                    <div className="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">+</span>
                    </div>
                  )}
                  <input
                    ref={coverFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('cover', e)}
                    className="hidden"
                  />
                  <button
                    onClick={() => coverFileRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700"
                    type="button"
                  >
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Company Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={editData.companyName}
                  onChange={(e) => setEditData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
                <input
                  type="text"
                  value={editData.industryType}
                  onChange={(e) => setEditData(prev => ({ ...prev, industryType: e.target.value }))}
                  placeholder="e.g., Technology, Healthcare"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                <input
                  type="url"
                  value={editData.companyWebsite}
                  onChange={(e) => setEditData(prev => ({ ...prev, companyWebsite: e.target.value }))}
                  placeholder="https://company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={editData.companyFacebookURL}
                  onChange={(e) => setEditData(prev => ({ ...prev, companyFacebookURL: e.target.value }))}
                  placeholder="https://facebook.com/company"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={editData.instagramURL}
                  onChange={(e) => setEditData(prev => ({ ...prev, instagramURL: e.target.value }))}
                  placeholder="https://instagram.com/company"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Ad Library URL</label>
                <input
                  type="url"
                  value={editData.facebookAdLibraryURL}
                  onChange={(e) => setEditData(prev => ({ ...prev, facebookAdLibraryURL: e.target.value }))}
                  placeholder="https://facebook.com/ads/library"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phoenix URL</label>
                <input
                  type="url"
                  value={editData.phoenixURL}
                  onChange={(e) => setEditData(prev => ({ ...prev, phoenixURL: e.target.value }))}
                  placeholder="https://phoenix.platform.url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                <input
                  type="text"
                  value={editData.companyAddress}
                  onChange={(e) => setEditData(prev => ({ ...prev, companyAddress: e.target.value }))}
                  placeholder="123 Main St, City, State 12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Contacts</h3>
              <button
                onClick={handleAddContact}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                type="button"
              >
                + Add Contact
              </button>
            </div>
            
            {editData.contacts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No contacts added yet</p>
            ) : (
              editData.contacts.map((contact, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Contact {index + 1}</h4>
                    <button
                      onClick={() => handleRemoveContact(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      placeholder="Full Name"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                      placeholder="Email"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      value={contact.mobile}
                      onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                      placeholder="Mobile"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={contact.title}
                      onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                      placeholder="Title"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))
            )}
            
            <button
              onClick={handleAddContact}
              className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-md hover:border-blue-400 hover:text-blue-700"
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
              onChange={(e) => setEditData(prev => ({ ...prev, businessDescription: e.target.value }))}
              placeholder="Enter a brief description of the business, its services, target market, and key value propositions..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              type="button"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default card view (LinkedIn-style)
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {data.coverImage && (
          <img src={data.coverImage} alt="Cover" className="w-full h-full object-cover" />
        )}
        {/* Mode Toggle - positioned in top right of cover */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <span className="text-white text-sm font-medium">Mode:</span>
          <div className="flex bg-white/20 rounded-md p-1">
            <button
              onClick={() => setMode('leadgen')}
              className={`px-3 py-1 text-xs font-medium rounded ${
                mode === 'leadgen'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-white/20'
              }`}
              type="button"
            >
              Lead Gen
            </button>
            <button
              onClick={() => setMode('retail')}
              className={`px-3 py-1 text-xs font-medium rounded ${
                mode === 'retail'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-white/20'
              }`}
              type="button"
            >
              Retail
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 pb-6">
        <div className="flex items-start justify-between -mt-16 mb-4">
          <div className="flex items-end space-x-4">
            {/* Profile Picture */}
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
              {data.profileImage ? (
                <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                  <span className="text-white text-2xl">?</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-16 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            type="button"
          >
            Edit
          </button>
        </div>

        {/* Company Info */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            {data.companyName || 'Company Name'}
            <span className="ml-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </span>
          </h1>
          <p className="text-gray-600">{data.industryType || 'Industry Type'}</p>
          <p className="text-gray-500 text-sm flex items-center mt-1">
            <span className="mr-1">📍</span>
            {data.companyAddress || 'United States'}
          </p>
          <p className="text-blue-600 text-sm mt-1">
            {data.contacts.length} contact{data.contacts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Business Overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Business Overview</h3>
            <button
              onClick={() => setData(prev => ({ ...prev, showBack: !prev.showBack }))}
              className="text-blue-600 hover:text-blue-700 text-sm"
              type="button"
            >
              {data.showBack ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {data.showBack && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {data.businessDescription || 'No business description provided yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Social Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" type="button">
            <span>👍</span>
            <span className="text-sm">Like</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" type="button">
            <span>💬</span>
            <span className="text-sm">Comment</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600" type="button">
            <span>🔗</span>
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;

