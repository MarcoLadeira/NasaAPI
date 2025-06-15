import express from 'express';
import axios from 'axios';
import config from '../config';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rover, sol, page = 1, limit = 12, camera } = req.query;

    if (!config.nasaApiKey) {
      console.error('NASA API key is not configured');
      return res.status(500).json({ error: 'NASA API key is not configured' });
    }

    if (!rover || !sol) {
      return res.status(400).json({ error: 'Rover name and Martian sol are required.' });
    }

    const marsPhotosApiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&page=${page}&api_key=${config.nasaApiKey}`;
    
    let params: any = {};
    if (camera && camera !== 'all') {
      params.camera = camera;
    }
    
    const response = await axios.get(marsPhotosApiUrl, { params });

    const photos = response.data.photos || [];

    const uniquePhotos = photos.reduce((acc: any[], current: any) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      }
      return acc;
    }, []);

    res.json({
      photos: uniquePhotos,
      total: uniquePhotos.length,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
  } catch (error: any) {
    console.error('Error fetching Mars photos:', error.message);
    if (error.response?.data) {
      console.error('NASA API response:', error.response.data);
    }
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch Mars Rover photos',
      details: error.response?.data || error.message
    });
  }
});

export const marsPhotosRouter = router; 