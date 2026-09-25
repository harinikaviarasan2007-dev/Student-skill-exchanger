"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatches = void 0;
const matchingService_1 = require("../services/matchingService");
const getMatches = async (req, res) => {
    try {
        const matches = (0, matchingService_1.calculateMatchesForUser)(req.userId);
        return res.status(200).json({ matches });
    }
    catch (err) {
        console.error('Error fetching matches:', err);
        return res.status(500).json({ message: 'Failed to calculate skill matches.' });
    }
};
exports.getMatches = getMatches;
