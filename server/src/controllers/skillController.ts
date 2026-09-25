import { Request, Response } from 'express';
import { db } from '../services/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getAllSkills = async (_req: Request, res: Response) => {
  try {
    const skills = db.skills.list();
    return res.status(200).json({ skills });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch skills.' });
  }
};

export const addOfferedSkill = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, category } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Skill name is required.' });
    }

    const skill = db.skills.findOrCreate(name.trim(), category || 'General');
    db.userOfferedSkills.add(req.userId!, skill.id);

    const userDetails = db.getUserWithDetails(req.userId!);
    return res.status(200).json({
      message: 'Offered skill added successfully.',
      offeredSkills: userDetails?.offeredSkills,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to add offered skill.' });
  }
};

export const removeOfferedSkill = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { skillId } = req.params;
    db.userOfferedSkills.remove(req.userId!, skillId);

    const userDetails = db.getUserWithDetails(req.userId!);
    return res.status(200).json({
      message: 'Offered skill removed.',
      offeredSkills: userDetails?.offeredSkills,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove offered skill.' });
  }
};

export const addRequiredSkill = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, category } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Skill name is required.' });
    }

    const skill = db.skills.findOrCreate(name.trim(), category || 'General');
    db.userRequiredSkills.add(req.userId!, skill.id);

    const userDetails = db.getUserWithDetails(req.userId!);
    return res.status(200).json({
      message: 'Required skill added successfully.',
      requiredSkills: userDetails?.requiredSkills,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to add required skill.' });
  }
};

export const removeRequiredSkill = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { skillId } = req.params;
    db.userRequiredSkills.remove(req.userId!, skillId);

    const userDetails = db.getUserWithDetails(req.userId!);
    return res.status(200).json({
      message: 'Required skill removed.',
      requiredSkills: userDetails?.requiredSkills,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove required skill.' });
  }
};

export const updateAllUserSkills = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { offeredSkillNames, requiredSkillNames } = req.body;

    if (Array.isArray(offeredSkillNames)) {
      db.userOfferedSkills.setForUser(req.userId!, offeredSkillNames);
    }

    if (Array.isArray(requiredSkillNames)) {
      db.userRequiredSkills.setForUser(req.userId!, requiredSkillNames);
    }

    const userDetails = db.getUserWithDetails(req.userId!);
    return res.status(200).json({
      message: 'Skills updated successfully!',
      user: userDetails,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update skills.' });
  }
};
