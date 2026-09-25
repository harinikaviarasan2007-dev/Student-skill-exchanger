"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const db_1 = require("../services/db");
const getUsers = async (req, res) => {
    try {
        const { search, offeredSkill, requiredSkill, department, year, availability, learningMode, minRating, sort, } = req.query;
        let users = db_1.db.getAllUsersWithDetails();
        // Search filter (name, college, department, skills)
        if (search && search.trim() !== '') {
            const q = search.trim().toLowerCase();
            users = users.filter((u) => {
                const matchesName = u.name.toLowerCase().includes(q);
                const matchesCollege = u.college.toLowerCase().includes(q);
                const matchesDept = u.department.toLowerCase().includes(q);
                const matchesOffered = u.offeredSkills.some((s) => s.name.toLowerCase().includes(q));
                const matchesRequired = u.requiredSkills.some((s) => s.name.toLowerCase().includes(q));
                return matchesName || matchesCollege || matchesDept || matchesOffered || matchesRequired;
            });
        }
        // Filter by offered skill
        if (offeredSkill && offeredSkill.trim() !== '') {
            const sName = offeredSkill.trim().toLowerCase();
            users = users.filter((u) => u.offeredSkills.some((s) => s.name.toLowerCase().includes(sName)));
        }
        // Filter by required skill
        if (requiredSkill && requiredSkill.trim() !== '') {
            const sName = requiredSkill.trim().toLowerCase();
            users = users.filter((u) => u.requiredSkills.some((s) => s.name.toLowerCase().includes(sName)));
        }
        // Filter by department
        if (department && department !== 'All') {
            users = users.filter((u) => u.department.toLowerCase() === department.toLowerCase());
        }
        // Filter by year
        if (year && year !== 'All') {
            users = users.filter((u) => u.year.toLowerCase() === year.toLowerCase());
        }
        // Filter by availability
        if (availability && availability !== 'All') {
            users = users.filter((u) => u.availability.toLowerCase() === availability.toLowerCase() ||
                u.availability.toLowerCase() === 'flexible');
        }
        // Filter by learning mode
        if (learningMode && learningMode !== 'All') {
            users = users.filter((u) => u.learningMode.toLowerCase() === learningMode.toLowerCase() ||
                u.learningMode.toLowerCase() === 'hybrid');
        }
        // Filter by min rating
        if (minRating) {
            const min = parseFloat(minRating);
            if (!isNaN(min)) {
                users = users.filter((u) => u.averageRating >= min);
            }
        }
        // Sorting
        if (sort === 'rating') {
            users.sort((a, b) => b.averageRating - a.averageRating);
        }
        else if (sort === 'reviews') {
            users.sort((a, b) => b.reviewCount - a.reviewCount);
        }
        else if (sort === 'recent') {
            users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        else {
            // Default: sort by rating then exchanges
            users.sort((a, b) => b.averageRating - a.averageRating || b.completedExchangesCount - a.completedExchangesCount);
        }
        return res.status(200).json({ users });
    }
    catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ message: 'Failed to fetch students.' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = db_1.db.getUserWithDetails(id);
        if (!user) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        return res.status(200).json({ user });
    }
    catch (err) {
        return res.status(500).json({ message: 'Failed to fetch student details.' });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Security check: Only the user can update their own profile
        if (req.userId !== id) {
            return res.status(403).json({ message: 'You are not authorized to edit this profile.' });
        }
        const { name, college, department, year, bio, avatar, availability, learningMode, } = req.body;
        const updated = db_1.db.users.update(id, {
            ...(name && { name }),
            ...(college && { college }),
            ...(department && { department }),
            ...(year && { year }),
            ...(bio !== undefined && { bio }),
            ...(avatar && { avatar }),
            ...(availability && { availability }),
            ...(learningMode && { learningMode }),
        });
        if (!updated) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const fullDetails = db_1.db.getUserWithDetails(id);
        return res.status(200).json({
            message: 'Profile updated successfully!',
            user: fullDetails,
        });
    }
    catch (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ message: 'Failed to update profile.' });
    }
};
exports.updateUser = updateUser;
