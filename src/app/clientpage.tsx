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
import { ClientDataType } from './components/cards/GPTDataBlock';

export default function ClientPage() {
  console.log('Client-side JavaScript is running!');
  
  // Client information state with updated structure
  const [clientData, setClientData] = useState<ClientDataType>({
    companyName: '',
    companyWebsite: '',
    companyFacebookURL: '',
    industryType: '',
    contacts: [],
    businessDescription: '',
    showBack: false,
    // Legacy fields for backward compatibility
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactTitle: '',
    businessType: ''
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
  
  // Gaps and opportunities state with proper type definition
  const [gapsData, setGapsData] = useState<{
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
  }>({
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
  
  // Error state for URL parameter parsing
  const [urlError, setUrlError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  
  // Function to update state from URL parameters
  const updateStateFromParams = useCallback((companySlug: string) => {
    try {
      // Decode and parse the data
      const decodedData = JSON.parse(atob(companySlug));
      
      // Update all state with the decoded data
      if (decodedData.clientData) {
        // Handle backward compatibility for client data
        const clientDataUpdate = { ...decodedData.clientData };
        
        // If old format data is received, convert it to new format
        if (!clientDataUpdate.contacts && (clientDataUpdate.contactName || clientDataUpdate.contactEmail || clientDataUpdate.contactPhone)) {
          clientDataUpdate.contacts = [{
            name: clientDataUpdate.contactName || '',
            email: clientDataUpdate.contactEmail || '',
            mobile: clientDataUpdate.contactPhone || '',
            title: clientDataUpdate.contactTitle || ''
          }];
        }
        
        // Map companyUrl to companyWebsite if needed
        if (!clientDataUpdate.companyWebsite && clientDataUpdate.companyUrl) {
          clientDataUpdate.companyWebsite = clientDataUpdate.companyUrl;
        }
        
        // Map businessType to industryType if needed
        if (!clientDataUpdate.industryType && clientDataUpdate.businessType) {
          clientDataUpdate.industryType = clientDataUpdate.businessType;
        }
        
        setClientData(clientDataUpdate);
      }
      
      if (decodedData.marketData) setMarketData(decodedData.marketData);
      if (decodedData.companyData) setCompanyData(decodedData.companyData);
      if (decodedData.gapsData) {
        // Ensure mode is either 'leadgen' or 'retail'
        const mode = decodedData.gapsData.mode === 'retail' ? 'retail' : 'leadgen';
        setGapsData({
          ...decodedData.gapsData,
          mode
        });
      }
      if (decodedData.scenariosData) setScenariosData(decodedData.scenariosData);
      if (decodedData.marketingData) setMarketingData(decodedData.marketingData);
      if (decodedData.sbaData) setSbaData(decodedData.sbaData);
      if (decodedData.notesData) setNotesData(decodedData.notesData);
      
      // Clear any previous errors
      setUrlError(null);
    } catch (error) {
      console.error('Error parsing URL data:', error);
      setUrlError('Invalid data in URL. Please check the link and try again.');
    }
  }, []);
  
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

  // FIXED: Proper setMode function that matches the expected interface
  const handleModeChange = (newMode: 'leadgen' | 'retail') => {
    setGapsData(prev => ({ ...prev, mode: newMode }));
  };

  return (
    <main className="container mx-auto px-4">
      {/* Display URL parsing error if any */}
      {urlError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {urlError}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setUrlError(null)}
            type="button"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}
      
      {/* Card 1 at the very top, no cards to right or left */}
      <div className="w-full mb-8">
        <ClientInformation 
          data={clientData} 
          setData={setClientData}
          mode={gapsData.mode}
          setMode={handleModeChange}
        />
      </div>
      
      {/* Cards 2, 3, 4 in a single horizontal row using CSS Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        width: '100%',
        marginBottom: '2rem'
      }}>
        <div>
          <MarketOverview 
            data={marketData} 
            setData={setMarketData} 
          />
        </div>
        
        <div>
          <CompanyOverview 
            data={companyData} 
            setData={setCompanyData} 
            avgYearlyCustomerValue={parseFloat(marketData.avgYearlyCustomerValue.replace(/,/g, '')) || 0}
            totalMarketRevShare={marketData.totalMarketRevShare}
          />
        </div>
        
        <div>
          <GapsAndOpps 
            data={gapsData} 
            setData={setGapsData} 
            calculatedBuyers={marketData.calculatedBuyers}
          />
        </div>
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

