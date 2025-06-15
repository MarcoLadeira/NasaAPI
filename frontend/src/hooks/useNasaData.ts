import { useQuery, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { nasaApi } from '../services/api';

export const useApod = (date?: string) => {
  return useQuery({
    queryKey: ['apod', date || 'today'],
    queryFn: () => date ? nasaApi.getApodByDate(date) : nasaApi.getApod(),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
  });
};

export const useApodRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['apod-range', startDate, endDate],
    queryFn: () => nasaApi.getApodRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useMarsPhotos = (rover: string, sol: number) => {
  return useQuery({
    queryKey: ['mars-photos', rover, sol],
    queryFn: () => nasaApi.getMarsPhotos(rover, sol),
    enabled: !!rover && sol >= 0,
  });
};

export const useNeoFeed = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['neo-feed', startDate, endDate],
    queryFn: () => nasaApi.getNeoFeed(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

export const useEpicImages = (date: string) => {
  return useQuery({
    queryKey: ['epic', date],
    queryFn: () => nasaApi.getEpicImages(date),
    enabled: !!date,
  });
};

export const useNasaVideos = (query: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['nasa-videos', query, page, limit],
    queryFn: () => nasaApi.getNasaVideos(query, page, limit),
    enabled: !!query,
  });
};

interface NasaPhoto {
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

interface NasaPhotosResponse {
  photos: NasaPhoto[];
  total_hits: number;
}

export const useNasaPhotos = (q: string) => {
  return useInfiniteQuery<NasaPhotosResponse, Error, InfiniteData<NasaPhotosResponse>, [string, string], number>({
    queryKey: ['nasa-photos', q],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await nasaApi.getNasaPhotos(q, pageParam);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.photos.length, 0);
      if (totalFetched < lastPage.total_hits) {
        return allPages.length + 1; // Next page number
      }
      return undefined;
    },
    enabled: !!q,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  });
}; 