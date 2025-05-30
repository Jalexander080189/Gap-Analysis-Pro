'use client';

import React, { useState } from 'react';

// Define the exact type to match clientpage.tsx
interface ClientData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  businessDescription: string;
  showBack: boolean;
}

// Updated interface with exact types matching clientpage.tsx
interface ClientInformationProps {
  data: ClientData;
  setData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, setData }) => {
  const [showBusinessOverview, setShowBusinessOverview] = useState(false);
  
  // Add state for social interactions
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const handleBusinessDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData({
      ...data,
      businessDescription: e.target.value
    });
  };

  const handleSave = () => {
    setSaved(true);
    
    // Generate unique URL based on company name
    const companySlug = data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    window.history.pushState({}, '', `/reports/${companySlug}`);
  };

  const handleEdit = () => {
    setSaved(false);
  };
  
  // Add event handlers for social interactions
  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleCommentClick = () => {
    setCommentOpen(!commentOpen);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText('');
    }
  };

  const handleShareClick = () => {
    setShared(!shared);
  };

  const handleFlipCard = () => {
    setData({
      ...data,
      showBack: !data.showBack
    });
  };

  return (
    <div className="card">
      {saved ? (
        <div>
          <div className="profile-header mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                {data.companyName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{data.companyName}</h2>
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
                <h3 className="font-medium text-gray-700 mb-1">Contact Information</h3>
                <p>{data.contactName}</p>
                <p className="text-sm text-gray-500">{data.contactEmail}</p>
                <p className="text-sm text-gray-500">{data.contactPhone}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Business Type</h3>
                <p>{data.businessType}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <h3 className="font-medium text-gray-700">Business Description</h3>
              <button
                onClick={() => setShowBusinessOverview(!showBusinessOverview)}
                className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                type="button"
              >
                {showBusinessOverview ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showBusinessOverview && (
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {data.businessDescription}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="section-title">Client Information</h2>
          
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
          
          <div className="mb-6">
            <h3 className="card-title">Contact Information</h3>
            
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
          </div>
          
          <div className="mb-6">
            <h3 className="card-title">Business Description</h3>
            
            <textarea
              value={data.businessDescription}
              onChange={handleBusinessDescriptionChange}
              className="w-full border border-gray-300 p-3 rounded h-40"
              placeholder="Enter business description here..."
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={!data.companyName || !data.contactName}
            className={`button-primary ${(!data.companyName || !data.contactName) ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="button"
          >
            Save Client Information
          </button>
        </div>
      )}
      
      <div className="mt-4 flex items-center space-x-2">
        {/* Refactored Like button with React event handler */}
        <button 
          className={`social-button ${liked ? 'bg-blue-100' : ''}`}
          onClick={handleLikeClick}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          {liked ? 'Liked' : 'Like'}
        </button>
        
        {/* Refactored Comment button with React event handler */}
        <button 
          className={`social-button ${commentOpen ? 'bg-blue-100' : ''}`}
          onClick={handleCommentClick}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comment
        </button>
        
        {/* Refactored Share button with React event handler */}
        <button 
          className={`social-button ${shared ? 'bg-blue-100' : ''}`}
          onClick={handleShareClick}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {shared ? 'Shared' : 'Share'}
        </button>
      </div>
      
      {/* Comment form - conditionally rendered */}
      {commentOpen && (
        <div className="mt-2 p-3 border border-gray-200 rounded-lg">
          <textarea 
            value={commentText}
            onChange={handleCommentChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Write a comment..."
            rows={2}
          />
          <button 
            onClick={handleCommentSubmit}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            type="button"
          >
            Submit
          </button>
        </div>
      )}
      
      {/* Comments list */}
      {comments.length > 0 && (
        <div className="mt-2 p-3 border border-gray-200 rounded-lg">
          <h4 className="font-medium mb-2">Comments</h4>
          {comments.map((comment, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded mb-1">{comment}</div>
          ))}
        </div>
      )}
      
      {/* Flip card button */}
      <button 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={handleFlipCard}
        type="button"
      >
        {data.showBack ? 'Show Front' : 'Show Back'}
      </button>
    </div>
  );
};

export default ClientInformation;