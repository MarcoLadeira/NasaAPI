import express from 'express';
import axios from 'axios';
import config from '../config';

const router = express.Router();

const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  
  const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  return date instanceof Date && 
         !isNaN(date.getTime()) && 
         dateUTC <= todayUTC;
};

const fetchApodData = async (date?: string) => {
  if (!config.nasaApiKey) {
    throw new Error('NASA API key is not configured');
  }

  const response = await axios.get(
    'https://api.nasa.gov/planetary/apod',
    {
      params: {
        api_key: config.nasaApiKey,
        ...(date && { date })
      }
    }
  );

  return response.data;
};

router.get('/', async (req, res) => {
  try {
    const data = await fetchApodData();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching APOD data:', error.message);
    if (error.response?.data) {
      console.error('NASA API response:', error.response.data);
    }
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch APOD data',
      details: error.response?.data || error.message
    });
  }
});

router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;

    if (!isValidDate(date)) {
      console.log(`Invalid date requested: ${date}`);
      return res.status(400).json({
        error: 'Invalid date',
        details: 'Date must be valid and cannot be in the future'
      });
    }

    const data = await fetchApodData(date);
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching APOD data:', error.message);
    if (error.response?.data) {
      console.error('NASA API response:', error.response.data);
    }
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch APOD data',
      details: error.response?.data || error.message
    });
  }
});

export const apodRouter = router; 