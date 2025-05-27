'use client';

import React from 'react';

interface ClientData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  businessDescription: string;
  showBack: boolean;
}

interface ClientInformationProps {
  data: ClientData;
  setData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setData({
      ...data,
      [name]: value
    });
  };

  const handleSave = () => {
    console.log('Saving client information:', data);
    // Here you would typically save to a database or API
    alert('Client information saved!');
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Client Information</h2>
        <button 
          onClick={handleSave}
          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
          type="button"
        >
          Save Client Information
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={data.companyName}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., Acme Corporation"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            name="contactName"
            value={data.contactName}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            name="contactEmail"
            value={data.contactEmail}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., john@acme.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={data.contactPhone}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Type
          </label>
          <input
            type="text"
            name="businessType"
            value={data.businessType}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., B2B Software"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Description
          </label>
          <textarea
            name="businessDescription"
            value={data.businessDescription}
            onChange={handleInputChange}
            className="input-field h-24"
            placeholder="Brief description of the business..."
          />
        </div>
      </div>
      
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
