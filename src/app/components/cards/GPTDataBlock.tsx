// Updated GPTDataBlock.tsx to include new fields

import React from 'react';

// Define proper TypeScript interfaces
export interface ContactType {
  name: string;
  email: string;
  mobile: string;
  title: string;
}

export interface ClientDataType {
  companyName: string;
  companyWebsite: string;
  companyFacebookURL: string;
  instagramURL: string;
  facebookAdLibraryURL: string;
  phoenixURL: string;
  companyAddress: string;
  industryType: string;
  contacts: ContactType[];
  businessDescription: string;
  showBack: boolean;
  profileImage?: string;
  coverImage?: string;
  
  // Legacy fields for backward compatibility
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactTitle?: string;
  businessType?: string;
}

interface MarketDataType {
  audienceSize: string;
  buyerPercentage: string;
  avgYearlyCustomerValue: string;
  calculatedBuyers: number;
  totalMarketRevShare: number;
  showBack: boolean;
}

interface CompanyDataType {
  annualRevenue: string;
  percentNewCustomers: string;
  percentCurrentCustomers: string;
  calculatedTotalCustomers: number;
  calculatedNewCustomers: number;
  percentOfMarketRevShare: number;
  showBack: boolean;
}

interface GapsDataType {
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
}

interface ScenariosDataType {
  visibilityReachSlider: number;
  leadGenSlider: number;
  closeRateSlider: number;
  additionalLeads: number;
  additionalRevenue: number;
  additionalNewAccounts: number;
  totalCalculatedAnnualRevenue: number;
  showBack: boolean;
}

interface MarketingDataType {
  channels: Array<{
    name: string;
    monthlyAdspend: string;
    monthlyCost: string;
  }>;
  totalMonthlySpend: number;
  totalYearlySpend: number;
  additionalMonthlySpend: number;
  percentOfAnnualRevenue: number;
  showBack: boolean;
}

interface GPTDataBlockProps {
  clientData: ClientDataType;
  marketData: MarketDataType;
  companyData: CompanyDataType;
  gapsData: GapsDataType;
  scenariosData: ScenariosDataType;
  marketingData: MarketingDataType;
}

const GPTDataBlock: React.FC<GPTDataBlockProps> = ({
  clientData,
  marketData,
  companyData,
  gapsData,
  scenariosData,
  marketingData
}) => {
  // This component is hidden but contains all the data for GPT analysis
  const allData = {
    clientData,
    marketData,
    companyData,
    gapsData,
    scenariosData,
    marketingData
  };

  return (
    <div style={{ display: 'none' }} data-gpt-analysis={JSON.stringify(allData)}>
      {/* Hidden data block for GPT analysis */}
      <div>Company: {clientData.companyName}</div>
      <div>Industry: {clientData.industryType}</div>
      <div>Website: {clientData.companyWebsite}</div>
      <div>Facebook: {clientData.companyFacebookURL}</div>
      <div>Instagram: {clientData.instagramURL}</div>
      <div>Facebook Ad Library: {clientData.facebookAdLibraryURL}</div>
      <div>Phoenix: {clientData.phoenixURL}</div>
      <div>Address: {clientData.companyAddress}</div>
      <div>Business Description: {clientData.businessDescription}</div>
      <div>Contacts: {JSON.stringify(clientData.contacts)}</div>
      <div>Market Data: {JSON.stringify(marketData)}</div>
      <div>Company Data: {JSON.stringify(companyData)}</div>
      <div>Gaps Data: {JSON.stringify(gapsData)}</div>
      <div>Scenarios Data: {JSON.stringify(scenariosData)}</div>
      <div>Marketing Data: {JSON.stringify(marketingData)}</div>
    </div>
  );
};

export default GPTDataBlock;

