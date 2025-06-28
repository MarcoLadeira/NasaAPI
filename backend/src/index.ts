import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { config as appConfig } from './config';
import { marsPhotosRouter } from './routes/marsPhotos';
import { neoRouter } from './routes/neo';
import { epicRouter } from './routes/epic';
import { apodRouter } from './routes/apod';
import { nasaVideosRouter } from './routes/nasaVideos';
import nasaPhotosRouter from './routes/nasaPhotos';

// ✅ Load environment variables
dotenv.config();

const config = {
  nasaApiKey: process.env.NASA_API_KEY,
  port: Number(process.env.PORT) || 3002,
  nodeEnv: process.env.NODE_ENV || 'development'
};

console.log('Environment variables loaded:');
console.log('NASA_API_KEY:', config.nasaApiKey ? 'Configured' : 'Not configured');
console.log('PORT:', config.port);
console.log('NODE_ENV:', config.nodeEnv);
console.log('ALLOWED_ORIGINS from env:', process.env.ALLOWED_ORIGINS);

// ✅ Read allowed origins from env or fallback
const allowedOrigins = (process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000',
      'http://localhost:3002',
      'https://nasa-apiproject.vercel.app'
    ]
);
console.log('allowedOrigins array:', allowedOrigins);

if (!config.nasaApiKey) {
  console.error('WARNING: NASA_API_KEY is not set in .env file!');
}

// ✅ Correct CORS logic: echo origin
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    console.log('CORS request origin:', origin);
    if (!origin) {
      callback(null, true); // allow non-browser tools like Postman
    } else if (allowedOrigins.includes(origin)) {
      callback(null, origin); // ✅ echo origin back!
    } else {
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

const app = express();
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// ✅ App config available to routes
app.use((req, res, next) => {
  req.app.locals.config = config;
  next();
});

// ✅ Your API routes
app.use('/api/mars-photos', marsPhotosRouter);
app.use('/api/neo', neoRouter);
app.use('/api/epic', epicRouter);
app.use('/api/apod', apodRouter);
app.use('/api/nasa-videos', nasaVideosRouter);
app.use('/api/nasa-photos', nasaPhotosRouter);

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    nasaApiKey: config.nasaApiKey ? 'configured' : 'not configured',
    environment: config.nodeEnv
  });
});

// ✅ Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// ✅ Start server
app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${config.port}`);
  console.log(`NASA API Key: ${config.nasaApiKey ? 'configured' : 'not configured'}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
