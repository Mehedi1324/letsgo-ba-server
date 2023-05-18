import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import usersRoute from './routes/users.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './mongodb/connnection.js';
const app = express();
const port = process.env.PORT || 1010;
dotenv.config();

app.get('/', (req, res) => {
  res.send("Welcome to Let's go booking app backend server");
});

// Connecting mongodb through mongoose_____________________

const startServer = async () => {
  try {
    connectDB(process.env.MONGO);
  } catch (error) {
    throw error;
  }
};

// Show Mongodb connection and disconnection message___________

mongoose.connection.on('disconnected', () => {
  console.log('mongoDB Disconnected');
});

// Middlewares____________________
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/hotels', hotelsRoute);
app.use('/rooms', roomsRoute);

app.use((err, req, res, next) => {
  const errrorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong';
  return res.status(errrorStatus).json({
    success: false,
    status: errrorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// ___________________________________
app.listen(port, (req, res) => {
  startServer();
  console.log('listening to the port ', port);
});
