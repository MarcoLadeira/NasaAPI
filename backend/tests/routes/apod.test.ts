import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import { apodRouter } from '../src/routes/apod';
import axios from 'axios';

// Mock axios to prevent actual API calls during tests
jest.mock('axios');

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.app.locals.config = {
    nasaApiKey: 'test-api-key',
    port: process.env.PORT || 3002,
    nodeEnv: 'test'
  };
  next();
});
app.use('/api/apod', apodRouter);

describe('APOD API Route', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return APOD data for a valid request', async () => {
    const mockApodData = {
      date: '2023-01-01',
      explanation: 'Test explanation.',
      media_type: 'image',
      title: 'Test APOD',
      url: 'http://example.com/test.jpg',
      hdurl: 'http://example.com/test_hd.jpg',
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockApodData
    });

    const res = await request(app).get('/api/apod');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockApodData);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('api.nasa.gov/planetary/apod'),
      expect.objectContaining({
        params: expect.objectContaining({
          api_key: 'test-api-key',
        }),
      })
    );
  });

  it('should return 400 if date parameter is invalid', async () => {
    const res = await request(app).get('/api/apod?date=invalid-date');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Invalid date format. Please use YYYY-MM-DD.');
  });

  it('should return 500 if NASA API call fails', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('NASA API error'));

    const res = await request(app).get('/api/apod');

    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe('Failed to fetch APOD data');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('should pass through date parameter to NASA API', async () => {
    const mockApodData = {
      date: '2023-03-15',
      explanation: 'Test explanation for specific date.',
      media_type: 'image',
      title: 'Test APOD for 2023-03-15',
      url: 'http://example.com/test_2023-03-15.jpg',
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockApodData
    });

    const testDate = '2023-03-15';
    const res = await request(app).get(`/api/apod?date=${testDate}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.date).toEqual(testDate);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(`date=${testDate}`),
      expect.any(Object)
    );
  });
}); 