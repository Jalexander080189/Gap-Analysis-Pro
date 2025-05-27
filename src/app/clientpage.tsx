'use client';

import { useState, useEffect } from 'react';
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

// Add this test code
console.log('Client-side JavaScript is running!');
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
  });
}

export default function ClientPage() {
  // State hooks and other logic remain the same...
  
  // Your existing state and useEffect code here...
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  // Initialize state with default values
  const [clientData, setClientData] = useState({
    primaryOwner: '',
    secondaryOwner: '',
    companyName: '',
    companyUrl: '',
    companyFacebookUrl: '',
    businessOverview: ''
  });
  
  // Other state variables and useEffect hooks...
  
  // Your existing state initialization and useEffect code here...
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gap Analysis Pro</h1>
      
      {/* Card 1 - Horizontal at the very top, no cards to right or left */}
      <div className="w-full mb-8">
        <ClientInformation 
          data={clientData} 
          setData={setClientData} 
        />
      </div>
      
      {/* Cards 2, 3, 4 - Side by side symmetrically in a single row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="w-full">
          <MarketOverview 
            data={marketData} 
            setData={setMarketData} 
          />
        </div>
        
        <div className="w-full">
          <CompanyOverview 
            data={companyData} 
            setData={setCompanyData} 
            avgYearlyCustomerValue={parseFloat(marketData.avgYearlyCustomerValue.replace(/,/g, '')) || 0}
            totalMarketRevShare={marketData.totalMarketRevShare}
          />
        </div>
        
        <div className="w-full">
          <GapsAndOpps 
            data={gapsData} 
            setData={setGapsData} 
            annualRevenue={parseFloat(companyData.annualRevenue.replace(/,/g, '')) || 0}
            calculatedBuyers={marketData.calculatedBuyers}
          />
        </div>
      </div>
      
      {/* Cards 5, 6, 7, 8, 9 - Stacked vertically like a newsfeed */}
      <div className="space-y-8">
        <Scenarios 
          data={scenariosData} 
          setData={setScenariosData} 
          gapsData={gapsData}
          avgYearlyCustomerValue={parseFloat(marketData.avgYearlyCustomerValue.replace(/,/g, '')) || 0}
          annualRevenue={parseFloat(companyData.annualRevenue.replace(/,/g, '')) || 0}
        />
        
        <CurrentMarketingOverview 
          data={marketingData} 
          setData={setMarketingData} 
          annualRevenue={parseFloat(companyData.annualRevenue.replace(/,/g, '')) || 0}
        />
        
        <SBAMarketingBudget 
          data={sbaData} 
          setData={setSbaData} 
        />
        
        <Notes 
          data={notesData} 
          setData={setNotesData} 
        />
        
        <GPTDataBlock 
          setClientData={setClientData}
          setMarketData={setMarketData}
          setCompanyData={setCompanyData}
          setGapsData={setGapsData}
          setMarketingData={setMarketingData}
          setSbaData={setSbaData}
          setNotesData={setNotesData}
        />
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => {
            const shareableUrl = generateShareableUrl();
            navigator.clipboard.writeText(shareableUrl);
            alert('Shareable URL copied to clipboard!');
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Generate Shareable URL
        </button>
      </div>
    </main>
  );
}
