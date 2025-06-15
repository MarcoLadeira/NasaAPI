import express from 'express';
import axios from 'axios';
import { config } from '../config';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { date } = req.query;

    if (!config.nasaApiKey) {
      console.error('NASA API key is not configured');
      return res.status(500).json({ error: 'NASA API key is not configured' });
    }

    console.log(`Fetching APOD data${date ? ` for date: ${date}` : ' for today'}`);

    const response = await axios.get(
      'https://api.nasa.gov/planetary/apod',
      {
        params: {
          api_key: config.nasaApiKey,
          ...(date && { date })
        }
      }
    );

    console.log('Successfully fetched APOD data');
    res.json(response.data);
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