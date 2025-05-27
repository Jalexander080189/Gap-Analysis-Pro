'use client';

import React, { useEffect } from 'react';
import { formatNumber } from '../../utils/numberFormatting';

interface SBAMarketingBudgetData {
  recommendedMonthlyBudget: string;
  recommendedYearlyBudget: string;
  recommendedChannels: {
    name: string;
    monthlyBudget: string;
    description: string;
  }[];
  showBack: boolean;
}

interface SBAMarketingBudgetProps {
  data: SBAMarketingBudgetData;
  setData: React.Dispatch<React.SetStateAction<SBAMarketingBudgetData>>;
  annualRevenue: number;
}

const SBAMarketingBudget: React.FC<SBAMarketingBudgetProps> = ({ 
  data, 
  setData, 
  annualRevenue 
}) => {
  const handleChannelChange = (index: number, field: keyof SBAMarketingBudgetData['recommendedChannels'][0], value: string) => {
    const updatedChannels = [...data.recommendedChannels];
    updatedChannels[index] = {
      ...updatedChannels[index],
      [field]: value
    };
    
    setData({
      ...data,
      recommendedChannels: updatedChannels
    });
  };

  const addChannel = () => {
    setData({
      ...data,
      recommendedChannels: [
        ...data.recommendedChannels,
        { name: '', monthlyBudget: '0', description: '' }
      ]
    });
  };

  const removeChannel = (index: number) => {
    const updatedChannels = [...data.recommendedChannels];
    updatedChannels.splice(index, 1);
    
    setData({
      ...data,
      recommendedChannels: updatedChannels
    });
  };

  // Calculate recommended budgets based on annual revenue
  useEffect(() => {
    // SBA recommends 7-8% of revenue for marketing
    const recommendedMonthlyBudget = (annualRevenue * 0.08) / 12;
    const recommendedYearlyBudget = annualRevenue * 0.08;
    
    setData({
      ...data,
      recommendedMonthlyBudget: formatNumber(recommendedMonthlyBudget),
      recommendedYearlyBudget: formatNumber(recommendedYearlyBudget)
    });
  }, [annualRevenue, data, setData]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">SBA Marketing Budget Recommendations</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="stat-card">
          <h3 className="stat-title">Recommended Monthly Budget</h3>
          <p className="stat-value">${data.recommendedMonthlyBudget}</p>
          <p className="stat-desc">Based on 8% of annual revenue</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Recommended Yearly Budget</h3>
          <p className="stat-value">${data.recommendedYearlyBudget}</p>
          <p className="stat-desc">Based on 8% of annual revenue</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">Recommended Marketing Channels</h3>
          <button
            onClick={addChannel}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
            type="button"
          >
            Add Channel
          </button>
        </div>
        
        {data.recommendedChannels.map((channel, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 p-2 bg-gray-50 rounded-md">
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
                Monthly Budget
              </label>
              <input
                type="text"
                value={channel.monthlyBudget}
                onChange={(e) => handleChannelChange(index, 'monthlyBudget', e.target.value)}
                className="input-field"
                placeholder="e.g., 1000"
              />
            </div>
            
            <div className="md:col-span-1 flex flex-col">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="flex flex-1">
                <input
                  type="text"
                  value={channel.description}
                  onChange={(e) => handleChannelChange(index, 'description', e.target.value)}
                  className="input-field flex-1"
                  placeholder="e.g., Search ads targeting main keywords"
                />
                <button
                  onClick={() => removeChannel(index)}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm h-full"
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
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

export default SBAMarketingBudget;
