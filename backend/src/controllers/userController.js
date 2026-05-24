import User from "../models/User.js";
import BloodRequest from "../models/BloodRequest.js";

// 🔥 Become donor
export const becomeDonor = async (req, res) => {

  try {

    const user = await User.findById(
      req.user._id
    );

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    user.isDonor = true;

    user.bloodGroup = req.body.bloodGroup;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isDonor: updatedUser.isDonor,
      bloodGroup: updatedUser.bloodGroup,
      token: req.headers.authorization.split(" ")[1],
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// 🔔 Save Firebase FCM token
export const saveFCMToken = async (req, res) => {

  try {

    const { fcmToken } = req.body;

    if (!fcmToken) {

      return res.status(400).json({
        success: false,
        message: "FCM token is required"
      });

    }

    const user = await User.findById(
      req.user._id
    );

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    user.fcmToken = fcmToken;

    await user.save();

    res.status(200).json({
      success: true,
      message: "FCM token saved successfully"
    });

  } catch (error) {

    console.error(
      "Save FCM Token Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

// 👤 Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Update fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.gender !== undefined) user.gender = req.body.gender;
    if (req.body.age !== undefined) user.age = req.body.age;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.city !== undefined) user.city = req.body.city;
    if (req.body.isDonor !== undefined) user.isDonor = req.body.isDonor;
    if (req.body.bloodGroup !== undefined) user.bloodGroup = req.body.bloodGroup;
    if (req.body.isAvailable !== undefined) user.isAvailable = req.body.isAvailable;

    if (req.body.location) {
      user.location = req.body.location;
    }

    const updatedUser = await user.save();

    const requests = await BloodRequest.countDocuments({ requester: updatedUser._id });
    const donations = await BloodRequest.countDocuments({ acceptedBy: updatedUser._id, status: "fulfilled" });

    // Preserve current token
    const token = req.headers.authorization.split(" ")[1];

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isDonor: updatedUser.isDonor,
      bloodGroup: updatedUser.bloodGroup,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      age: updatedUser.age,
      city: updatedUser.city,
      isAvailable: updatedUser.isAvailable,
      points: updatedUser.points,
      requests,
      donations,
      token,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// 👤 Get currently logged-in user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const requests = await BloodRequest.countDocuments({ requester: user._id });
    const donations = await BloodRequest.countDocuments({ acceptedBy: user._id, status: "fulfilled" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isDonor: user.isDonor,
      bloodGroup: user.bloodGroup,
      avatar: user.avatar,
      bio: user.bio,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      city: user.city,
      isAvailable: user.isAvailable,
      points: user.points,
      requests,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// 🏆 Get top users for leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ points: { $gt: 0 } })
      .select("name avatar city bloodGroup points bio")
      .sort({ points: -1 })
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// 🩸 Get all active donors
export const getActiveDonors = async (req, res) => {
  try {
    const donors = await User.find({ isDonor: true, isAvailable: true })
      .select("name avatar city bloodGroup phone location points");
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};