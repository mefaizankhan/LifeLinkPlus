import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    unitsRequired: {
        type: Number,
        required: true,
        default: 1
    },
    urgency: {
        type: String,
        enum: ['normal', 'urgent', 'critical'],
        default: 'urgent'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    hospitalName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ""
    },
    contact: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'fulfilled', 'cancelled'],
        default: 'pending'
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    donationVerified: {
        type: Boolean,
        default: false
    },
    donorsResponded: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

bloodRequestSchema.index({ location: '2dsphere' });

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
export default BloodRequest;
