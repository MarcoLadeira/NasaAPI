import express from 'express';
import axios from 'axios';

const router = express.Router();

interface NasaPhotoItem {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  center: string;
  photographer?: string;
  keywords?: string[];
  thumbnail_url: string;
  ai_insights: {
    visual_analysis: string;
    historical_context: string;
    artistic_interpretation: string;
  };
}

router.get('/', async (req, res) => {
  try {
    const { q, page } = req.query;
    const nasaApiUrl = `https://images-api.nasa.gov/search?q=${q || 'apollo'}&media_type=image&page=${page || 1}`;

    const response = await axios.get(nasaApiUrl);

    // Defensive check to prevent crashes if the API response structure is unexpected
    if (!response.data || !response.data.collection || !Array.isArray(response.data.collection.items)) {
      console.warn('Unexpected response structure from NASA Images API:', response.data);
      return res.json({ photos: [], total_hits: 0 });
    }
    
    const items = response.data.collection.items;
    const total_hits = response.data.collection.metadata?.total_hits || 0;

    // Process items to extract relevant photo data
    const photos = items.map((item: any) => {
      const data = item.data && item.data.length > 0 ? item.data[0] : {};
      const links = item.links && item.links.length > 0 ? item.links : [];

      const imageUrl = links.find((link: any) => link.render === 'image' || link.rel === 'preview')?.href || 
                       links.find((link: any) => link.rel === 'self' && link.href.endsWith('.jpg'))?.href || 
                       links.find((link: any) => link.rel === 'self' && link.href.endsWith('.png'))?.href;

      return {
        nasa_id: data.nasa_id,
        title: data.title,
        description: data.description,
        date_created: data.date_created,
        center: data.center,
        photographer: data.photographer,
        keywords: data.keywords,
        // Use the extracted image URL
        thumbnail_url: imageUrl, 
        // AI-like insights (placeholder for now)
        ai_insights: {
          visual_analysis: 'Analyzing visual elements and composition...',
          historical_context: 'Providing historical context...',
          artistic_interpretation: 'Interpreting artistic elements...'
        }
      };
    }).filter((photo: NasaPhotoItem) => photo.thumbnail_url !== undefined);

    res.json({ photos, total_hits });

  } catch (error: any) {
    // Log the actual error for better debugging
    console.error('Error fetching NASA photos:', error.message);
    res.status(500).json({ message: 'Error fetching NASA photos', error: error.message });
  }
});

export default router; 