import { Router, Request, Response } from 'express';
import axios from 'axios';
import { config } from '../config';

const apodRouter = Router();

// Helper function to validate date
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  return !isNaN(date.getTime()) && date <= today;
};

apodRouter.get('/', async (req: Request, res: Response) => {
  const { date } = req.query;
  const nasaApiKey = config.nasaApiKey;

  if (!nasaApiKey) {
    console.error('NASA_API_KEY is not defined in environment variables.');
    return res.status(500).json({ error: 'NASA API key not configured' });
  }

  let requestDate = date as string || new Date().toISOString().slice(0, 10);

  if (!isValidDate(requestDate)) {
    return res.status(400).json({ error: 'Invalid date. Date must be in YYYY-MM-DD format and not in the future.' });
  }

  try {
    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${requestDate}`
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching APOD data:', error.message);
    if (error.response) {
      console.error('NASA API response error:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data.msg || 'Error fetching APOD data from NASA' });
    } else {
      res.status(500).json({ error: 'Failed to fetch APOD data' });
    }
  }
});

export default apodRouter; 