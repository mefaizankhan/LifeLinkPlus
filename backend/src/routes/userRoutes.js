import express from "express";

import {
  becomeDonor,
  saveFCMToken,
  updateUserProfile,
  getUserProfile,
  getLeaderboard,
  getActiveDonors
} from "../controllers/userController.js";

import {
  protect
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🏆 Get Leaderboard
router.get(
  "/leaderboard",
  getLeaderboard
);

// 🩸 Get Active Donors
router.get(
  "/active-donors",
  getActiveDonors
);

// 👤 Get Profile
router.get(
  "/profile",
  protect,
  getUserProfile
);

// 👤 Update Profile
router.put(
  "/profile",
  protect,
  updateUserProfile
);

// 🔥 Become donor
router.put(
  "/become-donor",
  protect,
  becomeDonor
);

// 🔔 Save FCM token
router.post(
  "/save-fcm-token",
  protect,
  saveFCMToken
);

export default router;