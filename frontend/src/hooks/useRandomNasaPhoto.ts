import { useQuery } from '@tanstack/react-query';
import { nasaApi } from '../services/api';
import { useMemo } from 'react';

// Define a type for a single photo item from the NASA API response
interface NasaPhotoItem {
  links: { href: string }[];
  data: { title: string }[];
}

const useRandomNasaPhoto = (query: string) => {
  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ['random-nasa-photo', query],
    queryFn: async () => {
      const { data } = await nasaApi.getNasaPhotos(query, 1);
      return data;
    },
    enabled: !!query,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Use useMemo to ensure the random selection happens only once when data changes
  const randomPhoto = useMemo(() => {
    if (rawData && rawData.photos && rawData.photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * rawData.photos.length);
      return rawData.photos[randomIndex];
    }
    return null;
  }, [rawData]);

  return {
    data: randomPhoto,
    isLoading,
    error
  };
};

export default useRandomNasaPhoto; 