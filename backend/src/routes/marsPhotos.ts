import express from 'express';
import axios from 'axios';
import { config } from '../config';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rover, sol, page = 1, limit = 12 } = req.query;

    if (!config.nasaApiKey) {
      console.error('NASA API key is not configured');
      return res.status(500).json({ error: 'NASA API key is not configured' });
    }

    if (!rover || !sol) {
      return res.status(400).json({ error: 'Rover and sol parameters are required' });
    }

    console.log(`Fetching Mars photos for rover: ${rover}, sol: ${sol}, page: ${page}, limit: ${limit}`);

    const response = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`,
      {
        params: {
          sol,
          api_key: config.nasaApiKey,
          page,
          per_page: limit
        }
      }
    );

    const photos = response.data.photos || [];
    const totalPhotos = response.data.total_photos || 0;

    // Remove duplicate photos based on ID
    const uniquePhotos = photos.reduce((acc: any[], photo: any) => {
      if (!acc.find((p: any) => p.id === photo.id)) {
        acc.push(photo);
      }
      return acc;
    }, []);

    console.log(`Found ${uniquePhotos.length} unique photos out of ${photos.length} total photos`);

    res.json({
      photos: uniquePhotos,
      total: totalPhotos,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error: any) {
    console.error('Error fetching Mars photos:', error.message);
    if (error.response?.data) {
      console.error('NASA API response:', error.response.data);
    }
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch Mars photos',
      details: error.response?.data || error.message
    });
  }
});

export const marsPhotosRouter = router; 