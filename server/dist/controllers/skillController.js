"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllUserSkills = exports.removeRequiredSkill = exports.addRequiredSkill = exports.removeOfferedSkill = exports.addOfferedSkill = exports.getAllSkills = void 0;
const db_1 = require("../services/db");
const getAllSkills = async (_req, res) => {
    try {
        const skills = db_1.db.skills.list();
        return res.status(200).json({ skills });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to fetch skills.' });
    }
};
exports.getAllSkills = getAllSkills;
const addOfferedSkill = async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Skill name is required.' });
        }
        const skill = db_1.db.skills.findOrCreate(name.trim(), category || 'General');
        db_1.db.userOfferedSkills.add(req.userId, skill.id);
        const userDetails = db_1.db.getUserWithDetails(req.userId);
        return res.status(200).json({
            message: 'Offered skill added successfully.',
            offeredSkills: userDetails?.offeredSkills,
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to add offered skill.' });
    }
};
exports.addOfferedSkill = addOfferedSkill;
const removeOfferedSkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        db_1.db.userOfferedSkills.remove(req.userId, skillId);
        const userDetails = db_1.db.getUserWithDetails(req.userId);
        return res.status(200).json({
            message: 'Offered skill removed.',
            offeredSkills: userDetails?.offeredSkills,
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to remove offered skill.' });
    }
};
exports.removeOfferedSkill = removeOfferedSkill;
const addRequiredSkill = async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Skill name is required.' });
        }
        const skill = db_1.db.skills.findOrCreate(name.trim(), category || 'General');
        db_1.db.userRequiredSkills.add(req.userId, skill.id);
        const userDetails = db_1.db.getUserWithDetails(req.userId);
        return res.status(200).json({
            message: 'Required skill added successfully.',
            requiredSkills: userDetails?.requiredSkills,
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to add required skill.' });
    }
};
exports.addRequiredSkill = addRequiredSkill;
const removeRequiredSkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        db_1.db.userRequiredSkills.remove(req.userId, skillId);
        const userDetails = db_1.db.getUserWithDetails(req.userId);
        return res.status(200).json({
            message: 'Required skill removed.',
            requiredSkills: userDetails?.requiredSkills,
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to remove required skill.' });
    }
};
exports.removeRequiredSkill = removeRequiredSkill;
const updateAllUserSkills = async (req, res) => {
    try {
        const { offeredSkillNames, requiredSkillNames } = req.body;
        if (Array.isArray(offeredSkillNames)) {
            db_1.db.userOfferedSkills.setForUser(req.userId, offeredSkillNames);
        }
        if (Array.isArray(requiredSkillNames)) {
            db_1.db.userRequiredSkills.setForUser(req.userId, requiredSkillNames);
        }
        const userDetails = db_1.db.getUserWithDetails(req.userId);
        return res.status(200).json({
            message: 'Skills updated successfully!',
            user: userDetails,
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to update skills.' });
    }
};
exports.updateAllUserSkills = updateAllUserSkills;
