import express from 'express';
import axios from 'axios';
import { config } from '../config';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!config.nasaApiKey) {
      console.error('NASA API key is not configured');
      return res.status(500).json({ error: 'NASA API key is not configured' });
    }

    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    console.log(`Fetching NEO data for dates: ${start_date} to ${end_date}`);

    const response = await axios.get(
      'https://api.nasa.gov/neo/rest/v1/feed',
      {
        params: {
          start_date,
          end_date,
          api_key: config.nasaApiKey
        }
      }
    );

    console.log('Successfully fetched NEO data');
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching NEO data:', error.message);
    if (error.response?.data) {
      console.error('NASA API response:', error.response.data);
    }
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch NEO data',
      details: error.response?.data || error.message
    });
  }
});

export const neoRouter = router; 