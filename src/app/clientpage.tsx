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

// Separate component for handling useSearchParams
function SearchParamsHandler({ 
  clientData, setClientData,
  marketData, setMarketData,
  companyData, setCompanyData,
  gapsData, setGapsData,
  scenariosData, setScenariosData,
  marketingData, setMarketingData,
  sbaData, setSbaData,
  notesData, setNotesData
}) {
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

  return null; // This component doesn't render anything, it just handles the logic
}

export default function Home() {
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

  return (
    <main className="flex flex-col gap-6">
      {/* SearchParamsHandler component to handle URL params and localStorage */}
      <SearchParamsHandler
        clientData={clientData}
        setClientData={setClientData}
        marketData={marketData}
        setMarketData={setMarketData}
        companyData={companyData}
        setCompanyData={setCompanyData}
        gapsData={gapsData}
        setGapsData={setGapsData}
        scenariosData={scenariosData}
        setScenariosData={setScenariosData}
        marketingData={marketingData}
        setMarketingData={setMarketingData}
        sbaData={sbaData}
        setSbaData={setSbaData}
        notesData={notesData}
        setNotesData={setNotesData}
      />
      
      <ClientInformation data={clientData} setData={setClientData} />
      <MarketOverview data={marketData} setData={setMarketData} />
      <CompanyOverview 
        data={companyData} 
        setData={setCompanyData} 
        avgYearlyCustomerValue={parseFloat(marketData.avgYearlyCustomerValue) || 0}
        totalMarketRevShare={marketData.totalMarketRevShare}
      />
      <GapsAndOpps 
        data={gapsData} 
        setData={setGapsData} 
        annualRevenue={parseFloat(companyData.annualRevenue) || 0}
        calculatedBuyers={marketData.calculatedBuyers}
      />
      <Scenarios 
        data={scenariosData} 
        setData={setScenariosData}
        gapsData={gapsData}
        avgYearlyCustomerValue={parseFloat(marketData.avgYearlyCustomerValue) || 0}
        annualRevenue={parseFloat(companyData.annualRevenue) || 0}
      />
      <CurrentMarketingOverview 
        data={marketingData} 
        setData={setMarketingData}
        annualRevenue={parseFloat(companyData.annualRevenue) || 0}
      />
      <SBAMarketingBudget 
        data={sbaData} 
        setData={setSbaData} 
      />
      <Notes data={notesData} setData={setNotesData} />
      <GPTDataBlock 
        setClientData={setClientData}
        setMarketData={setMarketData}
        setCompanyData={setCompanyData}
        setGapsData={setGapsData}
        setMarketingData={setMarketingData}
        setSbaData={setSbaData}
        setNotesData={setNotesData}
      />
    </main>
  );
}
