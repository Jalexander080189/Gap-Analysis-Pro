// Define the ScenariosData interface to match what the component expects
export interface ScenariosData {
  visibilityGapPercent: number;
  leadGenGapPercent: number;
  closeRateGapPercent: number;
  additionalAnnualLeads: number;
  additionalAnnualNewAccountsClosed: number;
  additionalAnnualRevenueCreated: number;
  totalCalculatedAnnualRevenue: number;
  showBack: boolean;
  // Add the missing properties that the deployment expects
  visibilityReachSlider?: number;
  leadGenSlider?: number;
  closeRateSlider?: number;
  additionalLeads?: number;
  additionalRevenue?: number;
  additionalClosed?: number;
}

export default ScenariosData;
