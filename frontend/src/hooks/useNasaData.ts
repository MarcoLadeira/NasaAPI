import { useQuery } from '@tanstack/react-query';
import { nasaApi } from '../services/api';

export const useApod = (date?: string) => {
  return useQuery({
    queryKey: ['apod', date],
    queryFn: () => date ? nasaApi.getApodByDate(date) : nasaApi.getApod(),
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