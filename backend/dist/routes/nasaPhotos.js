"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    var _a, _b, _c;
    try {
        const { q, page, media_type } = req.query;
        const nasaApiUrl = `https://images-api.nasa.gov/search?q=${q || 'apollo'}&media_type=image&page=${page || 1}&api_key=${config_1.config.nasaApiKey}`;
        console.log(`Fetching NASA photos for query: ${q}`);
        const response = await axios_1.default.get(nasaApiUrl, {
            timeout: 10000, // 10 second timeout
            headers: {
                'User-Agent': 'NASA-WebApp/1.0'
            }
        });
        // Check if the response has the expected structure
        if (!response.data || !response.data.collection || !response.data.collection.items) {
            console.error('Unexpected NASA API response structure:', response.data);
            return res.json({ photos: [], total_hits: 0 });
        }
        const items = response.data.collection.items;
        console.log(`Found ${items.length} items for query: ${q}`);
        // Process items to extract relevant photo data
        const photos = items.map((item) => {
            var _a, _b, _c;
            try {
                const data = item.data && item.data.length > 0 ? item.data[0] : {};
                const links = item.links && item.links.length > 0 ? item.links : [];
                const imageUrl = ((_a = links.find((link) => link.render === 'image' || link.rel === 'preview')) === null || _a === void 0 ? void 0 : _a.href) ||
                    ((_b = links.find((link) => link.rel === 'self' && link.href.endsWith('.jpg'))) === null || _b === void 0 ? void 0 : _b.href) ||
                    ((_c = links.find((link) => link.rel === 'self' && link.href.endsWith('.png'))) === null || _c === void 0 ? void 0 : _c.href);
                return {
                    nasa_id: data.nasa_id || 'unknown',
                    title: data.title || 'Untitled',
                    description: data.description || 'No description available',
                    date_created: data.date_created || '',
                    center: data.center || 'Unknown',
                    photographer: data.photographer || '',
                    keywords: data.keywords || [],
                    // Use the extracted image URL
                    thumbnail_url: imageUrl,
                    // AI-like insights (placeholder for now)
                    ai_insights: {
                        visual_analysis: 'Analyzing visual elements and composition...',
                        historical_context: 'Providing historical context...',
                        artistic_interpretation: 'Interpreting artistic elements...'
                    }
                };
            }
            catch (itemError) {
                console.error('Error processing item:', itemError);
                return null;
            }
        }).filter((photo) => photo && photo.thumbnail_url !== undefined);
        const totalHits = ((_a = response.data.collection.metadata) === null || _a === void 0 ? void 0 : _a.total_hits) || 0;
        console.log(`Returning ${photos.length} valid photos for query: ${q}`);
        res.json({ photos, total_hits: totalHits });
    }
    catch (error) {
        console.error('Error fetching NASA photos:', error.message);
        // Handle specific error cases
        if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 403) {
            console.error('NASA API rate limit or access denied. Using DEMO_KEY may have restrictions.');
            return res.json({ photos: [], total_hits: 0 });
        }
        if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 429) {
            console.error('NASA API rate limit exceeded. Please try again later.');
            return res.json({ photos: [], total_hits: 0 });
        }
        // Return empty results instead of 500 error
        res.json({ photos: [], total_hits: 0 });
    }
});
exports.default = router;
