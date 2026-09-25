"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const db_1 = require("../services/db");
const getNotifications = async (req, res) => {
    try {
        const list = db_1.db.notifications.findByUserId(req.userId);
        const unreadCount = list.filter((n) => !n.isRead).length;
        return res.status(200).json({
            notifications: list,
            unreadCount,
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to fetch notifications.' });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        db_1.db.notifications.markAsRead(id);
        return res.status(200).json({ message: 'Notification marked as read.' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to mark notification.' });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        db_1.db.notifications.markAllAsRead(req.userId);
        return res.status(200).json({ message: 'All notifications marked as read.' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to mark all as read.' });
    }
};
exports.markAllAsRead = markAllAsRead;
