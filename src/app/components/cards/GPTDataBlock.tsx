'use client';

import React from 'react';

interface GPTDataBlockProps {
  clientData: Record<string, string>;
  marketData: Record<string, string | number>;
  companyData: Record<string, string | number>;
  gapsData: {
    mode: string;
    leadgen: Record<string, string | number>;
    retail: Record<string, string | number>;
    showBack: boolean;
  };
  scenariosData: Record<string, string | number>;
  marketingData: {
    channels: Array<{name: string; monthlyAdspend: string; monthlyCost: string}>;
    totalMonthlySpend: number;
    totalYearlySpend: number;
    additionalMonthlySpend: number;
    percentOfAnnualRevenue: number;
    showBack: boolean;
  };
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
