"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.epicRouter = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    var _a, _b, _c;
    try {
        const { date } = req.query;
        if (!config_1.config.nasaApiKey) {
            console.error('NASA API key is not configured');
            return res.status(500).json({ error: 'NASA API key is not configured' });
        }
        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }
        console.log(`Fetching EPIC data for date: ${date}`);
        const response = await axios_1.default.get(`https://api.nasa.gov/EPIC/api/natural/date/${date}`, {
            params: {
                api_key: config_1.config.nasaApiKey
            }
        });
        console.log('Successfully fetched EPIC data');
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching EPIC data:', error.message);
        if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
            console.error('NASA API response:', error.response.data);
        }
        res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({
            error: 'Failed to fetch EPIC data',
            details: ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message
        });
    }
});
exports.epicRouter = router;
