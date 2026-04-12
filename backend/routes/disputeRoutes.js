import express from 'express';
import {
  raiseDispute,
  getDisputes,
  getDisputeById,
  resolveDispute,
} from '../controllers/disputeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, raiseDispute)
  .get(protect, admin, getDisputes);

router.route('/:id')
  .get(protect, admin, getDisputeById);

router.route('/:id/resolve')
  .patch(protect, admin, resolveDispute);

export default router;
