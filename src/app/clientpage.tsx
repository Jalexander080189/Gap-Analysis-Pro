'use client'

// Imports remain the same...

// Add this test code
console.log('Client-side JavaScript is running!');
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
  });
}

export default function ClientPage() {
  // State hooks remain the same...
  
  // Fix the useEffect dependency array
  useEffect(() => {
    console.log('useEffect running, searchParams:', searchParams.toString());
    
    // Initialize state regardless of searchParams
    const initialData = searchParams.get('company') 
      ? JSON.parse(decodeURIComponent(searchParams.get('company') || '{}'))
      : {};
      
    // Set all state variables with proper defaults
    setClientData(initialData.client || clientData);
    setCompanyData(initialData.company || companyData);
    setMarketData(initialData.market || marketData);
    setGapsData(initialData.gaps || gapsData);
    setScenariosData(initialData.scenarios || scenariosData);
    setMarketingData(initialData.marketing || marketingData);
    setSbaData(initialData.sba || sbaData);
    setNotesData(initialData.notes || notesData);
    
  }, [
    searchParams,
    clientData, setClientData,
    companyData, setCompanyData,
    marketData, setMarketData,
    gapsData, setGapsData,
    scenariosData, setScenariosData,
    marketingData, setMarketingData,
    sbaData, setSbaData,
    notesData, setNotesData
  ]);
  
  // Rest of the component remains the same...
}
