import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const nasaApi = {
  // APOD endpoints
  getApod: () => api.get('/apod'),
  getApodByDate: (date: string) => api.get(`/apod/date/${date}`),
  getApodRange: (startDate: string, endDate: string) => 
    api.get('/apod/range', { params: { start_date: startDate, end_date: endDate } }),

  // Mars Rover Photos endpoints
  getMarsPhotos: (rover: string, sol: number) => 
    api.get('/mars-photos', { params: { rover, sol } }),

  // NEO endpoints
  getNeoFeed: (startDate: string, endDate: string) => 
    api.get('/neo', { params: { start_date: startDate, end_date: endDate } }),

  // EPIC endpoints
  getEpicImages: (date: string) => api.get('/epic', { params: { date } }),

  // NASA Videos endpoints
  getNasaVideos: (query: string, page: number = 1, limit: number = 10) =>
    api.get('/nasa-videos', { params: { query, page, limit } }),

  // NASA Photos endpoints
  getNasaPhotos: (q: string, page: number = 1) =>
    api.get('/nasa-photos', { params: { q, page } }),
};

export default api; 