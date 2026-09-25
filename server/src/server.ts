import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import skillRoutes from './routes/skillRoutes';
import matchRoutes from './routes/matchRoutes';
import requestRoutes from './routes/requestRoutes';
import exchangeRoutes from './routes/exchangeRoutes';
import reviewRoutes from './routes/reviewRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { seedDatabase } from './seed';
import { db } from './services/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'SkillSwap API is running', timestamp: new Date().toISOString() });
});

// Auto-seed if database has no users
const existingUsers = db.users.list();
if (existingUsers.length === 0) {
  console.log('No users found in database. Initializing sample demo data...');
  seedDatabase();
}

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 SkillSwap Server is running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
