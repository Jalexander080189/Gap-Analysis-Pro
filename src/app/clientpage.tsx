'use client';
import React, { useState } from 'react';
import { ScenariosData } from './types/ScenariosData';
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
    facebookAdLibraryURL: '',
    instagramURL: '',
    phoenixURL: '',
    yearsInBusiness: '',
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
  
  // Scenarios state with proper typing
  const [scenariosData, setScenariosData] = useState<ScenariosData>({
    visibilityGapPercent: 0,
    leadGenGapPercent: 0,
    closeRateGapPercent: 0,
    additionalAnnualLeads: 0,
    additionalAnnualNewAccountsClosed: 0,
    additionalAnnualRevenueCreated: 0,
    totalCalculatedAnnualRevenue: 0,
    showBack: false,
    // Add the missing properties with default values
    visibilityReachSlider: 0,
    leadGenSlider: 0,
    closeRateSlider: 0,
    additionalLeads: 0,
    additionalRevenue: 0,
    additionalClosed: 0
  });
  
  // Current marketing overview state
  const [currentMarketingData, setCurrentMarketingData] = useState({
    channels: [
      { name: 'Google Ads', monthlyCost: '0', monthlyAdSpend: '0' },
      { name: 'Facebook Ads', monthlyCost: '0', monthlyAdSpend: '0' },
      { name: 'SEO', monthlyCost: '0', monthlyAdSpend: '0' }
    ],
    totalMonthlySpend: 0,
    totalYearlySpend: 0,
    additionalMonthlySpend: 0,
    percentOfAnnualRevenue: 0,
    showBack: false
  });
  
  // SBA marketing budget state
  const [sbaData, setSbaData] = useState({
    annualRevenue: '0',
    years: [
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } },
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } },
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } },
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } },
      { startRevenue: 0, spendIncrease: 0, yearlyBudget: 0, monthlyBudget: 0, minimumROI: 0, endRevenue: 0, percentIncrease: 0, customers: { annual: 0, monthly: 0, weekly: 0, daily: 0 } }
    ],
    worstCaseRevenue: 0,
    worstCaseSpend: 0,
    showBack: false
  });
  
  // Notes state
  const [notesData, setNotesData] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="w-full mb-8">
          <ClientInformation 
            data={clientData} 
            setData={setClientData} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <MarketOverview 
            data={marketData} 
            setData={setMarketData} 
          />
          <CompanyOverview 
            data={companyData} 
            setData={setCompanyData}
            avgYearlyCustomerValue={parseFloat(String(marketData.avgYearlyCustomerValue || 0)) || 0}
            totalMarketRevShare={parseFloat(String(marketData.totalMarketRevShare || 0)) || 0}
          />
          <GapsAndOpps 
            data={gapsData} 
            setData={setGapsData} 
            annualRevenue={parseFloat(companyData.annualRevenue) || 0}
            calculatedBuyers={marketData.calculatedBuyers}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Scenarios 
            data={scenariosData} 
            setData={setScenariosData} 
            gapsData={gapsData}
            avgYearlyCustomerValue={parseFloat(String(marketData.avgYearlyCustomerValue || 0)) || 0}
            annualRevenue={parseFloat(companyData.annualRevenue) || 0}
          />
          <CurrentMarketingOverview 
            data={currentMarketingData} 
            setData={setCurrentMarketingData} 
            annualRevenue={parseFloat(companyData.annualRevenue) || 0}
          />
          <SBAMarketingBudget 
            data={sbaData} 
            setData={setSbaData} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Notes 
            data={notesData} 
            setData={setNotesData} 
          />
          <GPTDataBlock 
            setClientData={setClientData}
            setMarketData={setMarketData}
            setCompanyData={setCompanyData}
            setGapsData={setGapsData}
            setMarketingData={setCurrentMarketingData}
            setSbaData={setSbaData}
            setNotesData={setNotesData}
          />
        </div>
      </div>
    </div>
  );
}
