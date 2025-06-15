import express from 'express';
import axios from 'axios';
import { config } from '../config';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { query = '', page = 1, limit = 10 } = req.query;

    if (!config.nasaApiKey) {
      console.error('NASA API key is not configured');
      return res.status(500).json({ error: 'NASA API key is not configured' });
    }

    console.log(`Fetching NASA videos for query: ${query}, page: ${page}, limit: ${limit}`);

    // If no query is provided, fetch featured videos
    const searchQuery = query || 'space exploration';

    const response = await axios.get(
      'https://images-api.nasa.gov/search',
      {
        params: {
          q: searchQuery,
          media_type: 'video',
          page,
          page_size: limit
        }
      }
    );

    const videos = response.data.collection.items || [];
    const totalVideos = response.data.collection.metadata.total_hits || 0;

    // Process and enhance video data
    const processedVideos = await Promise.all(videos.map(async (video: any) => {
      // The href from the main video item is the link to its asset manifest (a JSON file)
      const assetJsonUrl = video.href;
      let directVideoUrl = '';

      if (assetJsonUrl) {
        try {
          const manifestResponse = await axios.get(assetJsonUrl);
          const files = manifestResponse.data;
          
          // Look for the MP4 file, prioritize higher quality if available
          const mp4File = files.find((file: string) => file.endsWith('.mp4') && !file.includes('~thumb'));
          if (mp4File) {
            directVideoUrl = mp4File;
          } else {
            // Fallback to any other playable format if MP4 is not directly found
            const otherPlayable = files.find((file: string) => file.endsWith('.mov') || file.endsWith('.webm'));
            if (otherPlayable) {
                directVideoUrl = otherPlayable;
            }
          }
        } catch (manifestError: any) {
          console.error('Error fetching video manifest for', video.data[0].nasa_id, ':', manifestError.message);
          // In case of error, fallback to thumbnail or a placeholder
          directVideoUrl = '/placeholder-video.jpg'; 
        }
      }

      return {
        id: video.data[0].nasa_id,
        title: video.data[0].title,
        description: video.data[0].description || 'No description available',
        date_created: video.data[0].date_created,
        keywords: video.data[0].keywords || [],
        thumbnail: video.links?.find((link: any) => link.render === 'image')?.href || '/placeholder-video.jpg',
        videoUrl: directVideoUrl,
        duration: video.data[0].duration || 'Unknown',
        center: video.data[0].center || 'NASA',
        photographer: video.data[0].photographer || 'NASA',
        location: video.data[0].location || 'Space'
      };
    }));

    if (processedVideos.length > 0) {
      console.log('Sample video URL being sent to frontend:', processedVideos[0].videoUrl);
    }

    res.json({
      videos: processedVideos,
      total: totalVideos,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error: any) {
    console.error('Error fetching NASA videos:', error.message);
    if (error.response?.data) {
      console.error('NASA API response:', error.response.data);
    }
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch NASA videos',
      details: error.response?.data || error.message
    });
  }
});

export const nasaVideosRouter = router; 