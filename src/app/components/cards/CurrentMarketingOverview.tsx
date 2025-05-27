'use client';

import React, { useEffect } from 'react';
import { formatNumber } from '../../utils/numberFormatting';

interface MarketingChannel {
  name: string;
  monthlyAdspend: string;
  monthlyCost: string;
}

interface MarketingData {
  channels: MarketingChannel[];
  totalMonthlySpend: number;
  totalYearlySpend: number;
  additionalMonthlySpend: number;
  percentOfAnnualRevenue: number;
  showBack: boolean;
}

interface CurrentMarketingOverviewProps {
  data: MarketingData;
  setData: React.Dispatch<React.SetStateAction<MarketingData>>;
  annualRevenue: number;
}

const CurrentMarketingOverview: React.FC<CurrentMarketingOverviewProps> = ({ 
  data, 
  setData, 
  annualRevenue 
}) => {
  const handleChannelChange = (index: number, field: keyof MarketingChannel, value: string) => {
    const updatedChannels = [...data.channels];
    updatedChannels[index] = {
      ...updatedChannels[index],
      [field]: value
    };
    
    setData({
      ...data,
      channels: updatedChannels
    });
  };

  const addChannel = () => {
    setData({
      ...data,
      channels: [
        ...data.channels,
        { name: '', monthlyAdspend: '0', monthlyCost: '0' }
      ]
    });
  };

  const removeChannel = (index: number) => {
    const updatedChannels = [...data.channels];
    updatedChannels.splice(index, 1);
    
    setData({
      ...data,
      channels: updatedChannels
    });
  };

  // Calculate totals when channels change
  useEffect(() => {
    let totalMonthlySpend = 0;
    
    data.channels.forEach(channel => {
      const adspend = parseFloat(channel.monthlyAdspend.replace(/,/g, '')) || 0;
      const cost = parseFloat(channel.monthlyCost.replace(/,/g, '')) || 0;
      totalMonthlySpend += adspend + cost;
    });
    
    const totalYearlySpend = totalMonthlySpend * 12;
    const targetMonthlySpend = (annualRevenue * 0.08) / 12;
    const additionalMonthlySpend = Math.max(0, targetMonthlySpend - totalMonthlySpend);
    const percentOfAnnualRevenue = annualRevenue > 0 ? (totalMonthlySpend / (annualRevenue / 12)) * 100 : 0;
    
    setData({
      ...data,
      totalMonthlySpend,
      totalYearlySpend,
      additionalMonthlySpend,
      percentOfAnnualRevenue
    });
  }, [data, setData, annualRevenue, data.channels]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Current Marketing Overview</h2>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">Marketing Channels</h3>
          <button
            onClick={addChannel}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
            type="button"
          >
            Add Channel
          </button>
        </div>
        
        {data.channels.map((channel, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-2 bg-gray-50 rounded-md">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                value={channel.name}
                onChange={(e) => handleChannelChange(index, 'name', e.target.value)}
                className="input-field"
                placeholder="e.g., Google Ads"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Monthly Adspend
              </label>
              <input
                type="text"
                value={channel.monthlyAdspend}
                onChange={(e) => handleChannelChange(index, 'monthlyAdspend', e.target.value)}
                className="input-field"
                placeholder="e.g., 1000"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Monthly Cost
              </label>
              <input
                type="text"
                value={channel.monthlyCost}
                onChange={(e) => handleChannelChange(index, 'monthlyCost', e.target.value)}
                className="input-field"
                placeholder="e.g., 500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => removeChannel(index)}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                type="button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="stat-card">
          <h3 className="stat-title">Total Monthly Spend</h3>
          <p className="stat-value">${formatNumber(data.totalMonthlySpend)}</p>
          <p className="stat-desc">Combined monthly marketing spend</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Total Yearly Spend</h3>
          <p className="stat-value">${formatNumber(data.totalYearlySpend)}</p>
          <p className="stat-desc">Projected annual marketing spend</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Additional Monthly Spend to Hit 8%</h3>
          <p className="stat-value">${formatNumber(data.additionalMonthlySpend)}</p>
          <p className="stat-desc">Recommended additional monthly spend</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">% of Annual Revenue Spent</h3>
          <p className="stat-value">{formatNumber(data.percentOfAnnualRevenue)}%</p>
          <p className="stat-desc">Current marketing spend as % of revenue</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <button className="social-button" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>
        <button className="social-button" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comment
        </button>
        <button className="social-button" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};

export default CurrentMarketingOverview;
