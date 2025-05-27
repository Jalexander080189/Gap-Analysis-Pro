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
    mode: 'leadgen' as 'leadgen' | 'retail',
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
    visibilityGapPercent: 5,
    leadGenGapPercent: 20,
    closeRateGapPercent: 20,
    additionalAnnualLeads: 0,
    additionalAnnualNewAccountsClosed: 0,
    additionalAnnualRevenueCreated: 0,
    totalCalculatedAnnualRevenue: 0
  });
  
  const [marketingData, setMarketingData] = useState({
    channels: [
      { name: '', monthlyCost: '', monthlyAdSpend: '' }
    ],
    totalMonthlySpend: 0,
    totalYearlySpend: 0,
    additionalMonthlySpend: 0,
    percentOfAnnualRevenue: 0
  });
  
  const [sbaData, setSbaData] = useState({
    annualRevenue: '',
    years: [
      {
        startRevenue: 0,
        spendIncrease: 8,
        yearlyBudget: 0,
        monthlyBudget: 0,
        minimumROI: 3,
        endRevenue: 0,
        percentIncrease: 0,
        customers: {
          annual: 0,
          monthly: 0,
          weekly: 0,
          daily: 0
        }
      },
      {
        startRevenue: 0,
        spendIncrease: 8,
        yearlyBudget: 0,
        monthlyBudget: 0,
        minimumROI: 3,
        endRevenue: 0,
        percentIncrease: 0,
        customers: {
          annual: 0,
          monthly: 0,
          weekly: 0,
          daily: 0
        }
      },
      {
        startRevenue: 0,
        spendIncrease: 8,
        yearlyBudget: 0,
        monthlyBudget: 0,
        minimumROI: 3,
        endRevenue: 0,
        percentIncrease: 0,
        customers: {
          annual: 0,
          monthly: 0,
          weekly: 0,
          daily: 0
        }
      },
      {
        startRevenue: 0,
        spendIncrease: 8,
        yearlyBudget: 0,
        monthlyBudget: 0,
        minimumROI: 3,
        endRevenue: 0,
        percentIncrease: 0,
        customers: {
          annual: 0,
          monthly: 0,
          weekly: 0,
          daily: 0
        }
      },
      {
        startRevenue: 0,
        spendIncrease: 8,
        yearlyBudget: 0,
        monthlyBudget: 0,
        minimumROI: 3,
        endRevenue: 0,
        percentIncrease: 0,
        customers: {
          annual: 0,
          monthly: 0,
          weekly: 0,
          daily: 0
        }
      }
    ],
    worstCaseRevenue: 0,
    worstCaseSpend: 0
  });
  
  const [notesData, setNotesData] = useState('');
  
  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Load data from URL or localStorage
  useEffect(() => {
    console.log('useEffect running, searchParams:', searchParams.toString());
    
    // Initialize state regardless of searchParams
    const initialData = searchParams.get('company') 
      ? JSON.parse(decodeURIComponent(searchParams.get('company') || '{}'))
      : {};
      
    // Set all state variables with proper defaults
    setClientData(initialData.client || clientData);
    setCompanyData(initialData.company || companyData);
    setMarketData(initialData.market || marketData);
    setGapsData(initialData.gaps || gapsData);
    setScenariosData(initialData.scenarios || scenariosData);
    setMarketingData(initialData.marketing || marketingData);
    setSbaData(initialData.sba || sbaData);
    setNotesData(initialData.notes || notesData);
    
    // Check localStorage for saved data
    if (isClient) {
      const companySlug = searchParams.get('company');
      if (companySlug) {
        console.log('Looking for saved data for company:', companySlug);
        const savedData = localStorage.getItem(`gap-analysis-${companySlug}`);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            console.log('Loaded data from localStorage:', parsedData);
            setClientData(parsedData.clientData || clientData);
            setMarketData(parsedData.marketData || marketData);
            setCompanyData(parsedData.companyData || companyData);
            setGapsData(parsedData.gapsData || gapsData);
            setScenariosData(parsedData.scenariosData || scenariosData);
            setMarketingData(parsedData.marketingData || marketingData);
            setSbaData(parsedData.sbaData || sbaData);
            setNotesData(parsedData.notesData || notesData);
          } catch (e) {
            console.error("Error parsing saved data:", e);
          }
        } else {
          console.log('No saved data found for company:', companySlug);
        }
      } else {
        console.log('No company slug in URL');
      }
    }
  }, [searchParams, isClient]); // Only depend on searchParams and isClient
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (isClient) {
      const companySlug = searchParams.get('company');
      if (companySlug) {
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
        console.log('Saved data to localStorage for company:', companySlug);
      }
    }
  }, [
    isClient, 
    searchParams,
    clientData,
    marketData,
    companyData,
    gapsData,
    scenariosData,
    marketingData,
    sbaData,
    notesData
  ]);
  
  // Generate shareable URL
  const generateShareableUrl = () => {
    const baseUrl = window.location.origin;
    const data = {
      client: clientData,
      market: marketData,
      company: companyData,
      gaps: gapsData,
      scenarios: scenariosData,
      marketing: marketingData,
      sba: sbaData,
      notes: notesData
    };
    const encodedData = encodeURIComponent(JSON.stringify(data));
    return `${baseUrl}/reports?company=${encodedData}`;
  };
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gap Analysis Pro</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ClientInformation 
          data={clientData} 
          setData={setClientData} 
        />
        
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
          annualRevenue={parseFloat(companyData.annualRevenue.replace(/,/g, '')) || 0}
          calculatedBuyers={marketData.calculatedBuyers}
        />
        
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
