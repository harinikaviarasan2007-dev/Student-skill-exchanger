"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skillController_1 = require("../controllers/skillController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public skill list
router.get('/', skillController_1.getAllSkills);
// User-specific skill routes
router.post('/users/skills/offered', authMiddleware_1.requireAuth, skillController_1.addOfferedSkill);
router.delete('/users/skills/offered/:skillId', authMiddleware_1.requireAuth, skillController_1.removeOfferedSkill);
router.post('/users/skills/required', authMiddleware_1.requireAuth, skillController_1.addRequiredSkill);
router.delete('/users/skills/required/:skillId', authMiddleware_1.requireAuth, skillController_1.removeRequiredSkill);
router.put('/users/skills', authMiddleware_1.requireAuth, skillController_1.updateAllUserSkills);
// Also alias /offered and /required for convenience
router.post('/offered', authMiddleware_1.requireAuth, skillController_1.addOfferedSkill);
router.delete('/offered/:skillId', authMiddleware_1.requireAuth, skillController_1.removeOfferedSkill);
router.post('/required', authMiddleware_1.requireAuth, skillController_1.addRequiredSkill);
router.delete('/required/:skillId', authMiddleware_1.requireAuth, skillController_1.removeRequiredSkill);
exports.default = router;
