import { Router } from 'express';
import {
  getAllSkills,
  addOfferedSkill,
  removeOfferedSkill,
  addRequiredSkill,
  removeRequiredSkill,
  updateAllUserSkills,
} from '../controllers/skillController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Public skill list
router.get('/', getAllSkills);

// User-specific skill routes
router.post('/users/skills/offered', requireAuth, addOfferedSkill);
router.delete('/users/skills/offered/:skillId', requireAuth, removeOfferedSkill);
router.post('/users/skills/required', requireAuth, addRequiredSkill);
router.delete('/users/skills/required/:skillId', requireAuth, removeRequiredSkill);
router.put('/users/skills', requireAuth, updateAllUserSkills);

// Also alias /offered and /required for convenience
router.post('/offered', requireAuth, addOfferedSkill);
router.delete('/offered/:skillId', requireAuth, removeOfferedSkill);
router.post('/required', requireAuth, addRequiredSkill);
router.delete('/required/:skillId', requireAuth, removeRequiredSkill);

export default router;
