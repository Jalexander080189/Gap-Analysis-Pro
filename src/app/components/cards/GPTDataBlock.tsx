'use client';

import React, { useState } from 'react';

interface GPTDataBlockProps {
  setClientData: React.Dispatch<React.SetStateAction<any>>;
  setMarketData: React.Dispatch<React.SetStateAction<any>>;
  setCompanyData: React.Dispatch<React.SetStateAction<any>>;
  setGapsData: React.Dispatch<React.SetStateAction<any>>;
  setMarketingData: React.Dispatch<React.SetStateAction<any>>;
  setSbaData: React.Dispatch<React.SetStateAction<any>>;
  setNotesData: React.Dispatch<React.SetStateAction<string>>;
}

const GPTDataBlock: React.FC<GPTDataBlockProps> = ({
  setClientData,
  setMarketData,
  setCompanyData,
  setGapsData,
  setMarketingData,
  setSbaData,
  setNotesData
}) => {
  const [jsonData, setJsonData] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
  };

  const handleAutoFill = () => {
    try {
      // Try to parse the JSON data
      const parsedData = JSON.parse(jsonData);
      
      // Map the parsed data to the appropriate state variables
      if (parsedData.clientInfo) {
        setClientData(prev => ({
          ...prev,
          primaryOwner: parsedData.clientInfo.primaryOwner || prev.primaryOwner,
          secondaryOwner: parsedData.clientInfo.secondaryOwner || prev.secondaryOwner,
          companyName: parsedData.clientInfo.companyName || prev.companyName,
          companyUrl: parsedData.clientInfo.companyUrl || prev.companyUrl,
          companyFacebookUrl: parsedData.clientInfo.companyFacebookUrl || prev.companyFacebookUrl,
          businessOverview: parsedData.clientInfo.businessOverview || prev.businessOverview
        }));
      }
      
      if (parsedData.marketOverview) {
        setMarketData(prev => ({
          ...prev,
          audienceSize: parsedData.marketOverview.audienceSize || prev.audienceSize,
          buyerPercentage: parsedData.marketOverview.buyerPercentage || prev.buyerPercentage,
          avgYearlyCustomerValue: parsedData.marketOverview.avgYearlyCustomerValue || prev.avgYearlyCustomerValue
        }));
      }
      
      if (parsedData.companyOverview) {
        setCompanyData(prev => ({
          ...prev,
          annualRevenue: parsedData.companyOverview.annualRevenue || prev.annualRevenue,
          percentNewCustomers: parsedData.companyOverview.percentNewCustomers || prev.percentNewCustomers,
          percentCurrentCustomers: parsedData.companyOverview.percentCurrentCustomers || prev.percentCurrentCustomers
        }));
      }
      
      if (parsedData.gapsAndOpps) {
        if (parsedData.gapsAndOpps.mode) {
          setGapsData(prev => ({
            ...prev,
            mode: parsedData.gapsAndOpps.mode
          }));
        }
        
        if (parsedData.gapsAndOpps.leadgen) {
          setGapsData(prev => ({
            ...prev,
            leadgen: {
              ...prev.leadgen,
              annualWebsiteVisitors: parsedData.gapsAndOpps.leadgen.annualWebsiteVisitors || prev.leadgen.annualWebsiteVisitors,
              annualLeadsGenerated: parsedData.gapsAndOpps.leadgen.annualLeadsGenerated || prev.leadgen.annualLeadsGenerated,
              annualNewAccountsClosed: parsedData.gapsAndOpps.leadgen.annualNewAccountsClosed || prev.leadgen.annualNewAccountsClosed
            }
          }));
        }
        
        if (parsedData.gapsAndOpps.retail) {
          setGapsData(prev => ({
            ...prev,
            retail: {
              ...prev.retail,
              annualStoreVisitors: parsedData.gapsAndOpps.retail.annualStoreVisitors || prev.retail.annualStoreVisitors,
              annualNewAccountsClosed: parsedData.gapsAndOpps.retail.annualNewAccountsClosed || prev.retail.annualNewAccountsClosed
            }
          }));
        }
      }
      
      if (parsedData.marketingOverview && Array.isArray(parsedData.marketingOverview.channels)) {
        setMarketingData(prev => ({
          ...prev,
          channels: parsedData.marketingOverview.channels
        }));
      }
      
      if (parsedData.sbaMarketingBudget) {
        setSbaData(prev => ({
          ...prev,
          annualRevenue: parsedData.sbaMarketingBudget.annualRevenue || prev.annualRevenue
        }));
      }
      
      if (parsedData.notes) {
        setNotesData(parsedData.notes);
      }
      
      alert('Data successfully auto-filled!');
    } catch (error) {
      alert('Error parsing JSON data. Please check the format and try again.');
      console.error('Error parsing JSON data:', error);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">GPT Data Block</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paste structured JSON/CSV data here
        </label>
        <textarea
          value={jsonData}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
          placeholder="Paste JSON data here..."
        />
      </div>
      
      <button
        onClick={handleAutoFill}
        className="button-primary"
        disabled={!jsonData}
      >
        Auto-Fill Form Data
      </button>
      
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

export default GPTDataBlock;
