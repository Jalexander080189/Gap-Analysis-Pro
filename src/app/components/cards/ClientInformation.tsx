'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

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
  profileImage?: string; // New field for profile image
  coverImage?: string; // New field for cover image
  
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

  // Default Drive Social Media logo for cover if none provided
  const defaultCoverImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='200' viewBox='0 0 800 200'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23333333;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='200' fill='url(%23grad1)' /%3E%3Cg transform='translate(200,100)'%3E%3Cpath d='M-30,-30 L30,-30 L30,30 L-30,30 Z' fill='none' stroke='white' stroke-width='2' /%3E%3Ccircle cx='60' cy='-60' r='15' stroke='white' stroke-width='2' fill='none' /%3E%3Cpath d='M60,-70 L60,-50 M50,-60 L70,-60' stroke='white' stroke-width='2' /%3E%3C/g%3E%3Cg transform='translate(600,100)'%3E%3Cpath d='M-50,0 L50,0 M0,-50 L0,50' stroke='white' stroke-width='1' stroke-dasharray='5,5' /%3E%3C/g%3E%3Cpath d='M650,50 L750,50 L700,150 Z' fill='%23FF5555' fill-opacity='0.7' /%3E%3Cpath d='M50,50 L150,50 L100,150 Z' fill='%2355AAFF' fill-opacity='0.7' /%3E%3C/svg%3E";

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

  const handleBusinessOverviewChange = (content: string) => {
    setData(prevData => ({
      ...prevData,
      businessDescription: content
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="card">
      {!data.showBack ? (
        <div>
          {/* Compact LinkedIn-style profile header */}
          <div className="relative">
            {/* Cover photo - reduced height */}
            <div className="relative h-24 bg-black overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" 
                   style={{ backgroundImage: `url(${data.coverImage || defaultCoverImage})` }}>
                {/* Edit cover button - smaller and more subtle */}
                <button 
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute top-2 right-2 bg-white bg-opacity-75 p-1 rounded-full hover:bg-opacity-100 transition-all"
                  aria-label="Edit cover photo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <input 
                  ref={coverInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleCoverImageUpload} 
                  className="hidden" 
                  aria-label="Upload cover photo"
                />
              </div>
            </div>

            {/* Profile image - smaller size */}
            <div 
              className={`absolute left-4 -bottom-8 w-16 h-16 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-md ${dragActive ? 'ring-2 ring-blue-500' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => profileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              {data.profileImage ? (
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${data.profileImage})` }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                  {data.companyName ? data.companyName.charAt(0) : '?'}
                </div>
              )}
              <input 
                ref={profileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleProfileImageUpload} 
                className="hidden" 
                aria-label="Upload profile photo"
              />
            </div>

            {/* Edit profile button - smaller and more subtle */}
            <button
              type="button"
              onClick={toggleEdit}
              className="absolute top-2 right-8 bg-white bg-opacity-75 p-1 rounded-full hover:bg-opacity-100 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          {/* Compact profile information */}
          <div className="pt-10 px-4 pb-3">
            <div className="flex flex-col">
              {/* Name with verification badge - more compact */}
              <div className="flex items-center">
                <h1 className="text-lg font-bold text-gray-900">{data.companyName || 'Company Name'}</h1>
                <svg className="ml-1 h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* Job title and company - more compact */}
              <p className="text-sm text-gray-700">
                {data.contacts && data.contacts[0]?.title ? data.contacts[0].title : 'Job Title'} at {data.companyName || 'Company Name'}
              </p>
              
              {/* Company and location - more compact */}
              <div className="mt-1">
                <p className="text-xs text-gray-600">{data.industryType || 'Industry'}</p>
              </div>
              
              {/* Website and social links - more compact */}
              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                {data.companyWebsite && (
                  <a 
                    href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </a>
                )}
                
                {data.companyFacebookURL && (
                  <a 
                    href={data.companyFacebookURL.startsWith('http') ? data.companyFacebookURL : `https://${data.companyFacebookURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                )}
              </div>
            </div>
            
            {/* Contacts Section - more compact */}
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Contacts</h3>
              
              {data.contacts && data.contacts.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {data.contacts.map((contact, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                      {contact.name && <p className="font-medium">{contact.name}</p>}
                      {contact.title && <p className="text-gray-600">{contact.title}</p>}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        )}
                        {contact.mobile && (
                          <a href={`tel:${contact.mobile}`} className="text-blue-600 hover:underline">
                            {contact.mobile}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No contacts added</p>
              )}
            </div>
            
            {/* Business Overview Section - more compact */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-700">Business Overview</h3>
                <button
                  type="button"
                  onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {showBusinessOverview ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showBusinessOverview && (
                <div className="bg-gray-50 p-2 rounded text-xs" dangerouslySetInnerHTML={{ __html: data.businessDescription || '' }} />
              )}
            </div>
          </div>
          
          {/* Social interaction buttons - more compact */}
          <div className="px-4 py-2 border-t border-gray-200 flex items-center space-x-3">
            <button type="button" className="flex items-center text-xs text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Like
            </button>
            <button type="button" className="flex items-center text-xs text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Comment
            </button>
            <button type="button" className="flex items-center text-xs text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold text-gray-900">Edit Profile</h2>
            <button
              type="button"
              onClick={toggleEdit}
              className="px-2 py-1 text-xs bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Save Client Data
            </button>
          </div>
          
          {/* Company Information - more compact */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Company Information</h3>
            
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={data.companyName || ''}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Industry Type
              </label>
              <input
                type="text"
                name="industryType"
                value={data.industryType || ''}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter industry type"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Company Website
              </label>
              <input
                type="url"
                name="companyWebsite"
                value={data.companyWebsite || ''}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Company Facebook URL
              </label>
              <input
                type="url"
                name="companyFacebookURL"
                value={data.companyFacebookURL || ''}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://facebook.com/example"
              />
            </div>

            {/* Profile and Cover Image Upload - more compact */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <div 
                  className={`w-16 h-16 rounded-full border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 ${dragActive ? 'border-blue-500 bg-blue-50' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => profileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  {data.profileImage ? (
                    <div className="w-full h-full bg-cover bg-center rounded-full" style={{ backgroundImage: `url(${data.profileImage})` }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  <input 
                    ref={profileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileImageUpload} 
                    className="hidden" 
                    aria-label="Upload profile photo"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cover Image
                </label>
                <div 
                  className="w-full h-16 border border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                  onClick={() => coverInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  {data.coverImage ? (
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${data.coverImage})` }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  <input 
                    ref={coverInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleCoverImageUpload} 
                    className="hidden" 
                    aria-label="Upload cover photo"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Contacts Section - more compact */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-900">Contacts ({(data.contacts || []).length}/5)</h3>
              {(data.contacts || []).length < 5 && (
                <button
                  type="button"
                  onClick={addContact}
                  className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add
                </button>
              )}
            </div>
            
            {data.contacts && data.contacts.length > 0 ? (
              <div className="space-y-2">
                {data.contacts.map((contact, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded relative text-xs">
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                      aria-label="Remove contact"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Contact name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={contact.title}
                          onChange={(e) => handleContactChange(index, 'title', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Job title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Email address"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mobile
                        </label>
                        <input
                          type="tel"
                          value={contact.mobile}
                          onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-2 rounded text-center text-xs">
                <p className="text-gray-500 mb-1">No contacts added yet</p>
                <button
                  type="button"
                  onClick={addContact}
                  className="px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add First Contact
                </button>
              </div>
            )}
          </div>
          
          {/* Business Overview - more compact */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Business Overview</h3>
            
            {typeof window !== 'undefined' && (
              <ReactQuill
                value={data.businessDescription || ''}
                onChange={handleBusinessOverviewChange}
                modules={modules}
                className="bg-white border border-gray-300 rounded text-xs h-24"
                placeholder="Describe your business..."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInformation;
