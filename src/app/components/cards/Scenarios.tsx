'use client';

import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/numberFormatting';
import ReactSlider from 'react-slider';

interface ScenariosProps {
  data: {
    visibilityGapPercent: number;
    leadGenGapPercent: number;
    closeRateGapPercent: number;
    additionalAnnualLeads: number;
    additionalAnnualNewAccountsClosed: number;
    additionalAnnualRevenueCreated: number;
    totalCalculatedAnnualRevenue: number;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
  gapsData: any;
  avgYearlyCustomerValue: number;
  annualRevenue: number;
}

const Scenarios: React.FC<ScenariosProps> = ({ 
  data, 
  setData, 
  gapsData,
  avgYearlyCustomerValue,
  annualRevenue
}) => {
  // Initialize sliders with success percentages (not gap percentages)
  useEffect(() => {
    if (gapsData.mode === 'leadgen') {
      // Fix: Set initial slider values to success percentages (not gap percentages)
      const visibilitySuccess = Math.max(0, 100 - (gapsData.leadgen?.visibilityReachGap || 95));
      const leadGenSuccess = Math.max(0, 100 - (gapsData.leadgen?.leadGenGap || 80));
      const closeRateSuccess = Math.max(0, 100 - (gapsData.leadgen?.closeRateGap || 80));
      
      calculateAdditionalMetrics(visibilitySuccess, leadGenSuccess, closeRateSuccess);
    }
  }, [gapsData]);

  const calculateAdditionalMetrics = (newVisibility: number, newLeadGen: number, newCloseRate: number) => {
    // Get base values from gaps data
    const calculatedBuyers = gapsData.mode === 'leadgen' ? 
      parseFloat(gapsData.calculatedBuyers?.toString().replace(/,/g, '') || '0') : 100000;
    
    const annualWebsiteVisitors = gapsData.mode === 'leadgen' ? 
      parseFloat(gapsData.leadgen?.annualWebsiteVisitors?.replace(/,/g, '') || '0') : 5000;
    
    const annualLeadsGenerated = gapsData.mode === 'leadgen' ? 
      parseFloat(gapsData.leadgen?.annualLeadsGenerated?.replace(/,/g, '') || '0') : 1000;
    
    const annualNewAccountsClosed = gapsData.mode === 'leadgen' ? 
      parseFloat(gapsData.leadgen?.annualNewAccountsClosed?.replace(/,/g, '') || '0') : 200;
    
    // Calculate potential improvements based on slider values
    const potentialVisitors = calculatedBuyers * (newVisibility / 100);
    const additionalVisitors = Math.max(0, potentialVisitors - annualWebsiteVisitors);
    
    const potentialLeads = potentialVisitors * (newLeadGen / 100);
    const additionalLeads = Math.max(0, potentialLeads - annualLeadsGenerated);
    
    const potentialNewAccounts = potentialLeads * (newCloseRate / 100);
    const additionalNewAccounts = Math.max(0, potentialNewAccounts - annualNewAccountsClosed);
    
    // Calculate additional revenue
    const additionalRevenue = additionalNewAccounts * avgYearlyCustomerValue;
    
    // Update state with new calculations
    setData({
      ...data,
      visibilityGapPercent: newVisibility,
      leadGenGapPercent: newLeadGen,
      closeRateGapPercent: newCloseRate,
      additionalAnnualLeads: additionalLeads,
      additionalAnnualNewAccountsClosed: additionalNewAccounts,
      additionalAnnualRevenueCreated: additionalRevenue,
      totalCalculatedAnnualRevenue: annualRevenue + additionalRevenue
    });
  };

  return (
    <div className="card">
      <h2 className="section-title mb-6">What If Scenarios</h2>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Visibility Reach</h3>
          <span className="text-lg font-semibold">{formatNumber(data.visibilityGapPercent)}%</span>
        </div>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          value={data.visibilityGapPercent}
          onChange={(value) => calculateAdditionalMetrics(value, data.leadGenGapPercent, data.closeRateGapPercent)}
          min={0}
          max={100}
        />
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Lead Generation</h3>
          <span className="text-lg font-semibold">{formatNumber(data.leadGenGapPercent)}%</span>
        </div>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          value={data.leadGenGapPercent}
          onChange={(value) => calculateAdditionalMetrics(data.visibilityGapPercent, value, data.closeRateGapPercent)}
          min={0}
          max={100}
        />
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Close Rate</h3>
          <span className="text-lg font-semibold">{formatNumber(data.closeRateGapPercent)}%</span>
        </div>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          value={data.closeRateGapPercent}
          onChange={(value) => calculateAdditionalMetrics(data.visibilityGapPercent, data.leadGenGapPercent, value)}
          min={0}
          max={100}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="stat-card">
          <h3 className="stat-title">Additional Annual Leads</h3>
          <p className="stat-value">{formatNumber(data.additionalAnnualLeads)}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Additional Annual New Accounts Closed</h3>
          <p className="stat-value">{formatNumber(data.additionalAnnualNewAccountsClosed)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="stat-title">Additional Annual Revenue Created</h3>
          <p className="stat-value">${formatNumber(data.additionalAnnualRevenueCreated)}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Total Calculated Annual Revenue</h3>
          <p className="stat-value">${formatNumber(data.totalCalculatedAnnualRevenue)}</p>
        </div>
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

export default Scenarios;
