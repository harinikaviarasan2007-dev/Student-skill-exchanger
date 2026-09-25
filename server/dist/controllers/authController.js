"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../services/db");
const authMiddleware_1 = require("../middleware/authMiddleware");
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, college, department, year, bio, availability, learningMode } = req.body;
        // Validation
        if (!name || !email || !password || !college || !department || !year) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }
        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }
        const existingUser = db_1.db.users.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }
        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
        const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
        const user = db_1.db.users.create({
            name,
            email,
            passwordHash,
            college,
            department,
            year,
            bio: bio || `Hello! I am a ${year} student studying ${department} at ${college}. Excited to swap skills!`,
            avatar: defaultAvatar,
            availability: availability || 'Flexible',
            learningMode: learningMode || 'Hybrid',
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, authMiddleware_1.JWT_SECRET, { expiresIn: '7d' });
        const userDetails = db_1.db.getUserWithDetails(user.id);
        return res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: userDetails,
        });
    }
    catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: 'Failed to register account.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password.' });
        }
        const user = db_1.db.users.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const isMatch = bcryptjs_1.default.compareSync(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, authMiddleware_1.JWT_SECRET, { expiresIn: '7d' });
        const userDetails = db_1.db.getUserWithDetails(user.id);
        return res.status(200).json({
            message: 'Logged in successfully!',
            token,
            user: userDetails,
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Failed to log in.' });
    }
};
exports.login = login;
const logout = async (_req, res) => {
    return res.status(200).json({ message: 'Logged out successfully.' });
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const user = db_1.db.getUserWithDetails(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({ user });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to fetch user profile.' });
    }
};
exports.getMe = getMe;
