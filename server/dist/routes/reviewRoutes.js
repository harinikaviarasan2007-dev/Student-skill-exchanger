"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.requireAuth, reviewController_1.createReview);
router.get('/user/:id', reviewController_1.getReviewsForUser);
exports.default = router;
