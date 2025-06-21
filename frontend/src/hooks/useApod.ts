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