import express from 'express';
import {
  sendOtp,
  verifyOtpAndRegister,
  authUser,
} from '../controllers/authController.js';

const router = express.Router();

// ✅ OTP Flow
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpAndRegister);

// ✅ Login
router.post('/login', authUser);

export default router;