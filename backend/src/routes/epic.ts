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

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    console.log(`Fetching EPIC data for date: ${date}`);

    const response = await axios.get(
      `https://api.nasa.gov/EPIC/api/natural/date/${date}`,
      {
        params: {
          api_key: config.nasaApiKey
        }
      }
    );

    console.log('Successfully fetched EPIC data');
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching EPIC data:', error.message);
    if (error.response?.data) {
      console.error('NASA API response:', error.response.data);
    }
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch EPIC data',
      details: error.response?.data || error.message
    });
  }
});

export const epicRouter = router; 