import express from 'express';
import {
    getAdminStats,
    getAllHospitals,
    verifyHospital,
    getAllUsers,
    deleteUser,
    getAllRequests,
    deleteRequest
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply protect & admin middlewares to all admin routes
router.use(protect, admin);

// Stats & Dashboard Data
router.get('/stats', getAdminStats);

// Hospital Management
router.get('/hospitals', getAllHospitals);
router.put('/hospitals/:id/verify', verifyHospital);

// User Management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Blood Request Management
router.get('/requests', getAllRequests);
router.delete('/requests/:id', deleteRequest);

export default router;
