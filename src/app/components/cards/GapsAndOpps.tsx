'use client';

import React from 'react';
import { formatNumber } from '../../utils/numberFormatting';
import DriveLogoToggle from '../../components/DriveLogoToggle';

interface GapsAndOppsProps {
  data: {
    mode: 'leadgen' | 'retail';
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

  // Calculate gaps when flipping to back side
  const calculateGaps = () => {
    if (data.mode === 'leadgen') {
      const annualWebsiteVisitors = parseFloat(data.leadgen.annualWebsiteVisitors.replace(/,/g, '')) || 0;
      const annualLeadsGenerated = parseFloat(data.leadgen.annualLeadsGenerated.replace(/,/g, '')) || 0;
      const annualNewAccountsClosed = parseFloat(data.leadgen.annualNewAccountsClosed.replace(/,/g, '')) || 0;
      
      // Calculate visibility reach gap correctly
      // (calculatedBuyers - annualWebsiteVisitors) / calculatedBuyers * 100, capped at 100%
      const visibilityReachGap = calculatedBuyers > 0 ? 
        Math.min(100, Math.max(0, ((calculatedBuyers - annualWebsiteVisitors) / calculatedBuyers) * 100)) : 0;
      
      // Calculate lead gen gap correctly
      // (annualWebsiteVisitors - annualLeadsGenerated) / annualWebsiteVisitors * 100, capped at 100%
      const leadGenGap = annualWebsiteVisitors > 0 ? 
        Math.min(100, Math.max(0, ((annualWebsiteVisitors - annualLeadsGenerated) / annualWebsiteVisitors) * 100)) : 0;
      
      // Calculate close rate gap correctly
      // (annualLeadsGenerated - annualNewAccountsClosed) / annualLeadsGenerated * 100, capped at 100%
      const closeRateGap = annualLeadsGenerated > 0 ? 
        Math.min(100, Math.max(0, ((annualLeadsGenerated - annualNewAccountsClosed) / annualLeadsGenerated) * 100)) : 0;
      
      setData({
        ...data,
        leadgen: {
          ...data.leadgen,
          visibilityReachGap,
          leadGenGap,
          closeRateGap
        }
      });
    } else {
      const annualStoreVisitors = parseFloat(data.retail.annualStoreVisitors.replace(/,/g, '')) || 0;
      const annualNewAccountsClosed = parseFloat(data.retail.annualNewAccountsClosed.replace(/,/g, '')) || 0;
      
      // Calculate retail gaps
      const visibilityReachGap = calculatedBuyers > 0 ? 
        Math.min(100, Math.max(0, ((calculatedBuyers - annualStoreVisitors) / calculatedBuyers) * 100)) : 0;
      
      const closeRateGap = annualStoreVisitors > 0 ? 
        Math.min(100, Math.max(0, ((annualStoreVisitors - annualNewAccountsClosed) / annualStoreVisitors) * 100)) : 0;
      
      setData({
        ...data,
        retail: {
          ...data.retail,
          visibilityReachGap,
          closeRateGap
        }
      });
    }
  };

  // Handle toggle with calculations
  const handleToggle = (showBack: boolean) => {
    if (showBack) {
      calculateGaps();
    }
    setData({
      ...data,
      showBack
    });
  };

  const toggleMode = (mode: 'leadgen' | 'retail') => {
    setData({
      ...data,
      mode,
      showBack: false
    });
  };

  return (
    <div className="card">
      {!data.showBack ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Gaps & Opportunities</h2>
            <DriveLogoToggle 
              showBack={data.showBack} 
              setShowBack={handleToggle} 
            />
          </div>
          
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => toggleMode('leadgen')}
                className={`px-4 py-2 rounded-md ${data.mode === 'leadgen' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Lead Gen Business
              </button>
              <button
                onClick={() => toggleMode('retail')}
                className={`px-4 py-2 rounded-md ${data.mode === 'retail' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Retail Business
              </button>
            </div>
            
            {data.mode === 'leadgen' ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Website Visitors
                  </label>
                  <input
                    type="text"
                    name="annualWebsiteVisitors"
                    value={data.leadgen.annualWebsiteVisitors}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 50,000"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Leads Generated
                  </label>
                  <input
                    type="text"
                    name="annualLeadsGenerated"
                    value={data.leadgen.annualLeadsGenerated}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 5,000"
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
                    placeholder="e.g., 1,000"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Store Visitors
                  </label>
                  <input
                    type="text"
                    name="annualStoreVisitors"
                    value={data.retail.annualStoreVisitors}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 50,000"
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
                    placeholder="e.g., 1,000"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Gaps & Opportunities Results</h2>
            <DriveLogoToggle 
              showBack={data.showBack} 
              setShowBack={handleToggle} 
            />
          </div>
          
          {data.mode === 'leadgen' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-card">
                <h3 className="stat-title">Visibility Reach Gap</h3>
                <p className="stat-value">{formatNumber(data.leadgen.visibilityReachGap)}%</p>
                <p className="stat-desc">{formatNumber(data.leadgen.visibilityReachGap)}% of all buyers in market didn't even look at your company as an option!</p>
              </div>
              
              <div className="stat-card">
                <h3 className="stat-title">Lead Gen Gap</h3>
                <p className="stat-value">{formatNumber(data.leadgen.leadGenGap)}%</p>
                <p className="stat-desc">{formatNumber(data.leadgen.leadGenGap)}% of all buyers that researched you didn't even leave a name or contact info?!? If you can't identify them how can you sell them?</p>
              </div>
              
              <div className="stat-card">
                <h3 className="stat-title">Close Rate Gap</h3>
                <p className="stat-value">{formatNumber(data.leadgen.closeRateGap)}%</p>
                <p className="stat-desc">{formatNumber(data.leadgen.closeRateGap)}% of all opportunities given you are saying no too! Why?</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="stat-card">
                <h3 className="stat-title">Visibility Reach Gap</h3>
                <p className="stat-value">{formatNumber(data.retail.visibilityReachGap)}%</p>
                <p className="stat-desc">{formatNumber(data.retail.visibilityReachGap)}% of all buyers in market didn't even look at your company as an option!</p>
              </div>
              
              <div className="stat-card">
                <h3 className="stat-title">Close Rate Gap</h3>
                <p className="stat-value">{formatNumber(data.retail.closeRateGap)}%</p>
                <p className="stat-desc">{formatNumber(data.retail.closeRateGap)}% of all opportunities given you are saying no too! Why?</p>
              </div>
            </div>
          )}
        </div>
      )}
      
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

export default GapsAndOpps;
