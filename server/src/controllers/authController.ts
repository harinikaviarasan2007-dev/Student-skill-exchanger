import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../services/db';
import { JWT_SECRET, AuthenticatedRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response) => {
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

    const existingUser = db.users.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const user = db.users.create({
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

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const userDetails = db.getUserWithDetails(user.id);

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: userDetails,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Failed to register account.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const user = db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const userDetails = db.getUserWithDetails(user.id);

    return res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: userDetails,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Failed to log in.' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'Logged out successfully.' });
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = db.getUserWithDetails(req.userId!);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
};
