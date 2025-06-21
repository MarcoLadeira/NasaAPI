"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marsPhotosRouter = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    var _a, _b, _c;
    try {
        const { rover, sol, page = 1, limit = 12 } = req.query;
        if (!config_1.config.nasaApiKey) {
            console.error('NASA API key is not configured');
            return res.status(500).json({ error: 'NASA API key is not configured' });
        }
        if (!rover || !sol) {
            return res.status(400).json({ error: 'Rover and sol parameters are required' });
        }
        console.log(`Fetching Mars photos for rover: ${rover}, sol: ${sol}, page: ${page}, limit: ${limit}`);
        const response = await axios_1.default.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`, {
            params: {
                sol,
                api_key: config_1.config.nasaApiKey,
                page,
                per_page: limit
            }
        });
        const photos = response.data.photos || [];
        const totalPhotos = response.data.total_photos || 0;
        // Remove duplicate photos based on ID
        const uniquePhotos = photos.reduce((acc, photo) => {
            if (!acc.find((p) => p.id === photo.id)) {
                acc.push(photo);
            }
            return acc;
        }, []);
        console.log(`Found ${uniquePhotos.length} unique photos out of ${photos.length} total photos`);
        res.json({
            photos: uniquePhotos,
            total: totalPhotos,
            page: Number(page),
            limit: Number(limit)
        });
    }
    catch (error) {
        console.error('Error fetching Mars photos:', error.message);
        if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
            console.error('NASA API response:', error.response.data);
        }
        res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({
            error: 'Failed to fetch Mars photos',
            details: ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message
        });
    }
});
exports.marsPhotosRouter = router;
