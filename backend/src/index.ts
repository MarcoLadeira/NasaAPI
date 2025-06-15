import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { config as appConfig } from './config';
import { marsPhotosRouter } from './routes/marsPhotos';
import { neoRouter } from './routes/neo';
import { epicRouter } from './routes/epic';
import { apodRouter } from './routes/apod';

// Load environment variables
dotenv.config();

// Create a config object to share across the application
const config = {
  nasaApiKey: process.env.NASA_API_KEY,
  port: process.env.PORT || 3002,
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Debug: Check environment variables
console.log('Environment variables loaded:');
console.log('NASA_API_KEY:', config.nasaApiKey ? 'Configured' : 'Not configured');
console.log('PORT:', config.port);
console.log('NODE_ENV:', config.nodeEnv);

if (!config.nasaApiKey) {
  console.error('WARNING: NASA_API_KEY is not set in .env file!');
}

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// Make config available to all routes
app.use((req, res, next) => {
  req.app.locals.config = config;
  next();
});

// Routes
app.use('/api/mars-photos', marsPhotosRouter);
app.use('/api/neo', neoRouter);
app.use('/api/epic', epicRouter);
app.use('/api/apod', apodRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    nasaApiKey: config.nasaApiKey ? 'configured' : 'not configured',
    environment: config.nodeEnv
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`NASA API Key: ${config.nasaApiKey ? 'configured' : 'not configured'}`);
  console.log(`Environment: ${config.nodeEnv}`);
}); 