import { Router, Request, Response } from 'express';
import axios from 'axios';
import { config } from '../config';

const epicRouter = Router();

epicRouter.get('/', async (req: Request, res: Response) => {
  const { date } = req.query;
  const nasaApiKey = config.nasaApiKey;

  if (!nasaApiKey) {
    console.error('NASA_API_KEY is not defined in environment variables.');
    return res.status(500).json({ error: 'NASA API key not configured' });
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');

  let requestDate = date as string || `${year}-${month}-${day}`;

  try {
    const response = await axios.get(
      `https://api.nasa.gov/EPIC/api/natural/date/${requestDate}?api_key=${nasaApiKey}`
    );

    const epicData = response.data.map((item: any) => ({
      identifier: item.identifier,
      caption: item.caption,
      image: `https://api.nasa.gov/EPIC/archive/natural/${requestDate.replace(/-/g, '/')}/png/${item.image}.png?api_key=${nasaApiKey}`,
      date: item.date,
      coords: item.coords,
    }));

    res.json(epicData);
  } catch (error: any) {
    console.error('Error fetching EPIC data:', error.message);
    if (error.response) {
      console.error('NASA API response error:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data.msg || 'Error fetching EPIC data from NASA' });
    } else {
      res.status(500).json({ error: 'Failed to fetch EPIC data' });
    }
  }
});

export default epicRouter; 