import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
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
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'development'
};

console.log('Environment variables loaded:');
console.log('NASA_API_KEY:', config.nasaApiKey ? 'Configured' : 'Not configured');
console.log('PORT:', config.port);
console.log('NODE_ENV:', config.nodeEnv);
console.log('process.env.ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);

// ✅ Read allowed origins from env or fallback
const allowedOrigins = (process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : []
);
console.log('allowedOrigins array:', allowedOrigins);

// ✅ Make ALLOWED_ORIGINS mandatory for production
if (config.nodeEnv === 'production' && allowedOrigins.length === 0) {
  console.warn('⚠️ ALLOWED_ORIGINS is missing in production, using fallback');
  allowedOrigins.push('http://localhost:8080', 'http://localhost:3000');
  // Don't exit, just use fallback
  // process.exit(1);
}

// ✅ Add fallback for development only
if (config.nodeEnv === 'development' && allowedOrigins.length === 0) {
  console.log('⚠️ No ALLOWED_ORIGINS set, using development fallback');
  allowedOrigins.push(
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:8080'
  );
}

console.log('🚀 Final ALLOWED_ORIGINS:', allowedOrigins);

if (!config.nasaApiKey) {
  console.error('WARNING: NASA_API_KEY is not set in .env file!');
}

// ✅ Correct CORS logic: echo origin
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    console.log('🌐 CORS request origin:', origin);
    console.log('📋 Allowed origins:', allowedOrigins);
    
    // For unified deployment (frontend + backend on same domain), allow all origins
    console.log(`✅ Allowing all origins for unified deployment: ${origin}`);
    return callback(null, true);
    
    // ORIGINAL LOGIC (commented out for unified deployment):
    /*
    if (!origin) {
      console.log('✅ Allowing request with no origin (server-to-server)');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Allowed: ${origin}`);
      return callback(null, origin);
    }
    
    console.warn(`❌ Blocked: ${origin}`);
    console.warn(`❌ Not in allowed origins: [${allowedOrigins.join(', ')}]`);
    return callback(new Error(`CORS policy does not allow origin ${origin}`));
    */
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, '../public')));

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

// ✅ Fallback route for React Router - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
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
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${config.port}`);
  console.log(`🔑 NASA API Key: ${config.nasaApiKey ? 'configured' : 'not configured'}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`✅ CORS Origins: ${allowedOrigins.join(', ')}`);
  console.log(`🏥 Health check available at: http://0.0.0.0:${config.port}/health`);
  console.log(`📁 Static files served from: ${path.join(__dirname, '../public')}`);
});

// Handle server errors
server.on('error', (error: any) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error('❌ Port is already in use');
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
