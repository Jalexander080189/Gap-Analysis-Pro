'use client';

import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/numberFormatting';


interface MarketingChannel {
  name: string;
  monthlyCost: string;
  monthlyAdSpend: string;
}

interface CurrentMarketingOverviewProps {
  data: {
    channels: MarketingChannel[];
    totalMonthlySpend: number;
    totalYearlySpend: number;
    additionalMonthlySpend: number;
    percentOfAnnualRevenue: number;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
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
        { name: '', monthlyCost: '', monthlyAdSpend: '' }
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
    // Calculate total monthly and yearly spend
    const totalMonthly = data.channels.reduce((sum, channel) => {
      const monthlyCost = parseFloat(channel.monthlyCost.replace(/,/g, '')) || 0;
      const monthlyAdSpend = parseFloat(channel.monthlyAdSpend.replace(/,/g, '')) || 0;
      return sum + monthlyCost + monthlyAdSpend;
    }, 0);
    
    const totalYearly = totalMonthly * 12;
    
    // Fix: Calculate additional monthly spend to hit 8% of annual revenue
    const annualRevenueValue = parseFloat(annualRevenue.toString().replace(/,/g, '')) || 0;
    const targetMonthlySpend = (annualRevenueValue * 0.08) / 12;
    const additionalMonthlySpend = Math.max(0, targetMonthlySpend - totalMonthly);
    
    // Fix: Calculate percentage of annual revenue spent
    const percentOfAnnualRevenue = annualRevenueValue > 0 ? 
      (totalMonthly / annualRevenueValue) * 100 : 0;
    
    setData({
      ...data,
      totalMonthlySpend: totalMonthly,
      totalYearlySpend: totalYearly,
      additionalMonthlySpend,
      percentOfAnnualRevenue
    });
  }, [data.channels, annualRevenue]);

  return (
    <div className="card">
      <h2 className="section-title mb-6">Current Marketing Overview</h2>
      
      <div className="mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marketing Channel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Cost
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Ad Spend
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.channels.map((channel, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={channel.name}
                      onChange={(e) => handleChannelChange(index, 'name', e.target.value)}
                      className="input-field"
                      placeholder="e.g., TV, Radio, Social"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={channel.monthlyCost}
                      onChange={(e) => handleChannelChange(index, 'monthlyCost', e.target.value)}
                      className="input-field"
                      placeholder="e.g., 500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={channel.monthlyAdSpend}
                      onChange={(e) => handleChannelChange(index, 'monthlyAdSpend', e.target.value)}
                      className="input-field"
                      placeholder="e.g., 500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => removeChannel(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button
          onClick={addChannel}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Channel
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="stat-card">
          <h3 className="stat-title">Total Monthly Spend</h3>
          <p className="stat-value">${formatNumber(data.totalMonthlySpend)}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Total Yearly Spend</h3>
          <p className="stat-value">${formatNumber(data.totalYearlySpend)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="stat-title">Additional Monthly Spend to Hit 8% of Annual Revenue</h3>
          <p className="stat-value">${formatNumber(data.additionalMonthlySpend)}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">% of Annual Revenue Spent</h3>
          <p className="stat-value">{formatNumber(data.percentOfAnnualRevenue)}%</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>
        <button className="social-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comment
        </button>
        <button className="social-button">
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
