'use client';

import React, { useState } from 'react';

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
  facebookAdLibraryURL: string;
  instagramURL: string;
  phoenixURL: string;
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

interface GPTDataBlockProps {
  data: {
    gptAnalysis: string;
    gptRecommendations: string;
    showBack: boolean;
  };
  setData: React.Dispatch<React.SetStateAction<{
    gptAnalysis: string;
    gptRecommendations: string;
    showBack: boolean;
  }>>;
}

const GPTDataBlock: React.FC<GPTDataBlockProps> = ({ data, setData }) => {
  const [jsonData, setJsonData] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
  };

  const handleAutoFill = () => {
    try {
      // Try to parse the JSON data
      const parsedData = JSON.parse(jsonData);
      
      // Update GPT data if available
      if (parsedData.gptAnalysis || parsedData.gptRecommendations) {
        setData(prev => ({
          ...prev,
          gptAnalysis: parsedData.gptAnalysis || prev.gptAnalysis,
          gptRecommendations: parsedData.gptRecommendations || prev.gptRecommendations
        }));
      }
      
      alert('Data successfully auto-filled!');
    } catch (error) {
      alert('Error parsing JSON data. Please check the format and try again.');
      console.error('Error parsing JSON data:', error);
    }
  };

  const toggleBack = () => {
    setData(prev => ({ ...prev, showBack: !prev.showBack }));
  };

  if (data.showBack) {
    return (
      <div className="card">
        <div className="card-back">
          <button onClick={toggleBack} className="back-button">
            ← Back to Front
          </button>
          <h3 className="text-lg font-semibold mb-4">GPT Analysis Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPT Analysis
              </label>
              <textarea
                value={data.gptAnalysis}
                onChange={(e) => setData(prev => ({ ...prev, gptAnalysis: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Enter GPT analysis..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPT Recommendations
              </label>
              <textarea
                value={data.gptRecommendations}
                onChange={(e) => setData(prev => ({ ...prev, gptRecommendations: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Enter GPT recommendations..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="section-title">GPT Data Block</h2>
        <button onClick={toggleBack} className="edit-button">
          Edit
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paste structured JSON/CSV data here
        </label>
        <textarea
          value={jsonData}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
          placeholder="Paste JSON data here..."
        />
      </div>
      
      <button
        onClick={handleAutoFill}
        className="button-primary mb-4"
        disabled={!jsonData}
      >
        Auto-Fill Form Data
      </button>

      {/* Display current GPT data */}
      <div className="space-y-3">
        {data.gptAnalysis && (
          <div>
            <h4 className="font-medium text-gray-700">Analysis:</h4>
            <p className="text-sm text-gray-600">{data.gptAnalysis}</p>
          </div>
        )}
        {data.gptRecommendations && (
          <div>
            <h4 className="font-medium text-gray-700">Recommendations:</h4>
            <p className="text-sm text-gray-600">{data.gptRecommendations}</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comment
        </button>
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};

export default GPTDataBlock;

