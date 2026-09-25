import { Response } from 'express';
import { db } from '../services/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = db.notifications.findByUserId(req.userId!);
    const unreadCount = list.filter((n) => !n.isRead).length;

    return res.status(200).json({
      notifications: list,
      unreadCount,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    db.notifications.markAsRead(id);
    return res.status(200).json({ message: 'Notification marked as read.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to mark notification.' });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    db.notifications.markAllAsRead(req.userId!);
    return res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to mark all as read.' });
  }
};
