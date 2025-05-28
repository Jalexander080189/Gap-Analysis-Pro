'use client';

import React, { useState, useEffect } from 'react';
import { parseHumanFriendlyNumber, formatPercentage } from '../../utils/numberFormatting';

interface SBAMarketingBudgetProps {
  data: {
    annualRevenue: string;
    recommendedMarketingBudget: number;
    recommendedMonthlyBudget: number;
    currentMonthlySpend: number;
    additionalMonthlyBudgetNeeded: number;
    percentOfRevenueSpent: number;
  };
  setData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  totalMonthlySpend: number;
}

const SBAMarketingBudget: React.FC<SBAMarketingBudgetProps> = ({ 
  data, 
  setData, 
  totalMonthlySpend 
}) => {
  // Add state for social interactions
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [shared, setShared] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
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

  // Calculate budget recommendations when inputs change
  useEffect(() => {
    const annualRevenue = parseHumanFriendlyNumber(data.annualRevenue);
    
    // SBA recommends 7-8% of revenue for marketing
    const recommendedMarketingBudget = annualRevenue * 0.08;
    const recommendedMonthlyBudget = recommendedMarketingBudget / 12;
    
    // Calculate additional budget needed
    const additionalMonthlyBudgetNeeded = recommendedMonthlyBudget - totalMonthlySpend;
    
    // Calculate percentage of revenue spent
    const percentOfRevenueSpent = annualRevenue > 0 ? (totalMonthlySpend * 12) / annualRevenue : 0;
    
    setData({
      ...data,
      recommendedMarketingBudget,
      recommendedMonthlyBudget,
      currentMonthlySpend: totalMonthlySpend,
      additionalMonthlyBudgetNeeded,
      percentOfRevenueSpent
    });
  }, [data.annualRevenue, totalMonthlySpend, data, setData]);

  return (
    <div className="card">
      <h2 className="section-title">SBA Marketing Budget</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          The Small Business Administration (SBA) recommends that businesses spend 7-8% of their gross revenue on marketing.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Revenue
          </label>
          <input
            type="text"
            name="annualRevenue"
            value={data.annualRevenue}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g. $1M or $1,000,000"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Budget Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Recommended Marketing Budget (8%)</p>
            <p className="font-medium">${Math.round(data.recommendedMarketingBudget).toLocaleString()}/year</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Recommended Monthly Budget</p>
            <p className="font-medium">${Math.round(data.recommendedMonthlyBudget).toLocaleString()}/month</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Monthly Spend</p>
            <p className="font-medium">${Math.round(data.currentMonthlySpend).toLocaleString()}/month</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Additional Monthly Budget Needed</p>
            <p className="font-medium">${Math.round(data.additionalMonthlyBudgetNeeded).toLocaleString()}/month</p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 mb-1">Percentage of Revenue Spent on Marketing</p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className={`h-2.5 rounded-full ${data.percentOfRevenueSpent >= 0.08 ? 'bg-green-600' : 'bg-red-600'}`} 
                  style={{ width: `${Math.min(data.percentOfRevenueSpent * 100, 100)}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${data.percentOfRevenueSpent >= 0.08 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(data.percentOfRevenueSpent)}
              </span>
            </div>
            <p className="text-xs mt-1">
              {data.percentOfRevenueSpent >= 0.08 
                ? 'You are meeting or exceeding the SBA recommendation.' 
                : 'You are below the SBA recommended marketing budget.'}
            </p>
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

export default SBAMarketingBudget;
