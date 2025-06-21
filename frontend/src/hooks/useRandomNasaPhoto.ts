import { useQuery } from '@tanstack/react-query';
import { nasaApi } from '../services/api';

// Define a type for a single photo item from the NASA API response
interface NasaPhotoItem {
  links: { href: string }[];
  data: { title: string }[];
}

const useRandomNasaPhoto = (query: string) => {
  return useQuery({
    queryKey: ['random-nasa-photo', query],
    queryFn: async () => {
      const { data } = await nasaApi.getNasaPhotos(query, 1);
      return data;
    },
    select: (data) => {
      if (data && data.photos && data.photos.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.photos.length);
        return data.photos[randomIndex];
      }
      return null;
    },
    enabled: !!query,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export default useRandomNasaPhoto; 