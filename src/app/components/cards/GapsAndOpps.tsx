'use client';

import React, { useState, useEffect } from 'react';
import { parseHumanFriendlyNumber, formatPercentage } from '../../utils/numberFormatting';

// Define the exact type to match clientpage.tsx
interface GapsData {
  mode: "leadgen" | "retail";
  leadgen: {
    annualWebsiteVisitors: string;
    annualLeadsGenerated: string;
    annualNewAccountsClosed: string;
    visibilityReachGap: number;
    leadGenGap: number;
    closeRateGap: number;
  };
  retail: {
    annualStoreVisitors: string;
    annualNewAccountsClosed: string;
    visibilityReachGap: number;
    closeRateGap: number;
  };
  showBack: boolean;
}

interface GapsAndOppsProps {
  data: GapsData;
  setData: React.Dispatch<React.SetStateAction<GapsData>>;
  calculatedBuyers: number;
}

const GapsAndOpps: React.FC<GapsAndOppsProps> = ({ data, setData, calculatedBuyers }) => {
  // Add state for social interactions
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [shared, setShared] = useState(false);

  const handleModeChange = (mode: "leadgen" | "retail") => {
    setData({
      ...data,
      mode
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'leadgen') {
        setData({
          ...data,
          leadgen: {
            ...data.leadgen,
            [child]: value
          }
        });
      } else if (parent === 'retail') {
        setData({
          ...data,
          retail: {
            ...data.retail,
            [child]: value
          }
        });
      }
    } else {
      setData({
        ...data,
        [name]: value as string // Changed from 'any' to 'string' to fix TypeScript error
      });
    }
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

  // Calculate lead gen gaps when inputs change
  useEffect(() => {
    if (data.mode === 'leadgen') {
      const annualWebsiteVisitors = parseHumanFriendlyNumber(data.leadgen.annualWebsiteVisitors);
      const annualLeadsGenerated = parseHumanFriendlyNumber(data.leadgen.annualLeadsGenerated);
      const annualNewAccountsClosed = parseHumanFriendlyNumber(data.leadgen.annualNewAccountsClosed);
      
      // Calculate visibility reach gap
      const visibilityReachGap = calculatedBuyers > 0 ? 1 - (annualWebsiteVisitors / calculatedBuyers) : 0;
      
      // Calculate lead gen gap
      const leadGenGap = annualWebsiteVisitors > 0 ? 1 - (annualLeadsGenerated / annualWebsiteVisitors) : 0;
      
      // Calculate close rate gap
      const closeRateGap = annualLeadsGenerated > 0 ? 1 - (annualNewAccountsClosed / annualLeadsGenerated) : 0;
      
      setData({
        ...data,
        leadgen: {
          ...data.leadgen,
          visibilityReachGap: Math.min(1, Math.max(0, visibilityReachGap)),
          leadGenGap: Math.min(1, Math.max(0, leadGenGap)),
          closeRateGap: Math.min(1, Math.max(0, closeRateGap))
        }
      });
    }
  }, [
    data.mode,
    data.leadgen.annualWebsiteVisitors,
    data.leadgen.annualLeadsGenerated,
    data.leadgen.annualNewAccountsClosed,
    calculatedBuyers,
    setData
  ]);

  // Calculate retail gaps when inputs change
  useEffect(() => {
    if (data.mode === 'retail') {
      const annualStoreVisitors = parseHumanFriendlyNumber(data.retail.annualStoreVisitors);
      const annualNewAccountsClosed = parseHumanFriendlyNumber(data.retail.annualNewAccountsClosed);
      
      // Calculate visibility reach gap
      const visibilityReachGap = calculatedBuyers > 0 ? 1 - (annualStoreVisitors / calculatedBuyers) : 0;
      
      // Calculate close rate gap
      const closeRateGap = annualStoreVisitors > 0 ? 1 - (annualNewAccountsClosed / annualStoreVisitors) : 0;
      
      setData({
        ...data,
        retail: {
          ...data.retail,
          visibilityReachGap: Math.min(1, Math.max(0, visibilityReachGap)),
          closeRateGap: Math.min(1, Math.max(0, closeRateGap))
        }
      });
    }
  }, [
    data.mode,
    data.retail.annualStoreVisitors,
    data.retail.annualNewAccountsClosed,
    calculatedBuyers,
    setData
  ]);

  return (
    <div className="card">
      <h2 className="section-title">Gaps & Opportunities</h2>
      
      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => handleModeChange('leadgen')}
            className={`px-4 py-2 rounded-md ${
              data.mode === 'leadgen' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Lead Gen Business
          </button>
          <button
            onClick={() => handleModeChange('retail')}
            className={`px-4 py-2 rounded-md ${
              data.mode === 'retail' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Retail Business
          </button>
        </div>
        
        {data.mode === 'leadgen' ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Website Visitors
              </label>
              <input
                type="text"
                name="leadgen.annualWebsiteVisitors"
                value={data.leadgen.annualWebsiteVisitors}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 10k or 10,000"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Leads Generated
              </label>
              <input
                type="text"
                name="leadgen.annualLeadsGenerated"
                value={data.leadgen.annualLeadsGenerated}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 1k or 1,000"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual New Accounts Closed
              </label>
              <input
                type="text"
                name="leadgen.annualNewAccountsClosed"
                value={data.leadgen.annualNewAccountsClosed}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 100"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Gap Analysis</h3>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Visibility Reach Gap</span>
                  <span className="text-sm font-medium">{formatPercentage(data.leadgen.visibilityReachGap)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: `${data.leadgen.visibilityReachGap * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {formatPercentage(data.leadgen.visibilityReachGap)} of all buyers in market didn&apos;t even look at your company as an option!
                </p>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Lead Gen Gap</span>
                  <span className="text-sm font-medium">{formatPercentage(data.leadgen.leadGenGap)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: `${data.leadgen.leadGenGap * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {formatPercentage(data.leadgen.leadGenGap)} of all buyers that researched you didn&apos;t even leave a name or contact info?!? If you can&apos;t identify them how can you sell them?
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Close Rate Gap</span>
                  <span className="text-sm font-medium">{formatPercentage(data.leadgen.closeRateGap)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: `${data.leadgen.closeRateGap * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {formatPercentage(data.leadgen.closeRateGap)} of all opportunities given you are saying no too! Why?
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Store Visitors
              </label>
              <input
                type="text"
                name="retail.annualStoreVisitors"
                value={data.retail.annualStoreVisitors}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 10k or 10,000"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual New Accounts Closed
              </label>
              <input
                type="text"
                name="retail.annualNewAccountsClosed"
                value={data.retail.annualNewAccountsClosed}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 1k or 1,000"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Gap Analysis</h3>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Visibility Reach Gap</span>
                  <span className="text-sm font-medium">{formatPercentage(data.retail.visibilityReachGap)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: `${data.retail.visibilityReachGap * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {formatPercentage(data.retail.visibilityReachGap)} of all buyers in market didn&apos;t even look at your company as an option!
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Close Rate Gap</span>
                  <span className="text-sm font-medium">{formatPercentage(data.retail.closeRateGap)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full" 
                    style={{ width: `${data.retail.closeRateGap * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {formatPercentage(data.retail.closeRateGap)} of all opportunities given you are saying no too! Why?
                </p>
              </div>
            </div>
          </>
        )}
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
            <div key={index} className="mb-2 pb-2 border-b border-gray-100 last:border-b-0">
              <p className="text-sm">{comment}</p>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => setData({ ...data, showBack: !data.showBack })}
      >
        {data.showBack ? 'Show Front' : 'Show Back'}
      </button>
    </div>
  );
};

export default GapsAndOpps;