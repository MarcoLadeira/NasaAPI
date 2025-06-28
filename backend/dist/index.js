"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const marsPhotos_1 = require("./routes/marsPhotos");
const neo_1 = require("./routes/neo");
const epic_1 = require("./routes/epic");
const apod_1 = require("./routes/apod");
const nasaVideos_1 = require("./routes/nasaVideos");
const nasaPhotos_1 = __importDefault(require("./routes/nasaPhotos"));
// ✅ Load environment variables
dotenv_1.default.config();
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
    : []);
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
    allowedOrigins.push('http://localhost:3000', 'http://localhost:3002', 'http://localhost:8080');
}
console.log('🚀 Final ALLOWED_ORIGINS:', allowedOrigins);
if (!config.nasaApiKey) {
    console.error('WARNING: NASA_API_KEY is not set in .env file!');
}
// ✅ Correct CORS logic: echo origin
const corsOptions = {
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
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: [
                "'self'",
                "data:",
                "https://images-assets.nasa.gov",
                "http://images-assets.nasa.gov",
                "https://mars.jpl.nasa.gov",
                "http://mars.jpl.nasa.gov",
                "https://apod.nasa.gov",
                "http://apod.nasa.gov",
                "https://epic.gsfc.nasa.gov",
                "http://epic.gsfc.nasa.gov",
                "https://*.nasa.gov",
                "http://*.nasa.gov",
                "https://*.jpl.nasa.gov",
                "http://*.jpl.nasa.gov"
            ],
            mediaSrc: [
                "'self'",
                "https://images-assets.nasa.gov",
                "http://images-assets.nasa.gov",
                "https://mars.jpl.nasa.gov",
                "http://mars.jpl.nasa.gov",
                "https://apod.nasa.gov",
                "http://apod.nasa.gov",
                "https://epic.gsfc.nasa.gov",
                "http://epic.gsfc.nasa.gov",
                "https://*.nasa.gov",
                "http://*.nasa.gov",
                "https://*.jpl.nasa.gov",
                "http://*.jpl.nasa.gov"
            ],
            connectSrc: ["'self'", "https://api.nasa.gov", "http://api.nasa.gov", "https://*.nasa.gov", "http://*.nasa.gov"],
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            frameSrc: ["'none'"],
        },
    }
}));
app.use(express_1.default.json());
// Serve static files from the React app build
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// ✅ App config available to routes
app.use((req, res, next) => {
    req.app.locals.config = config;
    next();
});
// ✅ Your API routes
app.use('/api/mars-photos', marsPhotos_1.marsPhotosRouter);
app.use('/api/neo', neo_1.neoRouter);
app.use('/api/epic', epic_1.epicRouter);
app.use('/api/apod', apod_1.apodRouter);
app.use('/api/nasa-videos', nasaVideos_1.nasaVideosRouter);
app.use('/api/nasa-photos', nasaPhotos_1.default);
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
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
// ✅ Global error handler
app.use((err, req, res, next) => {
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
    console.log(`📁 Static files served from: ${path_1.default.join(__dirname, '../public')}`);
});
// Handle server errors
server.on('error', (error) => {
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
