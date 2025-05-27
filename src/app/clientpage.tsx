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
  // Initialize state with default values
  const [clientData, setClientData] = useState({
    primaryOwner: { name: '', email: '', phone: '' },
    secondaryOwner: { name: '', email: '', phone: '' },
    companyName: '',
    companyUrl: '',
    companyFacebookUrl: '',
    businessOverview: '',
    saved: false
  });
  
  const [marketData, setMarketData] = useState({
    audienceSize: '',
    buyerPercentage: '',
    avgYearlyCustomerValue: '',
    calculatedBuyers: 0,
    totalMarketRevShare: 0,
    showBack: false
  });
  
  const [companyData, setCompanyData] = useState({
    annualRevenue: '',
    percentNewCustomers: '',
    percentCurrentCustomers: '',
    calculatedTotalCustomers: 0,
    calculatedNewCustomers: 0,
    percentOfMarketRevShare: 0,
    showBack: false
  });
  
  const [gapsData, setGapsData] = useState({
    mode: 'leadgen', // 'leadgen' or 'retail'
    leadgen: {
      annualWebsiteVisitors: '',
      annualLeadsGenerated: '',
      annualNewAccountsClosed: '',
      visibilityReachGap: 0,
      leadGenGap: 0,
      closeRateGap: 0
    },
    retail: {
      annualStoreVisitors: '',
      annualNewAccountsClosed: '',
      visibilityReachGap: 0,
      closeRateGap: 0
    },
    showBack: false
  });
  
  const [scenariosData, setScenariosData] = useState({
    visibilityGapPercent: 0,
    leadGenGapPercent: 0,
    closeRateGapPercent: 0,
    additionalAnnualLeads: 0,
    additionalAnnualNewAccountsClosed: 0,
    additionalAnnualRevenueCreated: 0,
    totalCalculatedAnnualRevenue: 0
  });
  
  const [marketingData, setMarketingData] = useState({
    channels: [{ name: '', monthlyCost: '', monthlyAdSpend: '' }],
    totalMonthlySpend: 0,
    totalYearlySpend: 0,
    additionalMonthlySpend: 0,
    percentOfAnnualRevenue: 0
  });
  
  const [sbaData, setSbaData] = useState({
    annualRevenue: '',
    years: [
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } },
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } },
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } },
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } },
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } }
    ],
    worstCaseRevenue: 0,
    worstCaseSpend: 0
  });
  
  const [notesData, setNotesData] = useState('');

  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  // Load data from URL or localStorage when component mounts
  useEffect(() => {
    console.log('useEffect running, searchParams: ', searchParams);
    setIsClient(true);
    
    const companySlug = searchParams.get('company');
    if (companySlug) {
      // Load data from localStorage based on company slug
      const savedData = localStorage.getItem(`gap-analysis-${companySlug}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setClientData(parsedData.clientData || clientData);
        setMarketData(parsedData.marketData || marketData);
        setCompanyData(parsedData.companyData || companyData);
        setGapsData(parsedData.gapsData || gapsData);
        setScenariosData(parsedData.scenariosData || scenariosData);
        setMarketingData(parsedData.marketingData || marketingData);
        setSbaData(parsedData.sbaData || sbaData);
        setNotesData(parsedData.notesData || notesData);
      }
    } else {
      console.log('No company slug in URL');
    }
  }, [searchParams]);
  
  // Save data to localStorage when client information is saved
  useEffect(() => {
    if (isClient && clientData.saved && clientData.companyName) {
      const companySlug = clientData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const dataToSave = {
        clientData,
        marketData,
        companyData,
        gapsData,
        scenariosData,
        marketingData,
        sbaData,
        notesData
      };
      localStorage.setItem(`gap-analysis-${companySlug}`, JSON.stringify(dataToSave));
      
      // Update URL with company slug if not already present
      if (!searchParams.get('company')) {
        window.history.pushState({}, '', `?company=${companySlug}`);
      }
    }
  }, [isClient, clientData, marketData, companyData, gapsData, scenariosData, marketingData, sbaData, notesData, searchParams]);

  // Function to generate shareable URL
  const generateShareableUrl = () => {
    if (clientData.companyName) {
      const companySlug = clientData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return `${window.location.origin}?company=${companySlug}`;
    }
    return window.location.origin;
  };

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
