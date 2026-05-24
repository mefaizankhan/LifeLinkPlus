import express from 'express';
import { createBloodRequest, getActiveRequests, acceptBloodRequest, verifyBloodRequest } from '../controllers/requestController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBloodRequest);
router.get('/', getActiveRequests);
router.put('/:id/accept', protect, acceptBloodRequest);
router.put('/:id/verify', protect, verifyBloodRequest);

export default router;