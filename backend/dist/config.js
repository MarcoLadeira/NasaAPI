"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Get NASA API key from environment variable
const nasaApiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
// Log the API key status (but not the actual key)
console.log(`NASA API key is ${nasaApiKey === 'DEMO_KEY' ? 'using DEMO_KEY (limited access)' : 'configured'}`);
exports.config = {
    nasaApiKey,
    port: process.env.PORT || 3002,
    environment: process.env.NODE_ENV || 'development'
};
