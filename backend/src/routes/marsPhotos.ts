import { Router, Request, Response } from 'express';
import axios from 'axios';
import { config } from '../config';

const marsPhotosRouter = Router();

marsPhotosRouter.get('/', async (req: Request, res: Response) => {
  const { rover, sol, page = 1, limit = 12, camera } = req.query;
  const nasaApiKey = config.nasaApiKey;

  if (!nasaApiKey) {
    console.error('NASA_API_KEY is not defined.');
    return res.status(500).json({ error: 'NASA API key not configured' });
  }

  if (!rover || !sol) {
    return res.status(400).json({ error: 'Rover name and Sol are required' });
  }

  try {
    const params: any = {
      api_key: nasaApiKey,
      sol: sol,
      page: page,
      per_page: limit,
    };
    if (camera && camera !== 'all') {
      params.camera = camera;
    }

    const response = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`,
      { params }
    );

    const uniquePhotos = response.data.photos.reduce((acc: any[], current: any) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      }
      return acc;
    }, []);

    res.json({
      photos: uniquePhotos,
      total: response.data.photos.length, // Total photos before unique filter
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error: any) {
    console.error('Error fetching Mars photos:', error.message);
    if (error.response) {
      console.error('NASA API response error:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data.msg || 'Error fetching Mars photos from NASA' });
    } else {
      res.status(500).json({ error: 'Failed to fetch Mars photos' });
    }
  }
});

export default marsPhotosRouter; 