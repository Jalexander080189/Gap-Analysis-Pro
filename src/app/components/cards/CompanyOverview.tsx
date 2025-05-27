'use client';

import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/numberFormatting';
import DriveLogoToggle from '../../components/DriveLogoToggle';

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
    
    if (name === 'percentNewCustomers') {
      const newValue = parseFloat(value) || 0;
      const remainingValue = Math.max(0, 100 - newValue);
      
      setData({
        ...data,
        percentNewCustomers: value,
        percentCurrentCustomers: remainingValue.toString()
      });
    } else if (name === 'percentCurrentCustomers') {
      const newValue = parseFloat(value) || 0;
      const remainingValue = Math.max(0, 100 - newValue);
      
      setData({
        ...data,
        percentCurrentCustomers: value,
        percentNewCustomers: remainingValue.toString()
      });
    } else {
      setData({
        ...data,
        [name]: value
      });
    }
  };

  // Calculate customer metrics when inputs change
  useEffect(() => {
    const annualRevenue = parseFloat(data.annualRevenue.replace(/,/g, '')) || 0;
    const percentNewCustomers = parseFloat(data.percentNewCustomers) || 0;
    
    // Fix: Calculate total customers correctly (annualRevenue / avgYearlyCustomerValue)
    const calculatedTotalCustomers = avgYearlyCustomerValue > 0 ? 
      annualRevenue / avgYearlyCustomerValue : 0;
    
    // Fix: Calculate new customers correctly (calculatedTotalCustomers * percentNewCustomers / 100)
    const calculatedNewCustomers = calculatedTotalCustomers * (percentNewCustomers / 100);
    
    // Fix: Calculate market rev share percentage correctly (annualRevenue / totalMarketRevShare * 100)
    const percentOfMarketRevShare = totalMarketRevShare > 0 ? 
      (annualRevenue / totalMarketRevShare) * 100 : 0;
    
    setData({
      ...data,
      calculatedTotalCustomers,
      calculatedNewCustomers,
      percentOfMarketRevShare
    });
  }, [data.annualRevenue, data.percentNewCustomers, data.percentCurrentCustomers, avgYearlyCustomerValue, totalMarketRevShare]);

  return (
    <div className="card">
      {!data.showBack ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Company Overview</h2>
            <DriveLogoToggle 
              showBack={data.showBack} 
              setShowBack={(value) => setData({...data, showBack: value})} 
            />
          </div>
          
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
              placeholder="e.g., 1,000,000"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              % New Customers
            </label>
            <input
              type="text"
              name="percentNewCustomers"
              value={data.percentNewCustomers}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., 50"
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
              placeholder="e.g., 50"
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Company Overview Results</h2>
            <DriveLogoToggle 
              showBack={data.showBack} 
              setShowBack={(value) => setData({...data, showBack: value})} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card">
              <h3 className="stat-title">Calculated Total Customers</h3>
              <p className="stat-value">{formatNumber(data.calculatedTotalCustomers)}</p>
              <p className="stat-desc">Total customers based on annual revenue</p>
            </div>
            
            <div className="stat-card">
              <h3 className="stat-title">Calculated New Customers</h3>
              <p className="stat-value">{formatNumber(data.calculatedNewCustomers)}</p>
              <p className="stat-desc">New customers based on percentage</p>
            </div>
            
            <div className="stat-card">
              <h3 className="stat-title">% of Market Rev Share</h3>
              <p className="stat-value">{formatNumber(data.percentOfMarketRevShare)}%</p>
              <p className="stat-desc">Your share of the total market revenue</p>
            </div>
          </div>
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
