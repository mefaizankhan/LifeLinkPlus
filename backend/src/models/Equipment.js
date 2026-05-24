import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Oxygen Cylinder', 'Hospital Bed', 'Wheelchair', 'Ventilator', 'Other'],
        required: true
    },
    description: {
        type: String
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
    availability: {
        type: Boolean,
        default: true
    },
    condition: {
        type: String,
        enum: ['new', 'good', 'fair'],
        default: 'good'
    }
}, {
    timestamps: true
});

equipmentSchema.index({ location: '2dsphere' });

const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;
