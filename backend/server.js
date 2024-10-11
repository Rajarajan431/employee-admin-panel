import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import listingRouter from './routes/listingRoute.js'

import cookieParser from 'cookie-parser'
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connect to MongoDB");
})
.catch((err) => {
    console.log(err);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
})

app.use(express.json())
app.use(cookieParser())

app.use('/backend/auth', authRouter)
app.use('/backend/user', userRouter)
app.use('/backend/employee', listingRouter)


app.use(( err, req, res, next ) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});