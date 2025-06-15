import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get NASA API key from environment variable
const nasaApiKey = process.env.NASA_API_KEY || 'DEMO_KEY';

// Log the API key status (but not the actual key)
console.log(`NASA API key is ${nasaApiKey === 'DEMO_KEY' ? 'using DEMO_KEY (limited access)' : 'configured'}`);

export const config = {
  nasaApiKey,
  port: process.env.PORT || 3002,
  environment: process.env.NODE_ENV || 'development'
}; 