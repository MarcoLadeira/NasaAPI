import { Router, Request, Response } from 'express';
import axios from 'axios';
import { config } from '../config';

const neoRouter = Router();

neoRouter.get('/', async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query;
  const nasaApiKey = config.nasaApiKey;

  if (!nasaApiKey) {
    console.error('NASA_API_KEY is not defined.');
    return res.status(500).json({ error: 'NASA API key not configured' });
  }

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date and end_date are required' });
  }

  try {
    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${nasaApiKey}`
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching NEO data:', error.message);
    if (error.response) {
      console.error('NASA API response error:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data.msg || 'Error fetching NEO data from NASA' });
    } else {
      res.status(500).json({ error: 'Failed to fetch NEO data' });
    }
  }
});

export default neoRouter; 