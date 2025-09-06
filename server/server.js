import express from "express";
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
// ADD THIS LINE
import userRouter from "./routes/userRoutes.js"; 

const app = express();
await connectCloudinary();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Public route
app.get('/', (req, res) => res.send('Server is Live!'));

// Protected routes
app.use('/api/ai', requireAuth(), aiRouter);
// AND ADD THIS LINE
app.use('/api/user', requireAuth(), userRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});