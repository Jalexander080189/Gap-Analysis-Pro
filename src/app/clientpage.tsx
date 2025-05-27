'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ClientInformation from './components/cards/ClientInformation';
import MarketOverview from './components/cards/MarketOverview';
import CompanyOverview from './components/cards/CompanyOverview';
import GapsAndOpps from './components/cards/GapsAndOpps';
import Scenarios from './components/cards/Scenarios';
import CurrentMarketingOverview from './components/cards/CurrentMarketingOverview';
import SBAMarketingBudget from './components/cards/SBAMarketingBudget';
import Notes from './components/cards/Notes';
import GPTDataBlock from './components/cards/GPTDataBlock';

export default function ClientPage() {
  console.log('Client-side JavaScript is running!');
  
  // Client information state
  const [clientData, setClientData] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    businessType: '',
    businessDescription: '',
    showBack: false
  });
  
  // Market overview state
  const [marketData, setMarketData] = useState({
    audienceSize: '0',
    buyerPercentage: '0',
    avgYearlyCustomerValue: '0',
    calculatedBuyers: 0,
    totalMarketRevShare: 0,
    showBack: false
  });
  
  // Company overview state
  const [companyData, setCompanyData] = useState({
    annualRevenue: '0',
    percentNewCustomers: '50',
    percentCurrentCustomers: '50',
    calculatedTotalCustomers: 0,
    calculatedNewCustomers: 0,
    percentOfMarketRevShare: 0,
    showBack: false
  });
  
  // Gaps and opportunities state
  const [gapsData, setGapsData] = useState({
    mode: 'leadgen',
    leadgen: {
      annualWebsiteVisitors: '0',
      annualLeadsGenerated: '0',
      annualNewAccountsClosed: '0',
      visibilityReachGap: 0,
      leadGenGap: 0,
      closeRateGap: 0
    },
    retail: {
      annualStoreVisitors: '0',
      annualNewAccountsClosed: '0',
      visibilityReachGap: 0,
      closeRateGap: 0
    },
    showBack: false
  });
  
  // Scenarios state
  const [scenariosData, setScenariosData] = useState({
    visibilityReachSlider: 5,
    leadGenSlider: 20,
    closeRateSlider: 20,
    additionalLeads: 0,
    additionalRevenue: 0,
    additionalNewAccounts: 0,
    totalCalculatedAnnualRevenue: 0,
    showBack: false
  });
  
  // Current marketing overview state
  const [marketingData, setMarketingData] = useState({
    channels: [
      { name: '', monthlyAdspend: '0', monthlyCost: '0' }
    ],
    totalMonthlySpend: 0,
    totalYearlySpend: 0,
    additionalMonthlySpend: 0,
    percentOfAnnualRevenue: 0,
    showBack: false
  });
  
  // SBA marketing budget state
  const [sbaData, setSbaData] = useState({
    recommendedMonthlyBudget: '0',
    recommendedYearlyBudget: '0',
    recommendedChannels: [
      { name: '', monthlyBudget: '0', description: '' }
    ],
    showBack: false
  });
  
  // Notes state
  const [notesData, setNotesData] = useState({
    content: '',
    showBack: false
  });
  
  const searchParams = useSearchParams();
  
  // Function to update state from URL parameters
  const updateStateFromParams = useCallback((companySlug: string) => {
    try {
      // Decode and parse the data
      const decodedData = JSON.parse(atob(companySlug));
      
      // Update all state with the decoded data
      if (decodedData.clientData) setClientData(decodedData.clientData);
      if (decodedData.marketData) setMarketData(decodedData.marketData);
      if (decodedData.companyData) setCompanyData(decodedData.companyData);
      if (decodedData.gapsData) setGapsData(decodedData.gapsData);
      if (decodedData.scenariosData) setScenariosData(decodedData.scenariosData);
      if (decodedData.marketingData) setMarketingData(decodedData.marketingData);
      if (decodedData.sbaData) setSbaData(decodedData.sbaData);
      if (decodedData.notesData) setNotesData(decodedData.notesData);
    } catch (error) {
      console.error('Error parsing URL data:', error);
    }
  }, [setClientData, setMarketData, setCompanyData, setGapsData, setScenariosData, setMarketingData, setSbaData, setNotesData]);
  
  // Handle URL parameters for sharing
  useEffect(() => {
    console.log('useEffect running, searchParams: ', searchParams);
    
    const companySlug = searchParams.get('company');
    
    if (companySlug) {
      updateStateFromParams(companySlug);
    } else {
      console.log('No company slug in URL');
    }
  }, [searchParams, updateStateFromParams]);
  
  // Function to generate a shareable URL
  const generateShareableUrl = () => {
    const data = {
      clientData,
      marketData,
      companyData,
      gapsData,
      scenariosData,
      marketingData,
      sbaData,
      notesData
    };
    
    const encodedData = btoa(JSON.stringify(data));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?company=${encodedData}`;
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Card 1 at the very top, no cards to right or left */}
      <div className="w-full mb-8">
        <ClientInformation 
          data={clientData} 
          setData={setClientData} 
        />
      </div>
      
      {/* Cards 2, 3, 4 in a single horizontal row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MarketOverview 
          data={marketData} 
          setData={setMarketData} 
        />
        
        <CompanyOverview 
          data={companyData} 
          setData={setCompanyData} 
          avgYearlyCustomerValue={parseFloat(marketData.avgYearlyCustomerValue.replace(/,/g, '')) || 0}
          totalMarketRevShare={marketData.totalMarketRevShare}
        />
        
        <GapsAndOpps 
          data={gapsData} 
          setData={setGapsData} 
          calculatedBuyers={marketData.calculatedBuyers}
        />
      </div>
      
      {/* Cards 5-9 stacked vertically like a newsfeed */}
      <div className="grid grid-cols-1 gap-6">
        <Scenarios 
          data={scenariosData} 
          setData={setScenariosData} 
          annualRevenue={parseFloat(companyData.annualRevenue.replace(/,/g, '')) || 0}
          calculatedBuyers={marketData.calculatedBuyers}
          visibilityReachGap={gapsData.mode === 'leadgen' ? gapsData.leadgen.visibilityReachGap : gapsData.retail.visibilityReachGap}
          leadGenGap={gapsData.mode === 'leadgen' ? gapsData.leadgen.leadGenGap : 0}
          closeRateGap={gapsData.mode === 'leadgen' ? gapsData.leadgen.closeRateGap : gapsData.retail.closeRateGap}
        />
        
        <CurrentMarketingOverview 
          data={marketingData} 
          setData={setMarketingData} 
          annualRevenue={parseFloat(companyData.annualRevenue.replace(/,/g, '')) || 0}
        />
        
        <SBAMarketingBudget 
          data={sbaData} 
          setData={setSbaData} 
          annualRevenue={parseFloat(companyData.annualRevenue.replace(/,/g, '')) || 0}
        />
        
        <Notes 
          data={notesData} 
          setData={setNotesData} 
        />
      </div>
      
      {/* Hidden data block for GPT analysis */}
      <GPTDataBlock 
        clientData={clientData}
        marketData={marketData}
        companyData={companyData}
        gapsData={gapsData}
        scenariosData={scenariosData}
        marketingData={marketingData}
      />
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => {
            const shareableUrl = generateShareableUrl();
            navigator.clipboard.writeText(shareableUrl);
            alert('Shareable URL copied to clipboard!');
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          type="button"
        >
          Generate Shareable URL
        </button>
      </div>
    </main>
  );
}
