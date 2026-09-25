import { Request, Response } from 'express';
import { db } from '../services/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reviewerId = req.userId!;
    const { exchangeId, rating, feedback } = req.body;

    if (!exchangeId || rating === undefined || !feedback) {
      return res.status(400).json({ message: 'Exchange ID, rating (1-5), and feedback are required.' });
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
    }

    const exchange = db.exchanges.findById(exchangeId);
    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found.' });
    }

    if (exchange.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'You can only review an exchange that is marked as completed.' });
    }

    if (exchange.senderId !== reviewerId && exchange.receiverId !== reviewerId) {
      return res.status(403).json({ message: 'You are not a participant in this exchange.' });
    }

    const revieweeId = exchange.senderId === reviewerId ? exchange.receiverId : exchange.senderId;

    // Check duplicate review
    const existing = db.reviews.findByExchangeAndReviewer(exchangeId, reviewerId);
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a review for this exchange.' });
    }

    const review = db.reviews.create({
      exchangeId,
      reviewerId,
      revieweeId,
      rating: numRating,
      feedback: feedback.trim(),
    });

    const reviewer = db.users.findById(reviewerId)!;

    // Notify reviewee
    db.notifications.create({
      userId: revieweeId,
      message: `${reviewer.name} gave you a ${numRating}★ review: "${feedback.slice(0, 50)}..."`,
      type: 'REVIEW_RECEIVED',
      link: `/students/${revieweeId}`,
    });

    // Return updated reviewee details
    const updatedReviewee = db.getUserWithDetails(revieweeId);

    return res.status(201).json({
      message: 'Review submitted successfully!',
      review,
      reviewee: updatedReviewee,
    });
  } catch (err) {
    console.error('Error creating review:', err);
    return res.status(500).json({ message: 'Failed to submit review.' });
  }
};

export const getReviewsForUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = db.getUserWithDetails(id);
    if (!user) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    return res.status(200).json({
      reviews: user.reviewsReceived,
      averageRating: user.averageRating,
      reviewCount: user.reviewCount,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch reviews.' });
  }
};
