'use client';

import React, { useState, useEffect } from 'react';
import DriveLogoToggle from '../DriveLogoToggle';

interface GapsAndOppsProps {
  data: {
    mode: string;
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
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
  annualRevenue: number;
  calculatedBuyers: number;
}

const GapsAndOpps: React.FC<GapsAndOppsProps> = ({ 
  data, 
  setData, 
  annualRevenue,
  calculatedBuyers
}) => {
  // Add state for social interactions
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [shared, setShared] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (data.mode === 'leadgen') {
      setData({
        ...data,
        leadgen: {
          ...data.leadgen,
          [name]: value
        }
      });
    } else {
      setData({
        ...data,
        retail: {
          ...data.retail,
          [name]: value
        }
      });
    }
  };

  const toggleView = () => {
    setData({
      ...data,
      showBack: !data.showBack
    });
  };

  const toggleMode = () => {
    setData({
      ...data,
      mode: data.mode === 'leadgen' ? 'retail' : 'leadgen'
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

  // Calculate gaps for Lead Gen mode
  useEffect(() => {
    if (data.mode !== 'leadgen') return;
    
    const visitors = parseFloat(data.leadgen.annualWebsiteVisitors.replace(/[^0-9.]/g, '')) || 0;
    const leads = parseFloat(data.leadgen.annualLeadsGenerated.replace(/[^0-9.]/g, '')) || 0;
    const closed = parseFloat(data.leadgen.annualNewAccountsClosed.replace(/[^0-9.]/g, '')) || 0;
    
    // Visibility Reach Gap = (Calculated buyers total - Yearly website visitors) / Calculated buyers total
    const visibilityReachGap = calculatedBuyers > 0 ? 
      Math.min(Math.max((calculatedBuyers - visitors) / calculatedBuyers, 0), 1) : 0;
    
    // Lead Conversion Gap = (Yearly Website Visitors - Yearly Leads) / Yearly Website Visitors
    const leadGenGap = visitors > 0 ? 
      Math.min(Math.max((visitors - leads) / visitors, 0), 1) : 0;
    
    // Close Rate Gap = (Yearly Leads - Yearly New Closed Accounts) / Yearly Leads
    const closeRateGap = leads > 0 ? 
      Math.min(Math.max((leads - closed) / leads, 0), 1) : 0;
    
    setData(prev => ({
      ...prev,
      leadgen: {
        ...prev.leadgen,
        visibilityReachGap,
        leadGenGap,
        closeRateGap
      }
    }));
  }, [
    data.mode, 
    data.leadgen.annualWebsiteVisitors, 
    data.leadgen.annualLeadsGenerated, 
    data.leadgen.annualNewAccountsClosed,
    calculatedBuyers
  ]);

  // Calculate gaps for Retail mode
  useEffect(() => {
    if (data.mode !== 'retail') return;
    
    const visitors = parseFloat(data.retail.annualStoreVisitors.replace(/[^0-9.]/g, '')) || 0;
    const closed = parseFloat(data.retail.annualNewAccountsClosed.replace(/[^0-9.]/g, '')) || 0;
    
    // Visibility Reach Gap = (Visitors - Closed) / Visitors
    const visibilityReachGap = calculatedBuyers > 0 ? 
      Math.min(Math.max((calculatedBuyers - visitors) / calculatedBuyers, 0), 1) : 0;
    
    // Close Rate Gap = (Closed / Visitors)
    const closeRateGap = visitors > 0 ? 
      Math.min(Math.max((visitors - closed) / visitors, 0), 1) : 0;
    
    setData(prev => ({
      ...prev,
      retail: {
        ...prev.retail,
        visibilityReachGap,
        closeRateGap
      }
    }));
  }, [
    data.mode, 
    data.retail.annualStoreVisitors, 
    data.retail.annualNewAccountsClosed,
    calculatedBuyers
  ]);

  return (
    <div className="card relative">
      <DriveLogoToggle 
        showBack={data.showBack} 
        setShowBack={() => toggleView()} 
      />
      
      <h2 className="section-title">Gaps & Opportunities</h2>
      
      <div className="mb-4">
        <button
          className={`mr-2 px-3 py-1 rounded-md ${data.mode === 'leadgen' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => data.mode !== 'leadgen' && toggleMode()}
        >
          Lead Gen
        </button>
        <button
          className={`px-3 py-1 rounded-md ${data.mode === 'retail' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => data.mode !== 'retail' && toggleMode()}
        >
          Retail
        </button>
      </div>
      
      {data.showBack ? (
        <div className="card-red p-4 rounded-lg">
          <h3 className="card-title text-red-800">Gaps & Opportunities - Full View</h3>
          
          {data.mode === 'leadgen' ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Website Visitors
                  </label>
                  <input
                    type="text"
                    name="annualWebsiteVisitors"
                    value={data.leadgen.annualWebsiteVisitors}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 10k or 10,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Leads Generated
                  </label>
                  <input
                    type="text"
                    name="annualLeadsGenerated"
                    value={data.leadgen.annualLeadsGenerated}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 1k or 1,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual New Accounts Closed
                  </label>
                  <input
                    type="text"
                    name="annualNewAccountsClosed"
                    value={data.leadgen.annualNewAccountsClosed}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 100"
                  />
                </div>
              </div>
              
              {(calculatedBuyers > 0 && data.leadgen.annualWebsiteVisitors) && (
                <div className="bg-red-100 p-3 rounded-lg mb-4">
                  <p className="text-red-800 font-medium">
                    Visibility Reach Gap: {(data.leadgen.visibilityReachGap * 100).toFixed(0)}%
                  </p>
                  <p className="text-red-700 text-sm">
                    {(data.leadgen.visibilityReachGap * 100).toFixed(0)}% of all buyers in market didn't even look at your company as an option!
                  </p>
                  {annualRevenue > 0 && (
                    <p className="text-red-800 font-medium mt-1">
                      Dollar Lost: ${(data.leadgen.visibilityReachGap * annualRevenue).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              
              {(data.leadgen.annualWebsiteVisitors && data.leadgen.annualLeadsGenerated) && (
                <div className="bg-red-100 p-3 rounded-lg mb-4">
                  <p className="text-red-800 font-medium">
                    Lead Conversion Gap: {(data.leadgen.leadGenGap * 100).toFixed(0)}%
                  </p>
                  <p className="text-red-700 text-sm">
                    {(data.leadgen.leadGenGap * 100).toFixed(0)}% of all buyers that researched you didn't even leave a name or contact info?!? If you can't identify them how can you sell them?
                  </p>
                  {annualRevenue > 0 && (
                    <p className="text-red-800 font-medium mt-1">
                      Dollar Lost: ${(data.leadgen.leadGenGap * annualRevenue).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              
              {(data.leadgen.annualLeadsGenerated && data.leadgen.annualNewAccountsClosed) && (
                <div className="bg-red-100 p-3 rounded-lg">
                  <p className="text-red-800 font-medium">
                    Close Rate Gap: {(data.leadgen.closeRateGap * 100).toFixed(0)}%
                  </p>
                  <p className="text-red-700 text-sm">
                    {(data.leadgen.closeRateGap * 100).toFixed(0)}% of all opportunities given you are saying no too! Why?
                  </p>
                  {annualRevenue > 0 && (
                    <p className="text-red-800 font-medium mt-1">
                      Dollar Lost: ${(data.leadgen.closeRateGap * annualRevenue).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Store Visitors
                  </label>
                  <input
                    type="text"
                    name="annualStoreVisitors"
                    value={data.retail.annualStoreVisitors}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 10k or 10,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual New Accounts Closed
                  </label>
                  <input
                    type="text"
                    name="annualNewAccountsClosed"
                    value={data.retail.annualNewAccountsClosed}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 1k or 1,000"
                  />
                </div>
              </div>
              
              {(calculatedBuyers > 0 && data.retail.annualStoreVisitors) && (
                <div className="bg-red-100 p-3 rounded-lg mb-4">
                  <p className="text-red-800 font-medium">
                    Visibility Reach Gap: {(data.retail.visibilityReachGap * 100).toFixed(0)}%
                  </p>
                  <p className="text-red-700 text-sm">
                    {(data.retail.visibilityReachGap * 100).toFixed(0)}% of all buyers in market didn't even look at your company as an option!
                  </p>
                  {annualRevenue > 0 && (
                    <p className="text-red-800 font-medium mt-1">
                      Dollar Lost: ${(data.retail.visibilityReachGap * annualRevenue).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              
              {(data.retail.annualStoreVisitors && data.retail.annualNewAccountsClosed) && (
                <div className="bg-red-100 p-3 rounded-lg">
                  <p className="text-red-800 font-medium">
                    Close Rate Gap: {(data.retail.closeRateGap * 100).toFixed(0)}%
                  </p>
                  <p className="text-red-700 text-sm">
                    {(data.retail.closeRateGap * 100).toFixed(0)}% of all opportunities given you are saying no too! Why?
                  </p>
                  {annualRevenue > 0 && (
                    <p className="text-red-800 font-medium mt-1">
                      Dollar Lost: ${(data.retail.closeRateGap * annualRevenue).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border border-red-200 rounded-lg">
          <h3 className="card-title">Gaps & Opportunities - Preview</h3>
          
          {data.mode === 'leadgen' ? (
            <div>
              {(data.leadgen.annualWebsiteVisitors && data.leadgen.annualLeadsGenerated && data.leadgen.annualNewAccountsClosed) ? (
                <div>
                  <p className="mb-2">Annual Website Visitors: {data.leadgen.annualWebsiteVisitors}</p>
                  <p className="mb-2">Annual Leads Generated: {data.leadgen.annualLeadsGenerated}</p>
                  <p className="mb-2">Annual New Accounts Closed: {data.leadgen.annualNewAccountsClosed}</p>
                  <div className="mt-3">
                    <p className="font-medium text-red-800">Visibility Gap: {(data.leadgen.visibilityReachGap * 100).toFixed(0)}%</p>
                    <p className="font-medium text-red-800">Lead Conversion Gap: {(data.leadgen.leadGenGap * 100).toFixed(0)}%</p>
                    <p className="font-medium text-red-800">Close Rate Gap: {(data.leadgen.closeRateGap * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Enter lead generation information to see preview</p>
              )}
            </div>
          ) : (
            <div>
              {(data.retail.annualStoreVisitors && data.retail.annualNewAccountsClosed) ? (
                <div>
                  <p className="mb-2">Annual Store Visitors: {data.retail.annualStoreVisitors}</p>
                  <p className="mb-2">Annual New Accounts Closed: {data.retail.annualNewAccountsClosed}</p>
                  <div className="mt-3">
                    <p className="font-medium text-red-800">Visibility Gap: {(data.retail.visibilityReachGap * 100).toFixed(0)}%</p>
                    <p className="font-medium text-red-800">Close Rate Gap: {(data.retail.closeRateGap * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Enter retail information to see preview</p>
              )}
            </div>
          )}
        </div>
      )}
      
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

export default GapsAndOpps;
