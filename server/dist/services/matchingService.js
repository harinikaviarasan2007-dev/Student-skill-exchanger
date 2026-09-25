"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMatchesForUser = calculateMatchesForUser;
const db_1 = require("./db");
function calculateMatchesForUser(currentUserId) {
    const currentUser = db_1.db.getUserWithDetails(currentUserId);
    if (!currentUser)
        return [];
    const candidates = db_1.db.getAllUsersWithDetails(currentUserId);
    const results = [];
    const currentOfferedNames = currentUser.offeredSkills.map((s) => s.name.toLowerCase());
    const currentRequiredNames = currentUser.requiredSkills.map((s) => s.name.toLowerCase());
    for (const candidate of candidates) {
        if (!candidate)
            continue;
        const candidateOfferedNames = candidate.offeredSkills.map((s) => s.name.toLowerCase());
        const candidateRequiredNames = candidate.requiredSkills.map((s) => s.name.toLowerCase());
        // Skills candidate offers that current user wants
        const theyCanTeach = candidate.offeredSkills.filter((s) => currentRequiredNames.includes(s.name.toLowerCase()));
        // Skills current user offers that candidate wants
        const youCanTeach = currentUser.offeredSkills.filter((s) => candidateRequiredNames.includes(s.name.toLowerCase()));
        let rawScore = 0;
        const reasons = [];
        const hasMutual = theyCanTeach.length > 0 && youCanTeach.length > 0;
        const hasOneWay = theyCanTeach.length > 0 || youCanTeach.length > 0;
        if (hasMutual) {
            rawScore += 50;
        }
        else if (hasOneWay) {
            rawScore += 25;
        }
        // Additional matching skills (+10 each for overlaps beyond 1)
        const extraMatches = Math.max(0, theyCanTeach.length + youCanTeach.length - (hasMutual ? 2 : 1));
        rawScore += extraMatches * 10;
        // Availability match (+10)
        const sameAvailability = currentUser.availability.toLowerCase() === candidate.availability.toLowerCase() ||
            currentUser.availability.toLowerCase() === 'flexible' ||
            candidate.availability.toLowerCase() === 'flexible';
        if (sameAvailability) {
            rawScore += 10;
        }
        // Learning mode match (+5 bonus)
        const sameMode = currentUser.learningMode.toLowerCase() === candidate.learningMode.toLowerCase() ||
            currentUser.learningMode.toLowerCase() === 'hybrid' ||
            candidate.learningMode.toLowerCase() === 'hybrid';
        if (sameMode) {
            rawScore += 5;
        }
        // Good rating (+5)
        if (candidate.averageRating >= 4.0) {
            rawScore += 5;
        }
        // Generate Reasons
        if (theyCanTeach.length > 0) {
            reasons.push(`✓ They can teach ${theyCanTeach.map((s) => s.name).join(', ')}`);
        }
        if (youCanTeach.length > 0) {
            reasons.push(`✓ You can teach ${youCanTeach.map((s) => s.name).join(', ')}`);
        }
        if (sameAvailability) {
            reasons.push(currentUser.availability.toLowerCase() === candidate.availability.toLowerCase()
                ? `✓ Both are available on ${candidate.availability}`
                : `✓ Flexible availability aligns with your schedule`);
        }
        if (sameMode) {
            reasons.push(`✓ Compatible learning mode: ${candidate.learningMode}`);
        }
        if (candidate.averageRating >= 4.5 && candidate.reviewCount > 0) {
            reasons.push(`✓ Highly rated student (${candidate.averageRating}★ with ${candidate.reviewCount} reviews)`);
        }
        // Normalize: base max realistic raw score is ~80-85, scale nicely to 0-98%
        // If mutual, boost percentage to 85%-98%
        let percentage = 0;
        if (hasMutual) {
            // 85% to 98%
            percentage = Math.min(98, 85 + Math.round((rawScore - 60) * 0.5));
            percentage = Math.max(85, percentage);
        }
        else if (hasOneWay) {
            // 50% to 75%
            percentage = Math.min(75, 50 + Math.round((rawScore - 25) * 0.6));
            percentage = Math.max(45, percentage);
        }
        else {
            // General availability/campus match: 15% to 35%
            percentage = Math.min(35, Math.round(rawScore * 1.5));
        }
        results.push({
            candidate,
            score: percentage,
            reasons,
            theyCanTeachYou: theyCanTeach.map((s) => s.name),
            youCanTeachThem: youCanTeach.map((s) => s.name),
        });
    }
    // Sort descending by match score
    return results.sort((a, b) => b.score - a.score);
}
