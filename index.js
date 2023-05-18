import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import usersRoute from './routes/users.js';
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

// Middlewares____________________
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);

// ___________________________________
app.listen(port, (req, res) => {
  startServer();
  console.log('listening to the port ', port);
});
