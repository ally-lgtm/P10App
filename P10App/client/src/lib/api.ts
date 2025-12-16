/**
 * API Configuration
 * 
 * This file contains the base API configuration and exports the API base URL.
 * The actual API base URL is loaded from environment variables.
 */

// API base URL from environment variables with fallback to development server
const API_BASE = import.meta.env.VITE_API_BASE as string;

// Common headers used across all API requests
export const API_HEADERS = {
  'Content-Type': 'application/json',
  // Add any other common headers here
};

// You can also export API endpoints as constants for better maintainability
export const API_ENDPOINTS = {
  // Example endpoints - update these according to your API
  PICK: '/picks',
  USER: '/users',
  // Add more endpoints as needed
};

// Helper function to construct full API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove any leading slashes to prevent double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE.replace(/\/+$/, '')}/${cleanEndpoint}`;
};
