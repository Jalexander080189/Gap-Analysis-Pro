'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Define the client data interface for page.tsx (new structure)
interface ClientDataTypeNew {
  primaryOwner: {
    name: string;
    email: string;
    phone: string;
  };
  secondaryOwner: {
    name: string;
    email: string;
    phone: string;
  };
  companyName: string;
  companyUrl: string;
  companyFacebookUrl: string;
  businessOverview: string;
  saved: boolean;
}

// Define the client data interface for clientpage.tsx (old structure)
interface ClientDataTypeOld {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  businessDescription: string;
  showBack: boolean;
}

// Union type to support both interfaces
type ClientDataType = ClientDataTypeNew | ClientDataTypeOld;

// Helper function to determine which interface is being used
function isNewClientDataType(data: ClientDataType): data is ClientDataTypeNew {
  return 'primaryOwner' in data;
}

// Updated interface with properly typed setData
interface ClientInformationProps {
  data: ClientDataType;
  setData: React.Dispatch<React.SetStateAction<ClientDataType>>;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData }) => {
  const [showBusinessOverview, setShowBusinessOverview] = useState(false);

  // Handle input changes based on data structure
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (isNewClientDataType(data)) {
      // Handle new data structure (primaryOwner, secondaryOwner)
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setData({
          ...data,
          [parent]: {
            ...data[parent as keyof typeof data],
            [child]: value
          }
        });
      } else {
        setData({
          ...data,
          [name]: value
        });
      }
    } else {
      // Handle old data structure (contactName, contactEmail)
      setData({
        ...data,
        [name]: value
      });
    }
  };

  // Handle business overview/description changes based on data structure
  const handleBusinessOverviewChange = (content: string) => {
    if (isNewClientDataType(data)) {
      setData({
        ...data,
        businessOverview: content
      });
    } else {
      setData({
        ...data,
        businessDescription: content
      });
    }
  };

  // Handle save based on data structure
  const handleSave = () => {
    if (isNewClientDataType(data)) {
      setData({
        ...data,
        saved: true
      });
      
      // Generate unique URL based on company name
      const companySlug = data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      window.history.pushState({}, '', `/reports/${companySlug}`);
    } else {
      setData({
        ...data,
        showBack: true
      });
    }
  };

  // Handle edit based on data structure
  const handleEdit = () => {
    if (isNewClientDataType(data)) {
      setData({
        ...data,
        saved: false
      });
    } else {
      setData({
        ...data,
        showBack: false
      });
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  // Determine if we should show the saved view
  const showSavedView = isNewClientDataType(data) ? data.saved : data.showBack;

  // Get the appropriate content for display
  const getCompanyName = () => isNewClientDataType(data) ? data.companyName : data.companyName;
  const getContactName = () => isNewClientDataType(data) ? data.primaryOwner.name : data.contactName;
  const getContactEmail = () => isNewClientDataType(data) ? data.primaryOwner.email : data.contactEmail;
  const getContactPhone = () => isNewClientDataType(data) ? data.primaryOwner.phone : data.contactPhone;
  const getBusinessDescription = () => isNewClientDataType(data) ? data.businessOverview : data.businessDescription;
  const getCompanyUrl = () => isNewClientDataType(data) ? data.companyUrl : '';
  const getCompanyFacebookUrl = () => isNewClientDataType(data) ? data.companyFacebookUrl : '';

  return (
    <div className="card">
      {showSavedView ? (
        <div>
          <div className="profile-header mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                {getCompanyName().charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{getCompanyName()}</h2>
                <div className="flex space-x-2 text-sm text-gray-500">
                  {getCompanyUrl() && (
                    <a href={getCompanyUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                      Website
                    </a>
                  )}
                  {getCompanyFacebookUrl() && (
                    <a href={getCompanyFacebookUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                      Facebook
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={handleEdit}
                className="ml-auto px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                type="button"
              >
                Edit
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Primary Contact</h3>
                <p>{getContactName()}</p>
                <p className="text-sm text-gray-500">{getContactEmail()}</p>
                <p className="text-sm text-gray-500">{getContactPhone()}</p>
              </div>
              
              {isNewClientDataType(data) && (data.secondaryOwner.name || data.secondaryOwner.email || data.secondaryOwner.phone) && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Secondary Owner</h3>
                  <p>{data.secondaryOwner.name}</p>
                  <p className="text-sm text-gray-500">{data.secondaryOwner.email}</p>
                  <p className="text-sm text-gray-500">{data.secondaryOwner.phone}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <h3 className="font-medium text-gray-700">Business Overview</h3>
              <button
                onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                type="button"
              >
                {showBusinessOverview ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showBusinessOverview && (
              <div className="bg-gray-50 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: getBusinessDescription() }} />
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="section-title">Client Information</h2>
          
          {isNewClientDataType(data) ? (
            // New data structure form (primaryOwner, secondaryOwner)
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="card-title">Primary Owner</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="primaryOwner.name"
                      value={data.primaryOwner.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="primaryOwner.email"
                      value={data.primaryOwner.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="primaryOwner.phone"
                      value={data.primaryOwner.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="card-title">Secondary Owner (Optional)</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="secondaryOwner.name"
                      value={data.secondaryOwner.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="secondaryOwner.email"
                      value={data.secondaryOwner.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="secondaryOwner.phone"
                      value={data.secondaryOwner.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="card-title">Company Information</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={data.companyName}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company URL
                  </label>
                  <input
                    type="url"
                    name="companyUrl"
                    value={data.companyUrl}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Facebook URL
                  </label>
                  <input
                    type="url"
                    name="companyFacebookUrl"
                    value={data.companyFacebookUrl}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://facebook.com/example"
                  />
                </div>
              </div>
            </>
          ) : (
            // Old data structure form (contactName, contactEmail)
            <div className="mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={data.companyName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={data.contactName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={data.contactEmail}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={data.contactPhone}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <input
                  type="text"
                  name="businessType"
                  value={data.businessType}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="card-title">Business Overview</h3>
            
            {typeof window !== 'undefined' && (
              <ReactQuill
                value={getBusinessDescription()}
                onChange={handleBusinessOverviewChange}
                modules={modules}
                className="bg-white"
              />
            )}
          </div>
          
          <button
            onClick={handleSave}
            disabled={!getCompanyName() || !getContactName()}
            className={`button-primary ${(!getCompanyName() || !getContactName()) ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="button"
          >
            Save Client Information
          </button>
        </div>
      )}
      
      <div className="mt-4 flex items-center space-x-2">
        <button className="social-button" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>
        <button className="social-button" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comment
        </button>
        <button className="social-button" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};

export default ClientInformation;
