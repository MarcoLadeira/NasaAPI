import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import apodRouter from './routes/apod';
import marsPhotosRouter from './routes/marsPhotos';
import neoRouter from './routes/neo';
import epicRouter from './routes/epic';
import { config as appConfig } from './config';

// Load environment variables
dotenv.config();

// Debug: Check environment variables
console.log('Environment variables loaded:');
console.log('NASA_API_KEY:', appConfig.nasaApiKey ? 'Configured' : 'Not configured');
console.log('PORT:', appConfig.port);
console.log('NODE_ENV:', appConfig.environment);

if (!appConfig.nasaApiKey) {
  console.error('WARNING: NASA_API_KEY is not set in .env file!');
}

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// Make config available to all routes
app.use((req, res, next) => {
  req.app.locals.config = appConfig;
  next();
});

// Routes
app.use('/api/apod', apodRouter);
app.use('/api/mars-photos', marsPhotosRouter);
app.use('/api/neo', neoRouter);
app.use('/api/epic', epicRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    nasaApiKeyConfigured: !!appConfig.nasaApiKey,
    environment: appConfig.environment,
    port: appConfig.port,
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
  if (!appConfig.nasaApiKey) {
    console.warn('WARNING: NASA API key is not configured. Some API features may not work.');
  }
}); 