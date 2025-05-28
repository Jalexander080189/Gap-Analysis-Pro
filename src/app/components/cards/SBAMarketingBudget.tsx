'use client';

import React, { useState, useEffect } from 'react';
import { parseHumanFriendlyNumber, formatCurrency } from '../../utils/numberFormatting';

interface SBAMarketingBudgetProps {
  data: {
    annualRevenue: string;
    years: Array<{
      startRevenue: number;
      spendIncrease: number;
      yearlyBudget: number;
      monthlyBudget: number;
      minimumROI: number;
      endRevenue: number;
      percentIncrease: number;
      customers: {
        annual: number;
        monthly: number;
        weekly: number;
        daily: number;
      };
    }>;
    worstCaseRevenue: number;
    worstCaseSpend: number;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const SBAMarketingBudget: React.FC<SBAMarketingBudgetProps> = ({ data, setData }) => {
  // Add state for social interactions
  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [shared, setShared] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
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

  // Calculate 5-year forecast when annual revenue changes
  useEffect(() => {
    const annualRevenue = parseHumanFriendlyNumber(data.annualRevenue);
    if (annualRevenue <= 0) return;
    
    const years = [];
    let currentRevenue = annualRevenue;
    let totalSpend = 0;
    
    for (let i = 0; i < 5; i++) {
      const startRevenue = currentRevenue;
      const yearlyBudget = startRevenue * 0.08; // 8% of revenue
      const monthlyBudget = yearlyBudget / 12;
      const minimumROI = yearlyBudget * 3; // 3x ROI
      const endRevenue = startRevenue + minimumROI;
      const percentIncrease = (endRevenue - startRevenue) / startRevenue * 100;
      const spendIncrease = i > 0 ? yearlyBudget - years[i-1].yearlyBudget : 0;
      
      // Calculate customers needed for 3x ROI
      const avgCustomerValue = 1000; // Placeholder, should be from Market Overview
      const annualCustomers = minimumROI / avgCustomerValue;
      const monthlyCustomers = annualCustomers / 12;
      const weeklyCustomers = monthlyCustomers / 4.33;
      const dailyCustomers = weeklyCustomers / 7;
      
      years.push({
        startRevenue,
        spendIncrease,
        yearlyBudget,
        monthlyBudget,
        minimumROI,
        endRevenue,
        percentIncrease,
        customers: {
          annual: annualCustomers,
          monthly: monthlyCustomers,
          weekly: weeklyCustomers,
          daily: dailyCustomers
        }
      });
      
      currentRevenue = endRevenue;
      totalSpend += yearlyBudget;
    }
    
    setData(prev => ({
      ...prev,
      years,
      worstCaseRevenue: years[4].endRevenue,
      worstCaseSpend: totalSpend
    }));
  }, [data.annualRevenue]);

  return (
    <div className="card">
      <h2 className="section-title">SBA 5-Year Marketing Budget Forecast</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Annual Revenue
        </label>
        <input
          type="text"
          name="annualRevenue"
          value={data.annualRevenue}
          onChange={handleInputChange}
          className="input-field"
          placeholder="e.g. 1M or $1,000,000"
        />
      </div>
      
      {parseHumanFriendlyNumber(data.annualRevenue) > 0 && (
        <>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  {data.years.map((_, index) => (
                    <th key={index} className="py-2 px-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm">Start of Year Revenue</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {formatCurrency(year.startRevenue)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm">Spend Increase</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {formatCurrency(year.spendIncrease)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm">Yearly Marketing Budget (8%)</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {formatCurrency(year.yearlyBudget)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm">Monthly Marketing Budget</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {formatCurrency(year.monthlyBudget)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm">Minimum 3× ROI</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {formatCurrency(year.minimumROI)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm">End-of-Year Revenue</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {formatCurrency(year.endRevenue)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm">% Revenue Increase</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {year.percentIncrease.toFixed(1)}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm"># Customers for 3× ROI (Annual)</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {Math.round(year.customers.annual).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm"># Customers for 3× ROI (Monthly)</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {Math.round(year.customers.monthly).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm"># Customers for 3× ROI (Weekly)</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {Math.round(year.customers.weekly).toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 border-b border-gray-200 text-sm"># Customers for 3× ROI (Daily)</td>
                  {data.years.map((year, index) => (
                    <td key={index} className="py-2 px-3 border-b border-gray-200 text-sm">
                      {Math.round(year.customers.daily).toLocaleString()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Worst-Case 5-Year Annual Revenue</p>
                <p className="font-medium">{formatCurrency(data.worstCaseRevenue)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">5-Year Marketing Spend</p>
                <p className="font-medium">{formatCurrency(data.worstCaseSpend)}</p>
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
    </div>
  );
};

export default SBAMarketingBudget;
