import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Seed/ensure Admin User
        const adminEmail = 'pluslifelink@gmail.com';
        const adminUser = await User.findOne({ email: adminEmail });
        
        if (!adminUser) {
            await User.create({
                name: 'LifeLink Admin',
                email: adminEmail,
                password: 'LifeLink@8055', // will be hashed automatically by pre-save hook
                role: 'admin',
                isVerified: true
            });
            console.log('Admin user seeded successfully!');
        } else {
            // Ensure credentials match target requirements
            adminUser.password = 'LifeLink@8055';
            adminUser.role = 'admin';
            adminUser.isVerified = true;
            await adminUser.save();
            console.log('Admin credentials updated and verified!');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;