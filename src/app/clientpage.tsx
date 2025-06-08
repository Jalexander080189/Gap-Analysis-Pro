{/* Cards 2, 3, 4 in a single horizontal row using CSS Grid */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  width: '100%',
  marginBottom: '2rem'
}}>
  <div>
    <MarketOverview 
      data={marketData} 
      setData={setMarketData} 
    />
  </div>
  
  <div>
    <CompanyOverview 
      data={companyData} 
      setData={setCompanyData} 
      avgYearlyCustomerValue={parseFloat(marketData.avgYearlyCustomerValue.replace(/,/g, '')) || 0}
      totalMarketRevShare={marketData.totalMarketRevShare}
    />
  </div>
  
  <div>
    <GapsAndOpps 
      data={gapsData} 
      setData={setGapsData} 
      calculatedBuyers={marketData.calculatedBuyers}
    />
  </div>
</div>
