'use client';

import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/numberFormatting';

interface YearData {
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
}

interface SBAMarketingBudgetProps {
  data: {
    annualRevenue: string;
    years: YearData[];
    worstCaseRevenue: number;
    worstCaseSpend: number;
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const SBAMarketingBudget: React.FC<SBAMarketingBudgetProps> = ({ data, setData }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setData({
      ...data,
      [name]: value
    });
  };

  const handleYearChange = (yearIndex: number, field: keyof YearData, value: number) => {
    const updatedYears = [...data.years];
    updatedYears[yearIndex] = {
      ...updatedYears[yearIndex],
      [field]: value
    };
    
    setData({
      ...data,
      years: updatedYears
    });
  };

  // Calculate budget projections when annual revenue changes
  useEffect(() => {
    const annualRevenue = parseFloat(data.annualRevenue.replace(/,/g, '')) || 0;
    
    if (annualRevenue > 0) {
      const updatedYears = data.years.map((year, index) => {
        // First year starts with current annual revenue
        const startRevenue = index === 0 ? annualRevenue : data.years[index - 1].endRevenue;
        
        // Default spend increase is 8% of start revenue
        const spendIncrease = year.spendIncrease || 8;
        
        // Calculate yearly budget based on spend increase
        const yearlyBudget = (startRevenue * spendIncrease) / 100;
        const monthlyBudget = yearlyBudget / 12;
        
        // Default minimum ROI is 3x
        const minimumROI = year.minimumROI || 3;
        
        // Calculate end revenue based on ROI
        const endRevenue = startRevenue + (yearlyBudget * minimumROI);
        
        // Calculate percent increase
        const percentIncrease = ((endRevenue - startRevenue) / startRevenue) * 100;
        
        // Assume average customer value of $1000 for customer calculations
        const avgCustomerValue = 1000;
        const annualCustomers = (endRevenue - startRevenue) / avgCustomerValue;
        
        return {
          ...year,
          startRevenue,
          yearlyBudget,
          monthlyBudget,
          endRevenue,
          percentIncrease,
          customers: {
            annual: annualCustomers,
            monthly: annualCustomers / 12,
            weekly: annualCustomers / 52,
            daily: annualCustomers / 365
          }
        };
      });
      
      // Calculate worst case scenario (50% of projected growth)
      const finalYear = updatedYears[updatedYears.length - 1];
      const worstCaseRevenue = annualRevenue + ((finalYear.endRevenue - annualRevenue) * 0.5);
      const worstCaseSpend = updatedYears.reduce((total, year) => total + year.yearlyBudget, 0);
      
      setData({
        ...data,
        years: updatedYears,
        worstCaseRevenue,
        worstCaseSpend
      });
    }
  }, [data.annualRevenue]);

  // Swap X and Y axes in chart rendering
  const renderChart = () => {
    // This is a simplified representation of the chart
    // In a real implementation, you would use a charting library like Chart.js
    return (
      <div className="chart-container">
        {/* Chart would be rendered here with swapped X and Y axes */}
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          Chart with X and Y axes swapped
          <div className="mt-2 text-sm text-gray-500">
            Y-axis (horizontal): Revenue values<br />
            X-axis (vertical): Years
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <h2 className="section-title mb-6">SBA Marketing Budget</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Annual Revenue
        </label>
        <input
          type="text"
          name="annualRevenue"
          value={data.annualRevenue}
          onChange={handleInputChange}
          className="input-field"
          placeholder="e.g., 1,000,000"
        />
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">5-Year Projection</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Revenue
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spend Increase %
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yearly Budget
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Budget
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Minimum ROI
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Revenue
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Increase
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.years.map((year, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    Year {index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    ${formatNumber(year.startRevenue)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={year.spendIncrease}
                      onChange={(e) => handleYearChange(index, 'spendIncrease', parseFloat(e.target.value) || 0)}
                      className="w-20 input-field"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    ${formatNumber(year.yearlyBudget)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    ${formatNumber(year.monthlyBudget)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={year.minimumROI}
                      onChange={(e) => handleYearChange(index, 'minimumROI', parseFloat(e.target.value) || 0)}
                      className="w-20 input-field"
                      min="0"
                      step="0.1"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    ${formatNumber(year.endRevenue)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatNumber(year.percentIncrease)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Customer Growth</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual New Customers
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly New Customers
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weekly New Customers
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daily New Customers
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.years.map((year, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    Year {index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatNumber(year.customers.annual)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatNumber(year.customers.monthly)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatNumber(year.customers.weekly)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatNumber(year.customers.daily)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Revenue Projection</h3>
        {renderChart()}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="stat-title">Worst Case Revenue (50% of Projected Growth)</h3>
          <p className="stat-value">${formatNumber(data.worstCaseRevenue)}</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-title">Total 5-Year Marketing Spend</h3>
          <p className="stat-value">${formatNumber(data.worstCaseSpend)}</p>
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

export default SBAMarketingBudget;
