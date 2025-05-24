'use client';

import React, { useState, useEffect } from 'react';
import { parseHumanFriendlyNumber, formatCurrency, formatPercentage } from '../../utils/numberFormatting';

interface CurrentMarketingOverviewProps {
  data: {
    channels: Array<{
      name: string;
      monthlyCost: string;
      monthlyAdSpend: string;
    }>;
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
  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedChannels = [...data.channels];
    updatedChannels[index] = {
      ...updatedChannels[index],
      [name]: value
    };
    
    setData({
      ...data,
      channels: updatedChannels
    });
  };

  const addChannel = () => {
    setData({
      ...data,
      channels: [...data.channels, { name: '', monthlyCost: '', monthlyAdSpend: '' }]
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
    let totalMonthly = 0;
    
    data.channels.forEach(channel => {
      const monthlyCost = parseHumanFriendlyNumber(channel.monthlyCost);
      const monthlyAdSpend = parseHumanFriendlyNumber(channel.monthlyAdSpend);
      
      totalMonthly += monthlyCost + monthlyAdSpend;
    });
    
    const totalYearly = totalMonthly * 12;
    const targetYearlySpend = annualRevenue * 0.08; // 8% of annual revenue
    const additionalMonthlyNeeded = Math.max(0, (targetYearlySpend - totalYearly) / 12);
    const percentOfRevenue = annualRevenue > 0 ? (totalYearly / annualRevenue) * 100 : 0;
    
    setData(prev => ({
      ...prev,
      totalMonthlySpend: totalMonthly,
      totalYearlySpend: totalYearly,
      additionalMonthlySpend: additionalMonthlyNeeded,
      percentOfAnnualRevenue: percentOfRevenue
    }));
  }, [data.channels, annualRevenue]);

  return (
    <div className="card">
      <h2 className="section-title">Current Marketing Overview</h2>
      
      <div className="mb-4">
        <div className="grid grid-cols-12 gap-2 mb-2 font-medium text-gray-700">
          <div className="col-span-4">Marketing Channel</div>
          <div className="col-span-3">Monthly Cost</div>
          <div className="col-span-3">Monthly Ad Spend</div>
          <div className="col-span-2"></div>
        </div>
        
        {data.channels.map((channel, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-4">
              <input
                type="text"
                name="name"
                value={channel.name}
                onChange={(e) => handleInputChange(index, e)}
                className="input-field"
                placeholder="Channel name"
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                name="monthlyCost"
                value={channel.monthlyCost}
                onChange={(e) => handleInputChange(index, e)}
                className="input-field"
                placeholder="e.g. $500"
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                name="monthlyAdSpend"
                value={channel.monthlyAdSpend}
                onChange={(e) => handleInputChange(index, e)}
                className="input-field"
                placeholder="e.g. $1k"
              />
            </div>
            <div className="col-span-2">
              {index > 0 && (
                <button
                  onClick={() => removeChannel(index)}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        
        <button
          onClick={addChannel}
          className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
        >
          Add Marketing Channel
        </button>
      </div>
      
      <div className="bg-orange-100 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Monthly Spend</p>
            <p className="font-medium">{formatCurrency(data.totalMonthlySpend)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Yearly Spend</p>
            <p className="font-medium">{formatCurrency(data.totalYearlySpend)}</p>
          </div>
          
          {annualRevenue > 0 && (
            <>
              <div>
                <p className="text-sm text-gray-600 mb-1">Additional Monthly Spend to Hit 8% of Annual Revenue</p>
                <p className="font-medium">{formatCurrency(data.additionalMonthlySpend)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">% of Annual Revenue Spent</p>
                <p className={`font-medium ${
                  data.percentOfAnnualRevenue < 6 ? 'text-red-600' : 
                  data.percentOfAnnualRevenue >= 8 ? 'text-green-600' : 
                  'text-yellow-600'
                }`}>
                  {formatPercentage(data.percentOfAnnualRevenue / 100)}
                </p>
              </div>
            </>
          )}
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
