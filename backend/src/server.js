import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';

import { initFirebase } from './config/firebase.js';

import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load env variables
dotenv.config();

// Connect MongoDB
connectDB();

// Initialize Firebase
initFirebase();

const app = express();

// Middleware
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/requests', requestRoutes);

app.use('/api/users', userRoutes);

app.use('/api/admin', adminRoutes);

// Base Route
app.get('/', (req, res) => {

    res.send(
        'LifeLink+ API is running...'
    );

});

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});