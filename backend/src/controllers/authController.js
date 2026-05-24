import User from '../models/User.js';
import Otp from '../models/Otp.js';
import BloodRequest from '../models/BloodRequest.js';
import generateToken from '../utils/generateToken.js';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';

// ==============================
// 📩 SEND OTP
// @route POST /api/auth/send-otp
// ==============================
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // ❌ Prevent duplicate users
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // ❌ Prevent OTP spam (1 minute cooldown)
        const existingOtp = await Otp.findOne({ email });
        if (existingOtp) {
            const timeElapsed = Date.now() - (existingOtp.expiresAt.getTime() - 5 * 60 * 1000);
            if (timeElapsed < 60 * 1000) {
                const secondsLeft = Math.ceil((60 * 1000 - timeElapsed) / 1000);
                return res.status(400).json({
                    message: `Please wait ${secondsLeft} seconds before requesting a new OTP.`,
                });
            } else {
                // Delete the old OTP record before generating a new one
                await Otp.deleteOne({ email });
            }
        }

        // ✅ Generate OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        // ✅ Save OTP
        await Otp.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        });

        // ✅ Send email with local/dev fallback
        try {
            // ✅ Email transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // ✅ Send email
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'LifeLink+ Email Verification OTP',
                html: `
                    <h2>Email Verification</h2>
                    <p>Your OTP is:</p>
                    <h1>${otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                `,
            });
        } catch (mailError) {
            console.error('SMTP email sending failed, falling back to console logging:', mailError.message);
            console.log(`\n========================================`);
            console.log(`🔥 [DEV FALLBACK] EMAIL SENDING FAILED!`);
            console.log(`📩 OTP for ${email} is: ${otp}`);
            console.log(`========================================\n`);

            return res.json({ 
                message: 'OTP sent successfully (Dev Fallback)', 
                otp, 
                devFallback: true 
            });
        }

        return res.json({ message: 'OTP sent successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ========================================
// ✅ VERIFY OTP + REGISTER USER
// @route POST /api/auth/verify-otp
// ========================================
export const verifyOtpAndRegister = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            isDonor,
            bloodGroup,
            location,
            city,
            otp,
        } = req.body;

        // ✅ Check OTP
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (otpRecord.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // ❌ Double check user (safety)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // ✅ Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
            isDonor: isDonor || false,
            bloodGroup: isDonor ? bloodGroup : undefined,
            location: location || { type: 'Point', coordinates: [0, 0] },
            city: city || '',
            isVerified: role === 'hospital' ? false : true,
        });

        // ✅ Delete OTP after success
        await Otp.deleteMany({ email });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isDonor: user.isDonor,
            bloodGroup: user.bloodGroup,
            points: user.points || 0,
            avatar: user.avatar,
            bio: user.bio,
            phone: user.phone,
            gender: user.gender,
            age: user.age,
            city: user.city,
            requests: 0,
            donations: 0,
            token: generateToken(user._id),
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ==============================
// 🔐 LOGIN USER
// @route POST /api/auth/login
// ==============================
export const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // ❌ Block unverified users
        if (user && !user.isVerified) {
            if (user.role === 'hospital') {
                return res.status(401).json({
                    message: 'Your hospital account is pending admin verification.',
                });
            }
            return res.status(401).json({
                message: 'Please verify your email first',
            });
        }

        if (user && (await user.matchPassword(password))) {
            const requests = await BloodRequest.countDocuments({ requester: user._id });
            const donations = await BloodRequest.countDocuments({ acceptedBy: user._id, status: 'fulfilled' });

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isDonor: user.isDonor,
                bloodGroup: user.bloodGroup,
                points: user.points || 0,
                avatar: user.avatar,
                bio: user.bio,
                phone: user.phone,
                gender: user.gender,
                age: user.age,
                city: user.city,
                requests,
                donations,
                token: generateToken(user._id),
            });
        } else {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};