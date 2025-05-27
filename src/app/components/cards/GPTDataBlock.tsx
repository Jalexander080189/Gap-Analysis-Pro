'use client';

import React from 'react';

interface ClientDataType {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessType: string;
  businessDescription: string;
  showBack: boolean;
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
  channels: Array<{name: string; monthlyAdspend: string; monthlyCost: string}>;
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
  return (
    <div className="hidden">
      {/* This component is used to pass data to GPT for analysis */}
      <div id="client-data">
        {JSON.stringify(clientData)}
      </div>
      <div id="market-data">
        {JSON.stringify(marketData)}
      </div>
      <div id="company-data">
        {JSON.stringify(companyData)}
      </div>
      <div id="gaps-data">
        {JSON.stringify(gapsData)}
      </div>
      <div id="scenarios-data">
        {JSON.stringify(scenariosData)}
      </div>
      <div id="marketing-data">
        {JSON.stringify(marketingData)}
      </div>
    </div>
  );
};

export default GPTDataBlock;
