'use client';

import React, { useEffect, useCallback } from 'react';
import { formatNumber } from '../../utils/numberFormatting';

interface ScenariosData {
  visibilityReachSlider: number;
  leadGenSlider: number;
  closeRateSlider: number;
  additionalLeads: number;
  additionalRevenue: number;
  additionalNewAccounts: number;
  totalCalculatedAnnualRevenue: number;
  showBack: boolean;
}

interface ScenariosProps {
  data: ScenariosData;
  setData: React.Dispatch<React.SetStateAction<ScenariosData>>;
  annualRevenue: number;
  calculatedBuyers: number;
  visibilityReachGap: number;
  leadGenGap: number;
  closeRateGap: number;
}

const Scenarios: React.FC<ScenariosProps> = ({ 
  data, 
  setData, 
  annualRevenue,
  calculatedBuyers,
  visibilityReachGap,
  leadGenGap,
  closeRateGap
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pick<ScenariosData, 'visibilityReachSlider' | 'leadGenSlider' | 'closeRateSlider'>) => {
    const value = parseInt(e.target.value);
    
    setData({
      ...data,
      [field]: value
    });
  };

  // Define calculateAdditionalMetrics before using it in useEffect
  const calculateAdditionalMetrics = useCallback(() => {
    // Calculate additional visitors based on visibility reach slider
    const additionalVisitorsPercent = data.visibilityReachSlider / 100;
    const potentialAdditionalVisitors = (calculatedBuyers * visibilityReachGap / 100) * additionalVisitorsPercent;
    
    // Calculate additional leads based on lead gen slider
    const additionalLeadsPercent = data.leadGenSlider / 100;
    const potentialAdditionalLeads = (potentialAdditionalVisitors * leadGenGap / 100) * additionalLeadsPercent;
    
    // Calculate additional accounts based on close rate slider
    const additionalAccountsPercent = data.closeRateSlider / 100;
    const additionalNewAccounts = (potentialAdditionalLeads * closeRateGap / 100) * additionalAccountsPercent;
    
    // Calculate additional revenue
    const avgCustomerValue = calculatedBuyers > 0 ? annualRevenue / calculatedBuyers : 0;
    const additionalRevenue = additionalNewAccounts * avgCustomerValue;
    
    // Calculate total revenue
    const totalCalculatedAnnualRevenue = annualRevenue + additionalRevenue;
    
    setData({
      ...data,
      additionalLeads: potentialAdditionalLeads,
      additionalRevenue,
      additionalNewAccounts,
      totalCalculatedAnnualRevenue
    });
  }, [data, setData, calculatedBuyers, visibilityReachGap, leadGenGap, closeRateGap, annualRevenue]);

  // Calculate additional metrics when sliders change
  useEffect(() => {
    calculateAdditionalMetrics();
  }, [data.visibilityReachSlider, data.leadGenSlider, data.closeRateSlider, calculateAdditionalMetrics]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Scenarios</h2>
      </div>
      
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visibility Reach Improvement (%)
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={data.visibilityReachSlider}
              onChange={(e) => handleSliderChange(e, 'visibilityReachSlider')}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-2 text-sm font-medium">{data.visibilityReachSlider}%</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lead Generation Improvement (%)
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={data.leadGenSlider}
              onChange={(e) => handleSliderChange(e, 'leadGenSlider')}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-2 text-sm font-medium">{data.leadGenSlider}%</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Close Rate Improvement (%)
          </label>
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={data.closeRateSlider}
              onChange={(e) => handleSliderChange(e, 'closeRateSlider')}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-2 text-sm font-medium">{data.closeRateSlider}%</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="stat-card">
          <h3 className="stat-title">Additional Leads</h3>
          <p className="stat-value">{formatNumber(Math.round(data.additionalLeads))}</p>
          <p className="stat-desc">Potential new leads generated</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Additional Revenue</h3>
          <p className="stat-value">${formatNumber(Math.round(data.additionalRevenue))}</p>
          <p className="stat-desc">Potential additional annual revenue</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Additional New Accounts</h3>
          <p className="stat-value">{formatNumber(Math.round(data.additionalNewAccounts))}</p>
          <p className="stat-desc">Potential new accounts closed</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Total Calculated Annual Revenue</h3>
          <p className="stat-value">${formatNumber(Math.round(data.totalCalculatedAnnualRevenue))}</p>
          <p className="stat-desc">Projected total annual revenue</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <button className="social-button" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>
        <button className="social-button" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comment
        </button>
        <button className="social-button" type="button">
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
