"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apodRouter = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const router = express_1.default.Router();
// Helper function to validate date
const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    // Set both dates to midnight UTC to compare only the dates
    const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    // Check if date is valid and not in the future
    return date instanceof Date &&
        !isNaN(date.getTime()) &&
        dateUTC <= todayUTC;
};
// Helper function to fetch APOD data
const fetchApodData = async (date) => {
    if (!config_1.config.nasaApiKey) {
        throw new Error('NASA API key is not configured');
    }
    const response = await axios_1.default.get('https://api.nasa.gov/planetary/apod', {
        params: {
            api_key: config_1.config.nasaApiKey,
            ...(date && { date })
        }
    });
    return response.data;
};
// Route for today's APOD
router.get('/', async (req, res) => {
    var _a, _b, _c;
    try {
        console.log('Fetching today\'s APOD data');
        const data = await fetchApodData();
        console.log('Successfully fetched APOD data');
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching APOD data:', error.message);
        if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
            console.error('NASA API response:', error.response.data);
        }
        res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({
            error: 'Failed to fetch APOD data',
            details: ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message
        });
    }
});
// Route for specific date APOD
router.get('/date/:date', async (req, res) => {
    var _a, _b, _c;
    try {
        const { date } = req.params;
        // Validate date
        if (!isValidDate(date)) {
            console.log(`Invalid date requested: ${date}`);
            return res.status(400).json({
                error: 'Invalid date',
                details: 'Date must be valid and cannot be in the future'
            });
        }
        console.log(`Fetching APOD data for date: ${date}`);
        const data = await fetchApodData(date);
        console.log('Successfully fetched APOD data');
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching APOD data:', error.message);
        if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
            console.error('NASA API response:', error.response.data);
        }
        res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({
            error: 'Failed to fetch APOD data',
            details: ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message
        });
    }
});
exports.apodRouter = router;
