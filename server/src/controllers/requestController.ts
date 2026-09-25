import { Response } from 'express';
import { db } from '../services/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const senderId = req.userId!;
    const { receiverId, offeredSkillName, requiredSkillName, message } = req.body;

    if (!receiverId || !offeredSkillName || !requiredSkillName) {
      return res.status(400).json({ message: 'Receiver, offered skill, and required skill are required.' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'You cannot send a skill exchange request to yourself.' });
    }

    const receiver = db.users.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Recipient student not found.' });
    }

    const sender = db.users.findById(senderId)!;

    // Check existing active or pending request
    const existing = db.exchangeRequests
      .findBySenderId(senderId)
      .find((r) => r.receiverId === receiverId && r.status === 'PENDING');

    if (existing) {
      return res.status(400).json({ message: 'You already have a pending exchange request with this student.' });
    }

    const newRequest = db.exchangeRequests.create({
      senderId,
      receiverId,
      offeredSkillName,
      requiredSkillName,
      message: message || `Hi ${receiver.name}, I would love to exchange skills with you!`,
    });

    // Notify receiver
    db.notifications.create({
      userId: receiverId,
      message: `${sender.name} sent you a skill exchange request (${offeredSkillName} ↔ ${requiredSkillName}).`,
      type: 'REQUEST_RECEIVED',
      link: '/requests',
    });

    return res.status(201).json({
      message: 'Exchange request sent successfully!',
      request: newRequest,
    });
  } catch (err) {
    console.error('Error creating request:', err);
    return res.status(500).json({ message: 'Failed to send exchange request.' });
  }
};

export const getReceivedRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requests = db.exchangeRequests.findByReceiverId(req.userId!);
    const enriched = requests.map((r) => {
      const sender = db.getUserWithDetails(r.senderId);
      return {
        ...r,
        sender,
      };
    });

    // Most recent first
    enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.status(200).json({ requests: enriched });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch received requests.' });
  }
};

export const getSentRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requests = db.exchangeRequests.findBySenderId(req.userId!);
    const enriched = requests.map((r) => {
      const receiver = db.getUserWithDetails(r.receiverId);
      return {
        ...r,
        receiver,
      };
    });

    enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.status(200).json({ requests: enriched });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch sent requests.' });
  }
};

export const acceptRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = db.exchangeRequests.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    if (request.receiverId !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to accept this request.' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: `Request is already ${request.status.toLowerCase()}.` });
    }

    const updatedRequest = db.exchangeRequests.updateStatus(id, 'ACCEPTED');

    // Create an active Exchange
    const exchange = db.exchanges.create({
      requestId: id,
      senderId: request.senderId,
      receiverId: request.receiverId,
      offeredSkillName: request.offeredSkillName,
      requiredSkillName: request.requiredSkillName,
    });

    const receiver = db.users.findById(req.userId!)!;

    // Notify the sender
    db.notifications.create({
      userId: request.senderId,
      message: `${receiver.name} accepted your skill exchange request! You can now start learning.`,
      type: 'REQUEST_ACCEPTED',
      link: '/exchanges',
    });

    return res.status(200).json({
      message: 'Skill exchange request accepted!',
      request: updatedRequest,
      exchange,
    });
  } catch (err) {
    console.error('Error accepting request:', err);
    return res.status(500).json({ message: 'Failed to accept exchange request.' });
  }
};

export const rejectRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = db.exchangeRequests.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    if (request.receiverId !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to reject this request.' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: `Request is already ${request.status.toLowerCase()}.` });
    }

    const updatedRequest = db.exchangeRequests.updateStatus(id, 'REJECTED');
    const receiver = db.users.findById(req.userId!)!;

    // Notify sender
    db.notifications.create({
      userId: request.senderId,
      message: `${receiver.name} declined your skill exchange request.`,
      type: 'REQUEST_REJECTED',
      link: '/requests',
    });

    return res.status(200).json({
      message: 'Exchange request declined.',
      request: updatedRequest,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to reject request.' });
  }
};
