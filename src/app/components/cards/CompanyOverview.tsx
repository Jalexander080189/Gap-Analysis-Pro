'use client';

import React, { useState, useEffect } from 'react';
import DriveLogoToggle from '../DriveLogoToggle';

interface CompanyOverviewProps {
  data: {
    annualRevenue: string;
    percentNewCustomers: string;
    percentCurrentCustomers: string;
    calculatedTotalCustomers: number;
    calculatedNewCustomers: number;
    percentOfMarketRevShare: number;
    showBack: boolean;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
  avgYearlyCustomerValue: number;
  totalMarketRevShare: number;
}

const CompanyOverview: React.FC<CompanyOverviewProps> = ({ 
  data, 
  setData, 
  avgYearlyCustomerValue,
  totalMarketRevShare
}) => {
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
  useEffect(() => {
    if (avgYearlyCustomerValue <= 0) return;
    
    const annualRevenue = parseFloat(data.annualRevenue.replace(/[^0-9.]/g, '')) || 0;
    const percentNewCustomers = parseFloat(data.percentNewCustomers.replace(/[^0-9.]/g, '')) || 0;
    
    const calculatedTotalCustomers = annualRevenue / avgYearlyCustomerValue;
    const calculatedNewCustomers = (annualRevenue * (percentNewCustomers / 100)) / avgYearlyCustomerValue;
    const percentOfMarketRevShare = totalMarketRevShare > 0 ? (annualRevenue / totalMarketRevShare) * 100 : 0;
    
    setData(prev => ({
      ...prev,
      calculatedTotalCustomers,
      calculatedNewCustomers,
      percentOfMarketRevShare
    }));
  }, [data.annualRevenue, data.percentNewCustomers, avgYearlyCustomerValue, totalMarketRevShare]);

  return (
    <div className="card relative">
      <DriveLogoToggle 
        showBack={data.showBack} 
        setShowBack={() => toggleView()} 
      />
      
      <h2 className="section-title">Company Overview</h2>
      
      {data.showBack ? (
        <div className="card-yellow p-4 rounded-lg">
          <h3 className="card-title text-yellow-800">Company Overview - Full View</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Revenue
              </label>
              <input
                type="text"
                name="annualRevenue"
                value={data.annualRevenue}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 1M or $1,000,000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                % New Customers
              </label>
              <input
                type="text"
                name="percentNewCustomers"
                value={data.percentNewCustomers}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 30 or 30%"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                % Current Customers
              </label>
              <input
                type="text"
                name="percentCurrentCustomers"
                value={data.percentCurrentCustomers}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g. 70 or 70%"
              />
            </div>
          </div>
          
          {(data.annualRevenue && avgYearlyCustomerValue > 0) && (
            <div className="bg-yellow-100 p-3 rounded-lg mb-4">
              <p className="text-yellow-800 font-medium">
                Calculated Total Customers: {data.calculatedTotalCustomers.toLocaleString()}
              </p>
            </div>
          )}
          
          {(data.annualRevenue && data.percentNewCustomers && avgYearlyCustomerValue > 0) && (
            <div className="bg-yellow-100 p-3 rounded-lg mb-4">
              <p className="text-yellow-800 font-medium">
                Calculated New Customers: {data.calculatedNewCustomers.toLocaleString()}
              </p>
            </div>
          )}
          
          {(data.annualRevenue && totalMarketRevShare > 0) && (
            <div className="bg-yellow-100 p-3 rounded-lg">
              <p className="text-yellow-800 font-medium">
                % of Market Rev Share: {data.percentOfMarketRevShare.toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border border-yellow-200 rounded-lg">
          <h3 className="card-title">Company Overview - Preview</h3>
          
          {(data.annualRevenue && data.percentNewCustomers && data.percentCurrentCustomers) ? (
            <div>
              <p className="mb-2">Annual Revenue: {data.annualRevenue}</p>
              <p className="mb-2">% New Customers: {data.percentNewCustomers}</p>
              <p className="mb-2">% Current Customers: {data.percentCurrentCustomers}</p>
              {totalMarketRevShare > 0 && (
                <p className="font-medium text-yellow-800">Market Share: {data.percentOfMarketRevShare.toFixed(2)}%</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">Enter company information to see preview</p>
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

export default CompanyOverview;
