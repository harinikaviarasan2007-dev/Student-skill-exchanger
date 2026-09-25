"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const skillRoutes_1 = __importDefault(require("./routes/skillRoutes"));
const matchRoutes_1 = __importDefault(require("./routes/matchRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const exchangeRoutes_1 = __importDefault(require("./routes/exchangeRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const seed_1 = require("./seed");
const db_1 = require("./services/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/skills', skillRoutes_1.default);
app.use('/api/matches', matchRoutes_1.default);
app.use('/api/requests', requestRoutes_1.default);
app.use('/api/exchanges', exchangeRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'SkillSwap API is running', timestamp: new Date().toISOString() });
});
// Auto-seed if database has no users
const existingUsers = db_1.db.users.list();
if (existingUsers.length === 0) {
    console.log('No users found in database. Initializing sample demo data...');
    (0, seed_1.seedDatabase)();
}
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 SkillSwap Server is running on port ${PORT}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api`);
    console.log(`===============================================`);
});
