"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../services/db");
exports.JWT_SECRET = process.env.JWT_SECRET || 'skillswap-jwt-secret-key-2026';
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, exports.JWT_SECRET);
        const user = db_1.db.getUserWithDetails(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found. Please log in again.' });
        }
        req.userId = user.id;
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
    }
}
