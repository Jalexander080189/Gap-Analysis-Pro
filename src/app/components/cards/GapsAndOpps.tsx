import React, { useEffect } from 'react';
import DriveLogoToggle from '../DriveLogoToggle';

interface GapsAndOppsData {
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

interface GapsAndOppsProps {
  data: GapsAndOppsData;
  setData: React.Dispatch<React.SetStateAction<GapsAndOppsData>>;
  annualRevenue: number;
  calculatedBuyers: number;
}

const GapsAndOpps: React.FC<GapsAndOppsProps> = ({ 
  data, 
  setData, 
  calculatedBuyers
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (data.mode === 'leadgen') {
      setData({
        ...data,
        leadgen: {
          ...data.leadgen,
          [name]: value
        }
      });
    } else {
      setData({
        ...data,
        retail: {
          ...data.retail,
          [name]: value
        }
      });
    }
  };

  const toggleMode = () => {
    setData({
      ...data,
      mode: data.mode === 'leadgen' ? 'retail' : 'leadgen'
    });
  };

  const toggleView = () => {
    setData({
      ...data,
      showBack: !data.showBack
    });
  };

  // Calculate gaps for Lead Gen mode
  useEffect(() => {
    if (data.mode !== 'leadgen') return;
    
    const visitors = parseFloat(data.leadgen.annualWebsiteVisitors.replace(/[^0-9.]/g, '')) || 0;
    const leads = parseFloat(data.leadgen.annualLeadsGenerated.replace(/[^0-9.]/g, '')) || 0;
    const closed = parseFloat(data.leadgen.annualNewAccountsClosed.replace(/[^0-9.]/g, '')) || 0;
    
    // Visibility Reach Gap = (Calculated buyers total - Yearly website visitors) / Calculated buyers total
    const visibilityReachGap = calculatedBuyers > 0 ? 
      Math.min(Math.max((calculatedBuyers - visitors) / calculatedBuyers, 0), 1) : 0;
    
    // Lead Conversion Gap = (Yearly Website Visitors - Yearly Leads) / Yearly Website Visitors
    const leadGenGap = visitors > 0 ? 
      Math.min(Math.max((visitors - leads) / visitors, 0), 1) : 0;
    
    // Close Rate Gap = (Yearly Leads - Yearly New Closed Accounts) / Yearly Leads
    const closeRateGap = leads > 0 ? 
      Math.min(Math.max((leads - closed) / leads, 0), 1) : 0;
    
    setData(prev => ({
      ...prev,
      leadgen: {
        ...prev.leadgen,
        visibilityReachGap,
        leadGenGap,
        closeRateGap
      }
    }));
  }, [
    data.mode, 
    data.leadgen.annualWebsiteVisitors, 
    data.leadgen.annualLeadsGenerated, 
    data.leadgen.annualNewAccountsClosed,
    calculatedBuyers,
    setData
  ]);

  // Calculate gaps for Retail mode
  useEffect(() => {
    if (data.mode !== 'retail') return;
    
    const visitors = parseFloat(data.retail.annualStoreVisitors.replace(/[^0-9.]/g, '')) || 0;
    const closed = parseFloat(data.retail.annualNewAccountsClosed.replace(/[^0-9.]/g, '')) || 0;
    
    // Visibility Reach Gap = (Calculated buyers total - Yearly store visitors) / Calculated buyers total
    const visibilityReachGap = calculatedBuyers > 0 ? 
      Math.min(Math.max((calculatedBuyers - visitors) / calculatedBuyers, 0), 1) : 0;
    
    // Close Rate Gap = (Yearly Store Visitors - Yearly New Closed Accounts) / Yearly Store Visitors
    const closeRateGap = visitors > 0 ? 
      Math.min(Math.max((visitors - closed) / visitors, 0), 1) : 0;
    
    setData(prev => ({
      ...prev,
      retail: {
        ...prev.retail,
        visibilityReachGap,
        closeRateGap
      }
    }));
  }, [
    data.mode, 
    data.retail.annualStoreVisitors, 
    data.retail.annualNewAccountsClosed,
    calculatedBuyers,
    setData
  ]);

  return (
    <div className="card relative">
      <DriveLogoToggle 
        showBack={data.showBack} 
        setShowBack={() => toggleView()} 
      />
      
      <h2 className="section-title">Gaps & Opportunities</h2>
      
      <div className="mb-4">
        <button
          className={`mr-2 px-3 py-1 rounded-md ${data.mode === 'leadgen' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => data.mode !== 'leadgen' && toggleMode()}
        >
          Lead Gen
        </button>
        <button
          className={`px-3 py-1 rounded-md ${data.mode === 'retail' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => data.mode !== 'retail' && toggleMode()}
        >
          Retail
        </button>
      </div>
      
      {data.showBack ? (
        <div className="card-red p-4 rounded-lg">
          <h3 className="card-title text-red-800">Gaps & Opportunities - Full View</h3>
          
          {data.mode === 'leadgen' ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Website Visitors
                  </label>
                  <input
                    type="text"
                    name="annualWebsiteVisitors"
                    value={data.leadgen.annualWebsiteVisitors}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 10000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Leads Generated
                  </label>
                  <input
                    type="text"
                    name="annualLeadsGenerated"
                    value={data.leadgen.annualLeadsGenerated}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual New Accounts Closed
                  </label>
                  <input
                    type="text"
                    name="annualNewAccountsClosed"
                    value={data.leadgen.annualNewAccountsClosed}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 100"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Visibility Reach Gap</h4>
                  <div className="text-2xl font-bold text-red-600">
                    {(data.leadgen.visibilityReachGap * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {(data.leadgen.visibilityReachGap * 100).toFixed(1)}% of all buyers in market didn&apos;t even look at your company as an option!
                  </p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Lead Gen Gap</h4>
                  <div className="text-2xl font-bold text-red-600">
                    {(data.leadgen.leadGenGap * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {(data.leadgen.leadGenGap * 100).toFixed(1)}% of all buyers that researched you didn&apos;t even leave a name or contact info?!? If you can&apos;t identify them how can you sell them?
                  </p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Close Rate Gap</h4>
                  <div className="text-2xl font-bold text-red-600">
                    {(data.leadgen.closeRateGap * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {(data.leadgen.closeRateGap * 100).toFixed(1)}% of all opportunities given you are saying no too! Why?
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Store Visitors
                  </label>
                  <input
                    type="text"
                    name="annualStoreVisitors"
                    value={data.retail.annualStoreVisitors}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 50000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual New Accounts Closed
                  </label>
                  <input
                    type="text"
                    name="annualNewAccountsClosed"
                    value={data.retail.annualNewAccountsClosed}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Visibility Reach Gap</h4>
                  <div className="text-2xl font-bold text-red-600">
                    {(data.retail.visibilityReachGap * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {(data.retail.visibilityReachGap * 100).toFixed(1)}% of all buyers in market didn&apos;t even look at your company as an option!
                  </p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Close Rate Gap</h4>
                  <div className="text-2xl font-bold text-red-600">
                    {(data.retail.closeRateGap * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {(data.retail.closeRateGap * 100).toFixed(1)}% of all opportunities given you are saying no too! Why?
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600">
              Current Mode: <span className="font-semibold text-red-600">{data.mode === 'leadgen' ? 'Lead Generation' : 'Retail'}</span>
            </p>
          </div>
          
          {data.mode === 'leadgen' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <h4 className="font-medium text-red-800 mb-1">Visibility Gap</h4>
                <div className="text-xl font-bold text-red-600">
                  {(data.leadgen.visibilityReachGap * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <h4 className="font-medium text-red-800 mb-1">Lead Gen Gap</h4>
                <div className="text-xl font-bold text-red-600">
                  {(data.leadgen.leadGenGap * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <h4 className="font-medium text-red-800 mb-1">Close Rate Gap</h4>
                <div className="text-xl font-bold text-red-600">
                  {(data.leadgen.closeRateGap * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <h4 className="font-medium text-red-800 mb-1">Visibility Gap</h4>
                <div className="text-xl font-bold text-red-600">
                  {(data.retail.visibilityReachGap * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <h4 className="font-medium text-red-800 mb-1">Close Rate Gap</h4>
                <div className="text-xl font-bold text-red-600">
                  {(data.retail.closeRateGap * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
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

export default GapsAndOpps;

