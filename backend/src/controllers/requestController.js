import BloodRequest from '../models/BloodRequest.js';
import User from '../models/User.js';
import { sendPushNotification } from '../config/firebase.js';

// @desc    Create a new blood request
// @route   POST /api/requests
// @access  Private
export const createBloodRequest = async (req, res) => {
    try {
        const { patientName, bloodGroup, unitsRequired, urgency, location, hospitalName, contact, address } = req.body;

        const request = await BloodRequest.create({
            requester: req.user._id,
            patientName,
            bloodGroup,
            unitsRequired,
            urgency,
            location,
            hospitalName,
            contact,
            address
        });

        // --- TRIGGER PUSH NOTIFICATIONS ---
        // Find all available donors with the matching blood group who have an FCM token
        const eligibleDonors = await User.find({
            isDonor: true, // ✅ correct field
            bloodGroup: bloodGroup,
            isAvailable: true,
            fcmToken: { $ne: null }
        });

        // Send notification to each eligible donor
        eligibleDonors.forEach(donor => {
            const title = `Urgent: ${bloodGroup} Blood Needed!`;
            const body = `${patientName} needs ${unitsRequired} unit(s) of ${bloodGroup} blood at ${hospitalName}. Can you help?`;

            sendPushNotification(donor.fcmToken, title, body, {
                requestId: request._id.toString(),
                urgency: urgency
            });
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active blood requests
// @route   GET /api/requests
// @access  Public
export const getActiveRequests = async (req, res) => {
    try {
        const requests = await BloodRequest.find({ status: { $in: ['pending', 'accepted', 'fulfilled'] } })
            .populate('requester', 'name email phone avatar')
            .populate('acceptedBy', 'name email phone avatar points')
            .sort('-createdAt');

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept a blood request
// @route   PUT /api/requests/:id/accept
// @access  Private
export const acceptBloodRequest = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Blood request not found" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: "Request is no longer pending" });
        }

        if (request.requester.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot accept your own request" });
        }

        request.acceptedBy = req.user._id;
        request.status = 'accepted';

        await request.save({ validateBeforeSave: false });

        const updatedRequest = await BloodRequest.findById(request._id)
            .populate('requester', 'name email phone avatar')
            .populate('acceptedBy', 'name email phone avatar points');

        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify blood donation and credit Honor points
// @route   PUT /api/requests/:id/verify
// @access  Private
export const verifyBloodRequest = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Blood request not found" });
        }

        if (request.requester.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the requester can verify this donation" });
        }

        if (request.status !== 'accepted') {
            return res.status(400).json({ message: "Request must be accepted by a donor first" });
        }

        if (!request.acceptedBy) {
            return res.status(400).json({ message: "No donor has accepted this request yet" });
        }

        request.status = 'fulfilled';
        request.donationVerified = true;
        await request.save({ validateBeforeSave: false });

        // Calculate Honor points based on urgency
        let honorPoints = 100; // default for urgent
        if (request.urgency === 'critical') {
            honorPoints = 200;
        } else if (request.urgency === 'normal') {
            honorPoints = 50;
        }

        // Credit points to the donor
        const donor = await User.findById(request.acceptedBy);
        if (donor) {
            donor.points = (donor.points || 0) + honorPoints;
            await donor.save();
        }

        const updatedRequest = await BloodRequest.findById(request._id)
            .populate('requester', 'name email phone avatar')
            .populate('acceptedBy', 'name email phone avatar points');

        res.json({ request: updatedRequest, creditedPoints: honorPoints });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
