import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import config from './config';

// Import routes
import { apodRouter } from './routes/apod';
import { marsPhotosRouter } from './routes/marsPhotos';
import { neoRouter } from './routes/neo';
import { epicRouter } from './routes/epic';

// Load environment variables
dotenv.config();

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON Body Parser
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is healthy',
    apiVersion: '1.0',
    nodeEnv: config.environment,
    port: config.port,
    nasaApiKeyConfigured: config.nasaApiKey !== 'DEMO_KEY',
  });
});

// API Routes
app.use('/api/apod', apodRouter);
app.use('/api/mars-photos', marsPhotosRouter);
app.use('/api/neo', neoRouter);
app.use('/api/epic', epicRouter);

// Global Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.environment} mode`);
  console.log(`NASA API key is ${config.nasaApiKey === 'DEMO_KEY' ? 'using DEMO_KEY (limited access)' : 'configured'}`);
}); 