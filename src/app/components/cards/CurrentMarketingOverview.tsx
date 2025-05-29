'use client';

import React, { useState, useEffect } from 'react';
import { parseHumanFriendlyNumber, formatPercentage } from '../../utils/numberFormatting';

// Define the exact type to match clientpage.tsx
interface MarketingData {
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
  // Add state for social interactions
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [shared, setShared] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelMonthlyCost, setNewChannelMonthlyCost] = useState('');
  const [newChannelMonthlyAdspend, setNewChannelMonthlyAdspend] = useState('');

  const handleChannelInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
    const { value } = e.target;
    
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

  const handleAddChannel = () => {
    if (newChannelName) {
      const newChannel = {
        name: newChannelName,
        monthlyCost: newChannelMonthlyCost || '0',
        monthlyAdspend: newChannelMonthlyAdspend || '0'
      };
      
      setData({
        ...data,
        channels: [...data.channels, newChannel]
      });
      
      setNewChannelName('');
      setNewChannelMonthlyCost('');
      setNewChannelMonthlyAdspend('');
    }
  };

  const handleRemoveChannel = (index: number) => {
    const updatedChannels = [...data.channels];
    updatedChannels.splice(index, 1);
    
    setData({
      ...data,
      channels: updatedChannels
    });
  };
  
  // Add event handlers for social interactions
  const handleLikeClick = () => {
    setLiked(!liked);
    console.log('Like button clicked, new state:', !liked);
  };

  const handleCommentClick = () => {
    setCommentOpen(!commentOpen);
    console.log('Comment button clicked, new state:', !commentOpen);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText('');
      console.log('Comment submitted:', commentText);
    }
  };

  const handleShareClick = () => {
    setShared(!shared);
    console.log('Share button clicked, new state:', !shared);
  };

  // Calculate totals when channels change
  useEffect(() => {
    // Calculate total monthly spend
    let totalMonthlySpend = 0;
    
    data.channels.forEach(channel => {
      const monthlyCost = parseHumanFriendlyNumber(channel.monthlyCost);
      const monthlyAdspend = parseHumanFriendlyNumber(channel.monthlyAdspend);
      totalMonthlySpend += monthlyCost + monthlyAdspend;
    });
    
    // Calculate total yearly spend
    const totalYearlySpend = totalMonthlySpend * 12;
    
    // Calculate additional monthly spend to hit 8% of annual revenue
    const targetMonthlySpend = (annualRevenue * 0.08) / 12;
    const additionalMonthlySpend = targetMonthlySpend - totalMonthlySpend;
    
    // Calculate percentage of annual revenue spent on marketing
    const percentOfAnnualRevenue = annualRevenue > 0 ? (totalYearlySpend / annualRevenue) : 0;
    
    setData({
      ...data,
      totalMonthlySpend,
      totalYearlySpend,
      additionalMonthlySpend,
      percentOfAnnualRevenue
    });
  }, [data.channels, annualRevenue, setData]);

  // Helper function to calculate total monthly cost for a channel
  const calculateTotalMonthlyCost = (monthlyCost: string, monthlyAdspend: string): number => {
    return parseHumanFriendlyNumber(monthlyCost) + parseHumanFriendlyNumber(monthlyAdspend);
  };

  return (
    <div className="card">
      <h2 className="section-title">Current Marketing Overview</h2>
      
      <div className="mb-6">
        <h3 className="card-title">Marketing Channels</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Cost
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Adspend
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Monthly
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
                      onChange={(e) => handleChannelInputChange(e, index, 'name')}
                      className="input-field"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={channel.monthlyCost}
                      onChange={(e) => handleChannelInputChange(e, index, 'monthlyCost')}
                      className="input-field"
                      placeholder="e.g. $1k or $1,000"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={channel.monthlyAdspend}
                      onChange={(e) => handleChannelInputChange(e, index, 'monthlyAdspend')}
                      className="input-field"
                      placeholder="e.g. $1k or $1,000"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${calculateTotalMonthlyCost(channel.monthlyCost, channel.monthlyAdspend).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleRemoveChannel(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="input-field"
                    placeholder="New Channel Name"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newChannelMonthlyCost}
                    onChange={(e) => setNewChannelMonthlyCost(e.target.value)}
                    className="input-field"
                    placeholder="e.g. $1k or $1,000"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newChannelMonthlyAdspend}
                    onChange={(e) => setNewChannelMonthlyAdspend(e.target.value)}
                    className="input-field"
                    placeholder="e.g. $1k or $1,000"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${(parseHumanFriendlyNumber(newChannelMonthlyCost) + parseHumanFriendlyNumber(newChannelMonthlyAdspend)).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={handleAddChannel}
                    className="text-blue-600 hover:text-blue-900"
                    disabled={!newChannelName}
                  >
                    Add Channel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Marketing Budget Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Monthly Spend</p>
            <p className="font-medium">${Math.round(data.totalMonthlySpend).toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Yearly Spend</p>
            <p className="font-medium">${Math.round(data.totalYearlySpend).toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Additional Monthly Spend to Hit 8% of Annual Revenue</p>
            <p className="font-medium">${Math.round(data.additionalMonthlySpend).toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">% of Annual Revenue Spent</p>
            <p className={`font-medium ${data.percentOfAnnualRevenue >= 0.08 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(data.percentOfAnnualRevenue)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        {/* Refactored Like button with React event handler */}
        <button 
          className={`social-button ${liked ? 'bg-blue-100' : ''}`}
          onClick={handleLikeClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          {liked ? 'Liked' : 'Like'}
        </button>
        
        {/* Refactored Comment button with React event handler */}
        <button 
          className={`social-button ${commentOpen ? 'bg-blue-100' : ''}`}
          onClick={handleCommentClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Comment
        </button>
        
        {/* Refactored Share button with React event handler */}
        <button 
          className={`social-button ${shared ? 'bg-blue-100' : ''}`}
          onClick={handleShareClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {shared ? 'Shared' : 'Share'}
        </button>
      </div>
      
      {/* Comment form - conditionally rendered */}
      {commentOpen && (
        <div className="mt-2 p-3 border border-gray-200 rounded-lg">
          <textarea 
            value={commentText}
            onChange={handleCommentChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Write a comment..."
            rows={2}
          />
          <button 
            onClick={handleCommentSubmit}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      )}
      
      {/* Comments list */}
      {comments.length > 0 && (
        <div className="mt-2 p-3 border border-gray-200 rounded-lg">
          <h4 className="font-medium mb-2">Comments</h4>
          {comments.map((comment, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded mb-1">{comment}</div>
          ))}
        </div>
      )}
      
      <button 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => setData({ ...data, showBack: !data.showBack })}
      >
        {data.showBack ? 'Show Front' : 'Show Back'}
      </button>
    </div>
  );
};

export default CurrentMarketingOverview;
