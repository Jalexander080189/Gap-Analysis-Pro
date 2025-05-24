'use client';

import React, { useState } from 'react';
import DriveLogoToggle from '../DriveLogoToggle';

interface MarketOverviewProps {
  data: {
    audienceSize: string;
    buyerPercentage: string;
    avgYearlyCustomerValue: string;
    calculatedBuyers: number;
    totalMarketRevShare: number;
    showBack: boolean;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ data, setData }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const toggleView = () => {
    setData({
      ...data,
      showBack: !data.showBack
    });
  };

  // Calculate values when inputs change
  React.useEffect(() => {
    const audienceSize = parseFloat(data.audienceSize.replace(/[^0-9.]/g, '')) || 0;
    const buyerPercentage = parseFloat(data.buyerPercentage.replace(/[^0-9.]/g, '')) || 0;
    const avgYearlyCustomerValue = parseFloat(data.avgYearlyCustomerValue.replace(/[^0-9.]/g, '')) || 0;
    
    const calculatedBuyers = audienceSize * (buyerPercentage / 100);
    const totalMarketRevShare = calculatedBuyers * avgYearlyCustomerValue;
    
    setData(prev => ({
      ...prev,
      calculatedBuyers,
      totalMarketRevShare
    }));
  }, [data.audienceSize, data.buyerPercentage, data.avgYearlyCustomerValue]);

  return (
    <div className="card relative">
      <DriveLogoToggle 
        showBack={data.showBack} 
        setShowBack={() => toggleView()} 
      />
      
      <h2 className="section-title">Market Overview</h2>
      
      {data.showBack ? (
        <div className="card-green p-4 rounded-lg">
          <h3 className="card-title text-green-800">Market Overview - Full View</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audience Size
              </label>
              <input
                type="text"
                name="audienceSize"
                value={data.audienceSize}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 1M or 1,000,000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buyer %
              </label>
              <input
                type="text"
                name="buyerPercentage"
                value={data.buyerPercentage}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 5 or 5%"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avg. Yearly Customer Value
            </label>
            <input
              type="text"
              name="avgYearlyCustomerValue"
              value={data.avgYearlyCustomerValue}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g. 1k or $1,000"
            />
          </div>
          
          {(data.audienceSize && data.buyerPercentage) && (
            <div className="bg-green-100 p-3 rounded-lg mb-4">
              <p className="text-green-800 font-medium">
                Calculated Buyers: {data.calculatedBuyers.toLocaleString()}
              </p>
            </div>
          )}
          
          {(data.audienceSize && data.buyerPercentage && data.avgYearlyCustomerValue) && (
            <div className="bg-green-100 p-3 rounded-lg">
              <p className="text-green-800 font-medium">
                Total Market Rev Share: ${data.totalMarketRevShare.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border border-green-200 rounded-lg">
          <h3 className="card-title">Market Overview - Preview</h3>
          
          {(data.audienceSize && data.buyerPercentage && data.avgYearlyCustomerValue) ? (
            <div>
              <p className="mb-2">Audience Size: {data.audienceSize}</p>
              <p className="mb-2">Buyer %: {data.buyerPercentage}</p>
              <p className="mb-2">Avg. Yearly Customer Value: {data.avgYearlyCustomerValue}</p>
              <p className="font-medium text-green-800">Total Market: ${data.totalMarketRevShare.toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Enter market information to see preview</p>
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

export default MarketOverview;
