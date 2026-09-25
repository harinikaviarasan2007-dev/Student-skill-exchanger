import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { calculateMatchesForUser } from '../services/matchingService';

export const getMatches = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const matches = calculateMatchesForUser(req.userId!);
    return res.status(200).json({ matches });
  } catch (err) {
    console.error('Error fetching matches:', err);
    return res.status(500).json({ message: 'Failed to calculate skill matches.' });
  }
};
