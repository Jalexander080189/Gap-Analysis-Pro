'use client';

import { useState, useEffect } from 'react';
import ClientInformation from './components/cards/ClientInformation';
import MarketOverview from './components/cards/MarketOverview';
import CompanyOverview from './components/cards/CompanyOverview';
import GapsAndOpps from './components/cards/GapsAndOpps';
import Scenarios from './components/cards/Scenarios';
import CurrentMarketingOverview from './components/cards/CurrentMarketingOverview';
import SBAMarketingBudget from './components/cards/SBAMarketingBudget';
import Notes from './components/cards/Notes';
import GPTDataBlock from './components/cards/GPTDataBlock';
import { useSearchParams } from 'next/navigation';

// Define the client data interface to match what ClientInformation expects
interface ClientDataType {
  primaryOwner: {
    name: string;
    email: string;
    phone: string;
  };
  secondaryOwner: {
    name: string;
    email: string;
    phone: string;
  };
  companyName: string;
  companyUrl: string;
  companyFacebookUrl: string;
  businessOverview: string;
  saved: boolean;
}

export default function Home() {
  const [clientData, setClientData] = useState<ClientDataType>({
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
  
  // Load data from URL or localStorage when component mounts
  useEffect(() => {
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
    }
  }, []);
  
  // Save data to localStorage when client information is saved
  useEffect(() => {
    if (clientData.saved && clientData.companyName) {
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
        window.history.pushState({}, '', `/reports/${companySlug}`);
      }
    }
  }, [clientData, marketData, companyData, gapsData, scenariosData, marketingData, sbaData, notesData]);

  return (
    <main className="flex flex-col gap-6">
      {/* Card 1: Client Information with LinkedIn-style profile */}
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="h-24 bg-blue-600"></div>
        <div className="p-6">
          <ClientInformation data={clientData} setData={setClientData} />
        </div>
      </div>
      
      {/* Cards 2, 3, 4: Horizontal Layout */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <MarketOverview data={marketData} setData={setMarketData} />
        </div>
        
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <CompanyOverview 
            data={companyData} 
            setData={setCompanyData} 
            avgYearlyCustomerValue={parseFloat(marketData.avgYearlyCustomerValue) || 0}
            totalMarketRevShare={marketData.totalMarketRevShare}
          />
        </div>
        
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <GapsAndOpps 
            data={gapsData} 
            setData={setGapsData} 
            annualRevenue={parseFloat(companyData.annualRevenue) || 0}
            calculatedBuyers={marketData.calculatedBuyers}
          />
        </div>
      </div>
      
      {/* Remaining Cards */}
      <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <Scenarios 
          data={scenariosData} 
          setData={setScenariosData}
          gapsData={gapsData}
          avgYearlyCustomerValue={parseFloat(marketData.avgYearlyCustomerValue) || 0}
          annualRevenue={parseFloat(companyData.annualRevenue) || 0}
        />
      </div>
      
      <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <CurrentMarketingOverview 
          data={marketingData} 
          setData={setMarketingData}
          annualRevenue={parseFloat(companyData.annualRevenue) || 0}
        />
      </div>
      
      <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <SBAMarketingBudget 
          data={sbaData} 
          setData={setSbaData} 
        />
      </div>
      
      <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <Notes data={notesData} setData={setNotesData} />
      </div>
      
      <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200">
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
    </main>
  );
}
