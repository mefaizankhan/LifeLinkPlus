import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        // ✅ System roles
        role: {
            type: String,
            enum: ['user', 'hospital', 'admin'],
            default: 'user'
        },

        // ✅ Donor capability
        isDonor: {
            type: Boolean,
            default: false
        },

        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            required: function () {
                return this.isDonor === true;
            }
        },

        // 📍 GeoJSON location
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },

        city: {
            type: String,
            trim: true
        },

        // 🎯 Reward points
        points: {
            type: Number,
            default: 0
        },

        // 🩸 Donor availability
        isAvailable: {
            type: Boolean,
            default: false
        },

        // 🔔 Firebase Cloud Messaging token
        fcmToken: {
            type: String,
            default: null
        },

        // ✅ Account verification
        isVerified: {
            type: Boolean,
            default: false
        },

        // 🖼️ Profile Avatar (Base64 or URL)
        avatar: {
            type: String,
            default: null
        },

        // 📝 Short biography
        bio: {
            type: String,
            default: ""
        },

        // 📞 Phone number
        phone: {
            type: String,
            default: ""
        },

        // 👤 Gender
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
            default: 'Prefer not to say'
        },

        // 🎂 Age
        age: {
            type: Number,
            default: null
        }

    },
    {
        timestamps: true
    }
);

// 📍 Geo index
userSchema.index({ location: '2dsphere' });

// 🔐 Hash password
userSchema.pre('save', async function () {

    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});

// 🔑 Compare password
userSchema.methods.matchPassword = async function (
    enteredPassword
) {

    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
};

const User = mongoose.model(
    'User',
    userSchema
);

export default User;