'use client';

import React, { useState, useEffect } from 'react';
import { parseHumanFriendlyNumber, formatPercentage } from '../../utils/numberFormatting';

// Define the exact type to match clientpage.tsx
interface SBAData {
  recommendedMonthlyBudget: string;
  recommendedYearlyBudget: string;
  recommendedChannels: Array<{
    name: string;
    monthlyBudget: string;
    description: string;
  }>;
  showBack: boolean;
}

interface SBAMarketingBudgetProps {
  data: SBAData;
  setData: React.Dispatch<React.SetStateAction<SBAData>>;
  annualRevenue: number;
}

const SBAMarketingBudget: React.FC<SBAMarketingBudgetProps> = ({ 
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
  const [userAnnualRevenue, setUserAnnualRevenue] = useState(annualRevenue.toString());
  const [showForecast, setShowForecast] = useState(false);

  // Calculate 5-year forecast when annual revenue changes
  useEffect(() => {
    // Update recommended budgets based on annual revenue
    const annualRevenueValue = parseFloat(userAnnualRevenue.replace(/,/g, '')) || annualRevenue;
    const recommendedYearlyBudget = (annualRevenueValue * 0.08).toLocaleString();
    const recommendedMonthlyBudget = (annualRevenueValue * 0.08 / 12).toLocaleString();
    
    // Update recommended channels
    const updatedChannels = [
      {
        name: 'Digital Marketing',
        monthlyBudget: (annualRevenueValue * 0.03 / 12).toLocaleString(),
        description: 'SEO, PPC, Social Media'
      },
      {
        name: 'Content Marketing',
        monthlyBudget: (annualRevenueValue * 0.02 / 12).toLocaleString(),
        description: 'Blogs, Videos, Podcasts'
      },
      {
        name: 'Traditional Marketing',
        monthlyBudget: (annualRevenueValue * 0.015 / 12).toLocaleString(),
        description: 'Print, Radio, TV'
      },
      {
        name: 'Events & Sponsorships',
        monthlyBudget: (annualRevenueValue * 0.015 / 12).toLocaleString(),
        description: 'Trade Shows, Local Events'
      }
    ];
    
    setData({
      ...data,
      recommendedMonthlyBudget: recommendedMonthlyBudget,
      recommendedYearlyBudget: recommendedYearlyBudget,
      recommendedChannels: updatedChannels
    });
    
    // Show forecast if annual revenue is entered
    if (annualRevenueValue > 0) {
      setShowForecast(true);
    } else {
      setShowForecast(false);
    }
  }, [userAnnualRevenue, annualRevenue, setData]);
  
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

  // Calculate 5-year forecast data
  const calculateForecast = () => {
    const startRevenue = parseFloat(userAnnualRevenue.replace(/,/g, '')) || annualRevenue;
    const forecast = [];
    
    let currentRevenue = startRevenue;
    let previousYearlyBudget = 0;
    
    for (let year = 1; year <= 5; year++) {
      const yearlyMarketingBudget = currentRevenue * 0.08;
      const monthlyMarketingBudget = yearlyMarketingBudget / 12;
      const spendIncrease = yearlyMarketingBudget - previousYearlyBudget;
      const minimumROI = yearlyMarketingBudget * 3;
      const endOfYearRevenue = currentRevenue + minimumROI;
      const percentRevenueIncrease = ((endOfYearRevenue - currentRevenue) / currentRevenue) * 100;
      
      // Calculate customers needed for 3x ROI
      const avgCustomerValue = 1000; // Assuming $1000 average customer value
      const annualCustomers = minimumROI / avgCustomerValue;
      const monthlyCustomers = annualCustomers / 12;
      const weeklyCustomers = monthlyCustomers / 4.33;
      const dailyCustomers = weeklyCustomers / 7;
      
      forecast.push({
        year,
        startOfYearRevenue: currentRevenue,
        spendIncrease,
        yearlyMarketingBudget,
        monthlyMarketingBudget,
        minimumROI,
        endOfYearRevenue,
        percentRevenueIncrease,
        customers: {
          annual: annualCustomers,
          monthly: monthlyCustomers,
          weekly: weeklyCustomers,
          daily: dailyCustomers
        }
      });
      
      // Set up for next year
      previousYearlyBudget = yearlyMarketingBudget;
      currentRevenue = endOfYearRevenue;
    }
    
    return forecast;
  };
  
  const forecast = calculateForecast();
  const finalYearData = forecast[4]; // Year 5 data

  return (
    <div className="card">
      <h2 className="section-title">SBA 5-Year Budget Forecast</h2>
      
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Annual Revenue
          </label>
          <input
            type="text"
            value={userAnnualRevenue}
            onChange={(e) => setUserAnnualRevenue(e.target.value)}
            className="input-field"
            placeholder="e.g. 1000000"
          />
        </div>
      </div>
      
      {showForecast && (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start of Year Revenue
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 bg-green-50 uppercase tracking-wider">
                    Spend Increase
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yearly Marketing Budget (8%)
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Marketing Budget
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Minimum 3× ROI
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 bg-green-50 uppercase tracking-wider">
                    End-of-Year Revenue
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Revenue Increase
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forecast.map((year) => (
                  <tr key={year.year}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {year.year}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      ${Math.round(year.startOfYearRevenue).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50 font-medium">
                      ${Math.round(year.spendIncrease).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      ${Math.round(year.yearlyMarketingBudget).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      ${Math.round(year.monthlyMarketingBudget).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      ${Math.round(year.minimumROI).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm bg-green-50 font-medium">
                      ${Math.round(year.endOfYearRevenue).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {year.percentRevenueIncrease.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-3">SBA End-of-Year 5 Worst-Case-Scenario</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Annual Marketing Spend</p>
                <p className="font-medium">${Math.round(finalYearData.yearlyMarketingBudget).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">End-of-Year Revenue</p>
                <p className="font-medium">${Math.round(finalYearData.endOfYearRevenue).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </>
      )}
      
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

export default SBAMarketingBudget;
