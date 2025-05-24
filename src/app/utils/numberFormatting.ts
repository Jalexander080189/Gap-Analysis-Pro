/**
 * Utility functions for parsing and formatting numbers in human-friendly formats
 */

/**
 * Parse a human-friendly number string into a numeric value
 * Supports formats like 1k, $1M, 1,000, etc.
 * 
 * @param value The string value to parse
 * @returns The parsed numeric value
 */
export function parseHumanFriendlyNumber(value: string): number {
  if (!value) return 0;
  
  // Remove currency symbols, commas, and other non-numeric characters except for k, m, b
  let cleanValue = value.replace(/[$,\s%]/gi, '').toLowerCase();
  
  // Handle k (thousands)
  if (cleanValue.includes('k')) {
    cleanValue = cleanValue.replace('k', '');
    return parseFloat(cleanValue) * 1000;
  }
  
  // Handle m (millions)
  if (cleanValue.includes('m')) {
    cleanValue = cleanValue.replace('m', '');
    return parseFloat(cleanValue) * 1000000;
  }
  
  // Handle b (billions)
  if (cleanValue.includes('b')) {
    cleanValue = cleanValue.replace('b', '');
    return parseFloat(cleanValue) * 1000000000;
  }
  
  return parseFloat(cleanValue) || 0;
}

/**
 * Format a number as currency with $ symbol
 * 
 * @param value The number to format
 * @param decimals Number of decimal places (default: 0)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  if (isNaN(value) || value === 0) return '$0';
  
  return '$' + value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format a number as percentage with % symbol
 * 
 * @param value The number to format (0-1 or 0-100)
 * @param decimals Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  if (isNaN(value)) return '0%';
  
  // If value is already in percentage form (0-100)
  if (value > 1) {
    return value.toFixed(decimals) + '%';
  }
  
  // If value is in decimal form (0-1)
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * Format a number with appropriate suffix (k, M, B) for large numbers
 * 
 * @param value The number to format
 * @param decimals Number of decimal places (default: 0)
 * @returns Formatted number with suffix
 */
export function formatCompactNumber(value: number, decimals: number = 0): string {
  if (isNaN(value) || value === 0) return '0';
  
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(decimals) + 'B';
  }
  
  if (value >= 1000000) {
    return (value / 1000000).toFixed(decimals) + 'M';
  }
  
  if (value >= 1000) {
    return (value / 1000).toFixed(decimals) + 'K';
  }
  
  return value.toFixed(decimals);
}
