// Currency conversion utilities
export interface CurrencyRates {
  usdToRub: number;
  cnyToUsd: number;
}

export interface PriceDisplay {
  cny: number;
  usd: number;
  rub: number;
}

// Default exchange rates (fallback values)
const DEFAULT_RATES: CurrencyRates = {
  usdToRub: 90, // Default USD to RUB rate
  cnyToUsd: 0.14 // Default CNY to USD rate (1 CNY = 0.14 USD)
};

// Cache for exchange rates
let cachedRates: CurrencyRates | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Fetch exchange rates from investing.com
export const fetchExchangeRates = async (): Promise<CurrencyRates> => {
  const now = Date.now();
  
  // Return cached rates if they're still fresh
  if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // In a real implementation, you would fetch from investing.com API
    // For now, using simulated current rates
    const rates: CurrencyRates = {
      usdToRub: 92.5, // Current USD/RUB rate
      cnyToUsd: 0.138 // Current CNY/USD rate
    };

    cachedRates = rates;
    lastFetch = now;
    
    return rates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using defaults:', error);
    return DEFAULT_RATES;
  }
};

// Convert CNY price to all three currencies
export const convertPrice = async (cnyPrice: number): Promise<PriceDisplay> => {
  const rates = await fetchExchangeRates();
  
  const usd = cnyPrice * rates.cnyToUsd;
  const rub = usd * rates.usdToRub * 1.5; // USD to RUB multiplied by 1.5 as requested
  
  return {
    cny: cnyPrice,
    usd: Math.round(usd * 100) / 100, // Round to 2 decimal places
    rub: Math.round(rub * 100) / 100
  };
};

// Format price display string
export const formatPriceDisplay = (prices: PriceDisplay): string => {
  return `¥${prices.cny} / $${prices.usd} / ₽${prices.rub}`;
};

// Parse price display string back to CNY value
export const parsePriceDisplay = (priceString: string): number => {
  // Extract CNY value from display string like "¥100 / $14 / ₽1380"
  const cnyMatch = priceString.match(/¥(\d+(?:\.\d+)?)/);
  return cnyMatch ? parseFloat(cnyMatch[1]) : 0;
};

// Format individual currency values
export const formatCurrency = (amount: number, currency: 'CNY' | 'USD' | 'RUB'): string => {
  switch (currency) {
    case 'CNY':
      return `¥${amount}`;
    case 'USD':
      return `$${amount}`;
    case 'RUB':
      return `₽${amount}`;
    default:
      return `${amount}`;
  }
};