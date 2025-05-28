'use client';

import React, { useState, useEffect } from 'react';
import { parseHumanFriendlyNumber, formatPercentage } from '../../utils/numberFormatting';

interface ScenariosProps {
  data: {
    visibilityReachImprovement: number;
    leadGenerationImprovement: number;
    closeRateImprovement: number;
    additionalLeads: number;
    additionalClosedAccounts: number;
    additionalRevenue: number;
    totalCalculatedAnnualRevenue: number;
  };
  setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  annualRevenue: number;
  visibilityReachGap: number;
  leadGenGap: number;
  closeRateGap: number;
  annualWebsiteVisitors: number;
  annualLeadsGenerated: number;
  annualNewAccountsClosed: number;
  avgYearlyCustomerValue: number;
}

const Scenarios: React.FC<ScenariosProps> = ({
  data,
  setData,
  annualRevenue,
  visibilityReachGap,
  leadGenGap,
  closeRateGap,
  annualWebsiteVisitors,
  annualLeadsGenerated,
  annualNewAccountsClosed,
  avgYearlyCustomerValue
}) => {
  // Add state for social interactions
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [shared, setShared] = useState(false);

  // Set initial slider values
  useEffect(() => {
    // Initial values for sliders
    const initialVisibilityReachImprovement = 0.05; // 5%
    const initialLeadGenerationImprovement = 0.20; // 20%
    const initialCloseRateImprovement = 0.20; // 20%
    
    setData({
      ...data,
      visibilityReachImprovement: initialVisibilityReachImprovement,
      leadGenerationImprovement: initialLeadGenerationImprovement,
      closeRateImprovement: initialCloseRateImprovement
    });
  }, [setData, data]);

  // Calculate scenario results when inputs change
  useEffect(() => {
    // Calculate additional website visitors
    const baseVisitors = annualWebsiteVisitors;
    const improvedVisitors = baseVisitors / (1 - visibilityReachGap * data.visibilityReachImprovement);
    const additionalVisitors = improvedVisitors - baseVisitors;
    
    // Calculate additional leads
    const baseLeadConversion = annualLeadsGenerated / annualWebsiteVisitors;
    const improvedLeadConversion = baseLeadConversion + (leadGenGap * data.leadGenerationImprovement);
    const additionalLeads = (additionalVisitors * baseLeadConversion) + 
                           (improvedVisitors * (improvedLeadConversion - baseLeadConversion));
    
    // Calculate additional closed accounts
    const baseCloseRate = annualNewAccountsClosed / annualLeadsGenerated;
    const improvedCloseRate = baseCloseRate + (closeRateGap * data.closeRateImprovement);
    const additionalClosedAccounts = (additionalLeads * baseCloseRate) + 
                                    ((annualLeadsGenerated + additionalLeads) * (improvedCloseRate - baseCloseRate));
    
    // Calculate additional revenue
    const additionalRevenue = additionalClosedAccounts * avgYearlyCustomerValue;
    
    // Calculate total revenue
    const totalCalculatedAnnualRevenue = annualRevenue + additionalRevenue;
    
    setData({
      ...data,
      additionalLeads,
      additionalClosedAccounts,
      additionalRevenue,
      totalCalculatedAnnualRevenue
    });
  }, [
    data.visibilityReachImprovement,
    data.leadGenerationImprovement,
    data.closeRateImprovement,
    annualRevenue,
    visibilityReachGap,
    leadGenGap,
    closeRateGap,
    annualWebsiteVisitors,
    annualLeadsGenerated,
    annualNewAccountsClosed,
    avgYearlyCustomerValue,
    data,
    setData
  ]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: parseFloat(value)
    });
  };
  
  // Add event handlers for social interactions
  const handleLikeClick = () => {
    setLiked(!liked);
    console.log('Like button clicked, new state:', !liked);
  };

  const handleCommentClick = () => {
    setCommentOpen(!commentOpen);
    console.log('Comment button clicked, new state:', !commentOpen);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText('');
      console.log('Comment submitted:', commentText);
    }
  };

  const handleShareClick = () => {
    setShared(!shared);
    console.log('Share button clicked, new state:', !shared);
  };

  return (
    <div className="card">
      <h2 className="section-title">Scenarios</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Adjust the sliders below to see how improvements in each area would impact your business.
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Visibility Reach Improvement</span>
            <span className="text-sm text-gray-600">{formatPercentage(data.visibilityReachImprovement)}</span>
          </div>
          <input
            type="range"
            name="visibilityReachImprovement"
            min="0"
            max="1"
            step="0.01"
            value={data.visibilityReachImprovement}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">
            What if you could reach more of your potential customers?
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Lead Generation Improvement</span>
            <span className="text-sm text-gray-600">{formatPercentage(data.leadGenerationImprovement)}</span>
          </div>
          <input
            type="range"
            name="leadGenerationImprovement"
            min="0"
            max="1"
            step="0.01"
            value={data.leadGenerationImprovement}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">
            What if you could convert more visitors into leads?
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Close Rate Improvement</span>
            <span className="text-sm text-gray-600">{formatPercentage(data.closeRateImprovement)}</span>
          </div>
          <input
            type="range"
            name="closeRateImprovement"
            min="0"
            max="1"
            step="0.01"
            value={data.closeRateImprovement}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">
            What if you could close more of your leads?
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Scenario Results</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Additional Leads</p>
            <p className="font-medium">{Math.round(data.additionalLeads).toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Additional Closed Accounts</p>
            <p className="font-medium">{Math.round(data.additionalClosedAccounts).toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Additional Revenue</p>
            <p className="font-medium">${Math.round(data.additionalRevenue).toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Calculated Annual Revenue</p>
            <p className="font-medium">${Math.round(data.totalCalculatedAnnualRevenue).toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        {/* Refactored Like button with React event handler */}
        <button 
          className={`social-button ${liked ? 'bg-blue-100' : ''}`}
          onClick={handleLikeClick}
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
    </div>
  );
};

export default Scenarios;
