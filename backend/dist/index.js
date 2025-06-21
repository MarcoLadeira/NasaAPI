"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const marsPhotos_1 = require("./routes/marsPhotos");
const neo_1 = require("./routes/neo");
const epic_1 = require("./routes/epic");
const apod_1 = require("./routes/apod");
const nasaVideos_1 = require("./routes/nasaVideos");
const nasaPhotos_1 = __importDefault(require("./routes/nasaPhotos"));
// Load environment variables
dotenv_1.default.config();
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
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express_1.default.json());
// Make config available to all routes
app.use((req, res, next) => {
    req.app.locals.config = config;
    next();
});
// Routes
app.use('/api/mars-photos', marsPhotos_1.marsPhotosRouter);
app.use('/api/neo', neo_1.neoRouter);
app.use('/api/epic', epic_1.epicRouter);
app.use('/api/apod', apod_1.apodRouter);
app.use('/api/nasa-videos', nasaVideos_1.nasaVideosRouter);
app.use('/api/nasa-photos', nasaPhotos_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        nasaApiKey: config.nasaApiKey ? 'configured' : 'not configured',
        environment: config.nodeEnv
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
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
