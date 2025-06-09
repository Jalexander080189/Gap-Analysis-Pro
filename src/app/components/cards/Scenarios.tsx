'use client';

import React, { useState, useEffect } from 'react';
import { ScenariosData } from '../../types/ScenariosData';
import { parseHumanFriendlyNumber, formatPercentage } from '../../utils/numberFormatting';

interface ScenariosProps {
  data: ScenariosData;
  setData: React.Dispatch<React.SetStateAction<ScenariosData>>;
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
  // Auto-position sliders based on current gap percentages
  useEffect(() => {
    if (gapsData.mode === 'leadgen') {
      setData((prev: ScenariosData) => ({
        ...prev,
        visibilityGapPercent: Math.round(gapsData.leadgen.visibilityReachGap * 100),
        leadGenGapPercent: Math.round(gapsData.leadgen.leadGenGap * 100),
        closeRateGapPercent: Math.round(gapsData.leadgen.closeRateGap * 100)
      }));
    } else {
      setData((prev: ScenariosData) => ({
        ...prev,
        visibilityGapPercent: Math.round(gapsData.retail.visibilityReachGap * 100),
        leadGenGapPercent: 0,
        closeRateGapPercent: Math.round(gapsData.retail.closeRateGap * 100)
      }));
    }
  }, [
    gapsData.mode, 
    gapsData.leadgen.visibilityReachGap, 
    gapsData.leadgen.leadGenGap, 
    gapsData.leadgen.closeRateGap,
    gapsData.retail.visibilityReachGap,
    gapsData.retail.closeRateGap
  ]);

  // Calculate scenario results when sliders change
  useEffect(() => {
    // Only calculate if we have the necessary values
    if (annualRevenue <= 0 || avgYearlyCustomerValue <= 0) return;
    
    // Get base values from gaps data
    let baseVisitors = 0;
    let baseLeads = 0;
    let baseClosed = 0;
    
    if (gapsData.mode === 'leadgen') {
      baseVisitors = parseHumanFriendlyNumber(gapsData.leadgen.annualWebsiteVisitors);
      baseLeads = parseHumanFriendlyNumber(gapsData.leadgen.annualLeadsGenerated);
      baseClosed = parseHumanFriendlyNumber(gapsData.leadgen.annualNewAccountsClosed);
    } else {
      baseVisitors = parseHumanFriendlyNumber(gapsData.retail.annualStoreVisitors);
      baseClosed = parseHumanFriendlyNumber(gapsData.retail.annualNewAccountsClosed);
    }
    
    // Calculate additional leads based on visibility gap improvement
    const additionalVisitors = baseVisitors * (data.visibilityGapPercent / 100);
    
    // Calculate additional leads based on lead gen gap improvement
    let additionalLeads = 0;
    if (gapsData.mode === 'leadgen') {
      additionalLeads = additionalVisitors * (1 - (data.leadGenGapPercent / 100)) + 
                        baseVisitors * (data.leadGenGapPercent / 100);
    } else {
      additionalLeads = additionalVisitors;
    }
    
    // Calculate additional closed accounts based on close rate gap improvement
    const additionalClosed = additionalLeads * (1 - (data.closeRateGapPercent / 100)) + 
                             (gapsData.mode === 'leadgen' ? baseLeads : baseVisitors) * (data.closeRateGapPercent / 100);
    
    // Calculate additional revenue
    const additionalRevenue = additionalClosed * avgYearlyCustomerValue;
    
    // Calculate total revenue
    const totalRevenue = annualRevenue + additionalRevenue;
    
    setData((prev: ScenariosData) => ({
      ...prev,
      additionalAnnualLeads: additionalLeads,
      additionalAnnualNewAccountsClosed: additionalClosed,
      additionalAnnualRevenueCreated: additionalRevenue,
      totalCalculatedAnnualRevenue: totalRevenue
    }));
  }, [
    data.visibilityGapPercent,
    data.leadGenGapPercent,
    data.closeRateGapPercent,
    gapsData,
    avgYearlyCustomerValue,
    annualRevenue
  ]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev: ScenariosData) => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  return (
    <div className="card">
      <h2 className="section-title">Scenario "What-Ifs"</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibility Gap: {formatPercentage(data.visibilityGapPercent / 100)}
        </label>
        <input
          type="range"
          name="visibilityGapPercent"
          min="0"
          max="100"
          value={data.visibilityGapPercent}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {gapsData.mode === 'leadgen' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Gen Gap: {formatPercentage(data.leadGenGapPercent / 100)}
          </label>
          <input
            type="range"
            name="leadGenGapPercent"
            min="0"
            max="100"
            value={data.leadGenGapPercent}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Close Rate Gap: {formatPercentage(data.closeRateGapPercent / 100)}
        </label>
        <input
          type="range"
          name="closeRateGapPercent"
          min="0"
          max="100"
          value={data.closeRateGapPercent}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {(data.visibilityGapPercent > 0 || data.leadGenGapPercent > 0 || data.closeRateGapPercent > 0) && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Scenario Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Additional Annual Leads</p>
              <p className="font-medium">{Math.round(data.additionalAnnualLeads).toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Additional Annual New Accounts Closed</p>
              <p className="font-medium">{Math.round(data.additionalAnnualNewAccountsClosed).toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Additional Annual Revenue Created</p>
              <p className="font-medium">${Math.round(data.additionalAnnualRevenueCreated).toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Calculated Annual Revenue</p>
              <p className="font-medium text-blue-800">${Math.round(data.totalCalculatedAnnualRevenue).toLocaleString()}</p>
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

export default Scenarios;
