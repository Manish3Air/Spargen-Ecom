import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, isAdmin, getDashboardStats);

export default router;
