import User from '../models/User.js';
import BloodRequest from '../models/BloodRequest.js';

// ==============================
// 📊 GET ADMIN STATS
// @route GET /api/admin/stats
// @access Private (Admin)
// ==============================
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalHospitals = await User.countDocuments({ role: 'hospital' });
        const pendingHospitals = await User.countDocuments({ role: 'hospital', isVerified: false });
        const totalRequests = await BloodRequest.countDocuments();

        return res.json({
            totalUsers,
            totalHospitals,
            pendingHospitals,
            totalRequests
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ==============================
// 🏥 GET ALL HOSPITALS
// @route GET /api/admin/hospitals
// @access Private (Admin)
// ==============================
export const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await User.find({ role: 'hospital' }).sort('-createdAt');
        return res.json(hospitals);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ==============================
// ✅ VERIFY HOSPITAL
// @route PUT /api/admin/hospitals/:id/verify
// @access Private (Admin)
// ==============================
export const verifyHospital = async (req, res) => {
    try {
        const hospital = await User.findById(req.params.id);

        if (!hospital || hospital.role !== 'hospital') {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Toggle verification
        hospital.isVerified = !hospital.isVerified;
        await hospital.save();

        return res.json({
            message: `Hospital ${hospital.name} successfully ${hospital.isVerified ? 'verified' : 'unverified'}`,
            hospital
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ==============================
// 👥 GET ALL USERS
// @route GET /api/admin/users
// @access Private (Admin)
// ==============================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).sort('-createdAt');
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ==============================
// ❌ DELETE USER
// @route DELETE /api/admin/users/:id
// @access Private (Admin)
// ==============================
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin account' });
        }

        await User.findByIdAndDelete(req.params.id);
        return res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ==============================
// 🩸 GET ALL BLOOD REQUESTS
// @route GET /api/admin/requests
// @access Private (Admin)
// ==============================
export const getAllRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find()
            .populate('requester', 'name email phone avatar')
            .populate('acceptedBy', 'name email phone avatar points')
            .sort('-createdAt');
        return res.json(requests);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ==============================
// ❌ DELETE BLOOD REQUEST
// @route DELETE /api/admin/requests/:id
// @access Private (Admin)
// ==============================
export const deleteRequest = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Blood request not found' });
        }

        await BloodRequest.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Blood request deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
