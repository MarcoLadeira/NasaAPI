"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    var _a;
    try {
        const { q, page } = req.query;
        const nasaApiUrl = `https://images-api.nasa.gov/search?q=${q || 'apollo'}&media_type=image&page=${page || 1}`;
        const response = await axios_1.default.get(nasaApiUrl);
        // Defensive check to prevent crashes if the API response structure is unexpected
        if (!response.data || !response.data.collection || !Array.isArray(response.data.collection.items)) {
            console.warn('Unexpected response structure from NASA Images API:', response.data);
            return res.json({ photos: [], total_hits: 0 });
        }
        const items = response.data.collection.items;
        const total_hits = ((_a = response.data.collection.metadata) === null || _a === void 0 ? void 0 : _a.total_hits) || 0;
        // Process items to extract relevant photo data
        const photos = items.map((item) => {
            var _a, _b, _c;
            const data = item.data && item.data.length > 0 ? item.data[0] : {};
            const links = item.links && item.links.length > 0 ? item.links : [];
            const imageUrl = ((_a = links.find((link) => link.render === 'image' || link.rel === 'preview')) === null || _a === void 0 ? void 0 : _a.href) ||
                ((_b = links.find((link) => link.rel === 'self' && link.href.endsWith('.jpg'))) === null || _b === void 0 ? void 0 : _b.href) ||
                ((_c = links.find((link) => link.rel === 'self' && link.href.endsWith('.png'))) === null || _c === void 0 ? void 0 : _c.href);
            return {
                nasa_id: data.nasa_id,
                title: data.title,
                description: data.description,
                date_created: data.date_created,
                center: data.center,
                photographer: data.photographer,
                keywords: data.keywords,
                // Use the extracted image URL
                thumbnail_url: imageUrl,
                // AI-like insights (placeholder for now)
                ai_insights: {
                    visual_analysis: 'Analyzing visual elements and composition...',
                    historical_context: 'Providing historical context...',
                    artistic_interpretation: 'Interpreting artistic elements...'
                }
            };
        }).filter((photo) => photo.thumbnail_url !== undefined);
        res.json({ photos, total_hits });
    }
    catch (error) {
        // Log the actual error for better debugging
        console.error('Error fetching NASA photos:', error.message);
        res.status(500).json({ message: 'Error fetching NASA photos', error: error.message });
    }
});
exports.default = router;
