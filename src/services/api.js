// Simulated delay helper
export const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate custom uuid-like string for entries
export const generateId = (prefix = 'id') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// Base API error standardizer
export const handleApiError = (error) => {
  console.error('API Error:', error);
  throw new Error(error.message || 'An unexpected error occurred in the mock database service.');
};
