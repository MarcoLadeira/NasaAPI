import { useQuery } from '@tanstack/react-query';
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