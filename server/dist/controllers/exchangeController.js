"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeExchange = exports.getExchanges = void 0;
const db_1 = require("../services/db");
const getExchanges = async (req, res) => {
    try {
        const userId = req.userId;
        const exchanges = db_1.db.exchanges.findByUserId(userId);
        const enriched = exchanges.map((ex) => {
            const isSender = ex.senderId === userId;
            const partnerId = isSender ? ex.receiverId : ex.senderId;
            const partner = db_1.db.getUserWithDetails(partnerId);
            // Check if current user has already reviewed this exchange
            const myReview = db_1.db.reviews.findByExchangeAndReviewer(ex.id, userId);
            // What current user teaches vs learns
            const userTeaches = isSender ? ex.offeredSkillName : ex.requiredSkillName;
            const userLearns = isSender ? ex.requiredSkillName : ex.offeredSkillName;
            return {
                ...ex,
                partner,
                userTeaches,
                userLearns,
                hasReviewed: !!myReview,
                myReview,
            };
        });
        enriched.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
        return res.status(200).json({ exchanges: enriched });
    }
    catch (err) {
        console.error('Error fetching exchanges:', err);
        return res.status(500).json({ message: 'Failed to fetch exchanges.' });
    }
};
exports.getExchanges = getExchanges;
const completeExchange = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const exchange = db_1.db.exchanges.findById(id);
        if (!exchange) {
            return res.status(404).json({ message: 'Exchange not found.' });
        }
        if (exchange.senderId !== userId && exchange.receiverId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this exchange.' });
        }
        if (exchange.status === 'COMPLETED') {
            return res.status(400).json({ message: 'Exchange is already completed.' });
        }
        const completed = db_1.db.exchanges.complete(id);
        const partnerId = exchange.senderId === userId ? exchange.receiverId : exchange.senderId;
        const currentUser = db_1.db.users.findById(userId);
        // Notify partner
        db_1.db.notifications.create({
            userId: partnerId,
            message: `${currentUser.name} marked your skill exchange as completed! Please share your rating and review.`,
            type: 'EXCHANGE_COMPLETED',
            link: '/exchanges',
        });
        return res.status(200).json({
            message: 'Exchange marked as completed!',
            exchange: completed,
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to complete exchange.' });
    }
};
exports.completeExchange = completeExchange;
