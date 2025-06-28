import { useQuery } from '@tanstack/react-query';
import { nasaApi } from '../services/api';
import { useState, useEffect } from 'react';

// Define a type for a single photo item from the NASA API response
interface NasaPhotoItem {
  nasa_id: string;
  title: string;
  thumbnail_url: string;
}

const useRandomNasaPhoto = (query: string) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [rotationInterval, setRotationInterval] = useState<NodeJS.Timeout | null>(null);

  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ['random-nasa-photo', query],
    queryFn: async () => {
      const { data } = await nasaApi.getNasaPhotos(query, 1);
      return data;
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Set up image rotation every 10 seconds
  useEffect(() => {
    if (rawData && rawData.photos && rawData.photos.length > 0) {
      // Clear any existing interval
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }

      // Set up new interval to rotate images every 10 seconds
      const interval = setInterval(() => {
        setCurrentPhotoIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % rawData.photos.length;
          return nextIndex;
        });
      }, 10000); // 10 seconds

      setRotationInterval(interval);

      // Cleanup on unmount or when data changes
      return () => {
        clearInterval(interval);
      };
    }
  }, [rawData]);

  // Get current photo
  const currentPhoto = rawData && rawData.photos && rawData.photos.length > 0 
    ? rawData.photos[currentPhotoIndex] 
    : null;

  return {
    data: currentPhoto,
    isLoading,
    error,
    currentIndex: currentPhotoIndex,
    totalPhotos: rawData?.photos?.length || 0
  };
};

export default useRandomNasaPhoto; 