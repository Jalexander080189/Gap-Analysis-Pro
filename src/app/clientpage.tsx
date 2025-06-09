'use client';
import React, { useState, useCallback } from 'react';
import { ScenariosData } from './types/ScenariosData';
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
  
  // GPT data block state - using clientData as it expects ClientDataType
  const [gptData, setGptData] = useState(clientData);

  const searchParams = useSearchParams();

  // Calculate market data
  const calculateMarketData = useCallback(() => {
    const audience = parseInt(marketData.audienceSize) || 0;
    const buyerPercent = parseFloat(marketData.buyerPercentage) || 0;
    const avgValue = parseFloat(marketData.avgYearlyCustomerValue) || 0;
    
    const calculatedBuyers = Math.round(audience * (buyerPercent / 100));
    const totalMarketRevShare = calculatedBuyers * avgValue;
    
    setMarketData(prev => ({
      ...prev,
      calculatedBuyers,
      totalMarketRevShare
    }));
  }, [marketData.audienceSize, marketData.buyerPercentage, marketData.avgYearlyCustomerValue]);

  // Calculate company data
  const calculateCompanyData = useCallback(() => {
    const revenue = parseFloat(companyData.annualRevenue) || 0;
    const avgValue = parseFloat(marketData.avgYearlyCustomerValue) || 0;
    const newPercent = parseFloat(companyData.percentNewCustomers) || 0;
    
    const calculatedTotalCustomers = avgValue > 0 ? Math.round(revenue / avgValue) : 0;
    const calculatedNewCustomers = Math.round(calculatedTotalCustomers * (newPercent / 100));
    const percentOfMarketRevShare = marketData.totalMarketRevShare > 0 ? 
      ((revenue / marketData.totalMarketRevShare) * 100) : 0;
    
    setCompanyData(prev => ({
      ...prev,
      calculatedTotalCustomers,
      calculatedNewCustomers,
      percentOfMarketRevShare
    }));
  }, [companyData.annualRevenue, companyData.percentNewCustomers, marketData.avgYearlyCustomerValue, marketData.totalMarketRevShare]);

  // Calculate gaps data
  const calculateGapsData = useCallback(() => {
    const totalBuyers = marketData.calculatedBuyers || 0;
    
    if (gapsData.mode === 'leadgen') {
      const websiteVisitors = parseInt(gapsData.leadgen.annualWebsiteVisitors) || 0;
      const leadsGenerated = parseInt(gapsData.leadgen.annualLeadsGenerated) || 0;
      const accountsClosed = parseInt(gapsData.leadgen.annualNewAccountsClosed) || 0;
      
      const visibilityReachGap = totalBuyers > 0 ? Math.max(0, ((totalBuyers - websiteVisitors) / totalBuyers) * 100) : 0;
      const leadGenGap = websiteVisitors > 0 ? Math.max(0, ((websiteVisitors - leadsGenerated) / websiteVisitors) * 100) : 0;
      const closeRateGap = leadsGenerated > 0 ? Math.max(0, ((leadsGenerated - accountsClosed) / leadsGenerated) * 100) : 0;
      
      setGapsData(prev => ({
        ...prev,
        leadgen: {
          ...prev.leadgen,
          visibilityReachGap,
          leadGenGap,
          closeRateGap
        }
      }));
    } else {
      const storeVisitors = parseInt(gapsData.retail.annualStoreVisitors) || 0;
      const accountsClosed = parseInt(gapsData.retail.annualNewAccountsClosed) || 0;
      
      const visibilityReachGap = totalBuyers > 0 ? Math.max(0, ((totalBuyers - storeVisitors) / totalBuyers) * 100) : 0;
      const closeRateGap = storeVisitors > 0 ? Math.max(0, ((storeVisitors - accountsClosed) / storeVisitors) * 100) : 0;
      
      setGapsData(prev => ({
        ...prev,
        retail: {
          ...prev.retail,
          visibilityReachGap,
          closeRateGap
        }
      }));
    }
  }, [marketData.calculatedBuyers, gapsData.mode, gapsData.leadgen, gapsData.retail]);

  // Calculate scenarios data
  const calculateScenariosData = useCallback(() => {
    const currentLeads = gapsData.mode === 'leadgen' ? 
      parseInt(gapsData.leadgen.annualLeadsGenerated) || 0 : 
      parseInt(gapsData.retail.annualStoreVisitors) || 0;
    
    const avgValue = parseFloat(marketData.avgYearlyCustomerValue) || 0;
    
    // Calculate additional leads based on slider improvements
    const visibilityImprovement = scenariosData.visibilityGapPercent / 100;
    const leadGenImprovement = scenariosData.leadGenGapPercent / 100;
    const closeRateImprovement = scenariosData.closeRateGapPercent / 100;
    
    const additionalLeads = Math.round(currentLeads * (visibilityImprovement + leadGenImprovement + closeRateImprovement));
    const additionalRevenue = additionalLeads * avgValue;
    
    setScenariosData((prev: ScenariosData) => ({
      ...prev,
      additionalLeads,
      additionalRevenue
    }));
  }, [gapsData.mode, gapsData.leadgen.annualLeadsGenerated, gapsData.retail.annualStoreVisitors, marketData.avgYearlyCustomerValue, scenariosData.visibilityGapPercent, scenariosData.leadGenGapPercent, scenariosData.closeRateGapPercent]);

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
