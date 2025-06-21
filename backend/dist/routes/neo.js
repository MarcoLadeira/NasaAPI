"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.neoRouter = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    var _a, _b, _c;
    try {
        const { start_date, end_date } = req.query;
        if (!config_1.config.nasaApiKey) {
            console.error('NASA API key is not configured');
            return res.status(500).json({ error: 'NASA API key is not configured' });
        }
        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        console.log(`Fetching NEO data for dates: ${start_date} to ${end_date}`);
        const response = await axios_1.default.get('https://api.nasa.gov/neo/rest/v1/feed', {
            params: {
                start_date,
                end_date,
                api_key: config_1.config.nasaApiKey
            }
        });
        console.log('Successfully fetched NEO data');
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching NEO data:', error.message);
        if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
            console.error('NASA API response:', error.response.data);
        }
        res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({
            error: 'Failed to fetch NEO data',
            details: ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message
        });
    }
});
exports.neoRouter = router;
