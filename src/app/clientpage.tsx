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
  
  // Scenarios state
  const [scenariosData, setScenariosData] = useState({
    visibilityReachSlider: 5,
    leadGenSlider: 20,
    closeRateSlider: 20,
    additionalLeads: 0,
    additionalRevenue: 0,
    showBack: false
  });
  
  // Current marketing overview state
  const [currentMarketingData, setCurrentMarketingData] = useState({
    currentMarketingBudget: '0',
    currentMarketingChannels: [] as string[],
    currentMarketingEffectiveness: '0',
    showBack: false
  });
  
  // SBA marketing budget state
  const [sbaData, setSbaData] = useState({
    sbaRecommendedBudget: '0',
    sbaChannelRecommendations: [] as string[],
    sbaExpectedROI: '0',
    showBack: false
  });
  
  // Notes state
  const [notesData, setNotesData] = useState({
    notes: '',
    showBack: false
  });
  
  // GPT data block state
  const [gptData, setGptData] = useState({
    gptAnalysis: '',
    gptRecommendations: '',
    showBack: false
  });

  const searchParams = useSearchParams();

  // Load data from URL parameters on component mount
  useEffect(() => {
    const loadDataFromParams = () => {
      // Client data
      const companyName = searchParams.get('companyName');
      const companyWebsite = searchParams.get('companyWebsite');
      const companyFacebookURL = searchParams.get('companyFacebookURL');
      const facebookAdLibraryURL = searchParams.get('facebookAdLibraryURL');
      const instagramURL = searchParams.get('instagramURL');
      const phoenixURL = searchParams.get('phoenixURL');
      const yearsInBusiness = searchParams.get('yearsInBusiness');
      const industryType = searchParams.get('industryType');
      const businessDescription = searchParams.get('businessDescription');
      
      // Legacy contact fields
      const contactName = searchParams.get('contactName');
      const contactEmail = searchParams.get('contactEmail');
      const contactPhone = searchParams.get('contactPhone');
      const contactTitle = searchParams.get('contactTitle');
      
      // Market data
      const audienceSize = searchParams.get('audienceSize');
      const buyerPercentage = searchParams.get('buyerPercentage');
      const avgYearlyCustomerValue = searchParams.get('avgYearlyCustomerValue');
      
      // Company data
      const annualRevenue = searchParams.get('annualRevenue');
      const percentNewCustomers = searchParams.get('percentNewCustomers');
      const percentCurrentCustomers = searchParams.get('percentCurrentCustomers');
      
      // Gaps data
      const gapsMode = searchParams.get('gapsMode') as 'leadgen' | 'retail' | null;
      const annualWebsiteVisitors = searchParams.get('annualWebsiteVisitors');
      const annualLeadsGenerated = searchParams.get('annualLeadsGenerated');
      const annualNewAccountsClosed = searchParams.get('annualNewAccountsClosed');
      const annualStoreVisitors = searchParams.get('annualStoreVisitors');
      
      // Update client data if any parameters exist
      if (companyName || companyWebsite || companyFacebookURL || facebookAdLibraryURL || instagramURL || phoenixURL || yearsInBusiness || industryType || businessDescription || contactName || contactEmail || contactPhone || contactTitle) {
        setClientData(prev => ({
          ...prev,
          companyName: companyName || prev.companyName,
          companyWebsite: companyWebsite || prev.companyWebsite,
          companyFacebookURL: companyFacebookURL || prev.companyFacebookURL,
          facebookAdLibraryURL: facebookAdLibraryURL || prev.facebookAdLibraryURL,
          instagramURL: instagramURL || prev.instagramURL,
          phoenixURL: phoenixURL || prev.phoenixURL,
          yearsInBusiness: yearsInBusiness || prev.yearsInBusiness,
          industryType: industryType || prev.industryType,
          businessDescription: businessDescription || prev.businessDescription,
          contactName: contactName || prev.contactName,
          contactEmail: contactEmail || prev.contactEmail,
          contactPhone: contactPhone || prev.contactPhone,
          contactTitle: contactTitle || prev.contactTitle,
          // Initialize contacts array from legacy fields if they exist
          contacts: (contactName || contactEmail || contactPhone || contactTitle) ? [{
            name: contactName || '',
            email: contactEmail || '',
            mobile: contactPhone || '',
            title: contactTitle || ''
          }] : prev.contacts
        }));
      }
      
      // Update market data if any parameters exist
      if (audienceSize || buyerPercentage || avgYearlyCustomerValue) {
        setMarketData(prev => ({
          ...prev,
          audienceSize: audienceSize || prev.audienceSize,
          buyerPercentage: buyerPercentage || prev.buyerPercentage,
          avgYearlyCustomerValue: avgYearlyCustomerValue || prev.avgYearlyCustomerValue
        }));
      }
      
      // Update company data if any parameters exist
      if (annualRevenue || percentNewCustomers || percentCurrentCustomers) {
        setCompanyData(prev => ({
          ...prev,
          annualRevenue: annualRevenue || prev.annualRevenue,
          percentNewCustomers: percentNewCustomers || prev.percentNewCustomers,
          percentCurrentCustomers: percentCurrentCustomers || prev.percentCurrentCustomers
        }));
      }
      
      // Update gaps data if any parameters exist
      if (gapsMode || annualWebsiteVisitors || annualLeadsGenerated || annualNewAccountsClosed || annualStoreVisitors) {
        setGapsData(prev => ({
          ...prev,
          mode: gapsMode || prev.mode,
          leadgen: {
            ...prev.leadgen,
            annualWebsiteVisitors: annualWebsiteVisitors || prev.leadgen.annualWebsiteVisitors,
            annualLeadsGenerated: annualLeadsGenerated || prev.leadgen.annualLeadsGenerated,
            annualNewAccountsClosed: annualNewAccountsClosed || prev.leadgen.annualNewAccountsClosed
          },
          retail: {
            ...prev.retail,
            annualStoreVisitors: annualStoreVisitors || prev.retail.annualStoreVisitors,
            annualNewAccountsClosed: annualNewAccountsClosed || prev.retail.annualNewAccountsClosed
          }
        }));
      }
    };

    loadDataFromParams();
  }, [searchParams]);

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
    const newCustomers = companyData.calculatedNewCustomers || 0;
    
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
  }, [marketData.calculatedBuyers, companyData.calculatedNewCustomers, gapsData.mode, gapsData.leadgen, gapsData.retail]);

  // Calculate scenarios data
  const calculateScenariosData = useCallback(() => {
    const currentLeads = gapsData.mode === 'leadgen' ? 
      parseInt(gapsData.leadgen.annualLeadsGenerated) || 0 : 
      parseInt(gapsData.retail.annualStoreVisitors) || 0;
    
    const avgValue = parseFloat(marketData.avgYearlyCustomerValue) || 0;
    
    // Calculate additional leads based on slider improvements
    const visibilityImprovement = scenariosData.visibilityReachSlider / 100;
    const leadGenImprovement = scenariosData.leadGenSlider / 100;
    const closeRateImprovement = scenariosData.closeRateSlider / 100;
    
    const additionalLeads = Math.round(currentLeads * (visibilityImprovement + leadGenImprovement + closeRateImprovement));
    const additionalRevenue = additionalLeads * avgValue;
    
    setScenariosData(prev => ({
      ...prev,
      additionalLeads,
      additionalRevenue
    }));
  }, [gapsData.mode, gapsData.leadgen.annualLeadsGenerated, gapsData.retail.annualStoreVisitors, marketData.avgYearlyCustomerValue, scenariosData.visibilityReachSlider, scenariosData.leadGenSlider, scenariosData.closeRateSlider]);

  // Effect hooks for calculations
  useEffect(() => {
    calculateMarketData();
  }, [calculateMarketData]);

  useEffect(() => {
    calculateCompanyData();
  }, [calculateCompanyData]);

  useEffect(() => {
    calculateGapsData();
  }, [calculateGapsData]);

  useEffect(() => {
    calculateScenariosData();
  }, [calculateScenariosData]);

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
          />
          <GapsAndOpps 
            data={gapsData} 
            setData={setGapsData} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Scenarios 
            data={scenariosData} 
            setData={setScenariosData} 
          />
          <CurrentMarketingOverview 
            data={currentMarketingData} 
            setData={setCurrentMarketingData} 
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
            data={gptData} 
            setData={setGptData} 
          />
        </div>
      </div>
    </div>
  );
}

