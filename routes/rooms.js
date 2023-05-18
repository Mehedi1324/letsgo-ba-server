import express from 'express';
import Rooms from '../models/Rooms.js';
import Hotels from '../models/Hotels.js';
import { verifyAdmin } from '../utils/verifyToken.js';
const router = express.Router();

// Create_______________________

router.post('/:hotelid', async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Rooms(req.body);
  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotels.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
});

// Update________________

router.put('/:id', verifyAdmin, async (req, res, next) => {
  try {
    const updatedroom = await Rooms.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedroom);
  } catch (err) {
    next(err);
  }
});

// Delete________________

router.delete('/:id/:hotelid', verifyAdmin, async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Rooms.findByIdAndDelete(req.params.id);
    try {
      await Hotels.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch {
      next(err);
    }
    res.status(200).json('room has been deleted');
  } catch (err) {
    next(err);
  }
});

// Get ________________

router.get('/:id', async (req, res, next) => {
  try {
    const room = await Rooms.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
});

// Get all________________

router.get('/', async (req, res, next) => {
  try {
    const rooms = await Rooms.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
});

export default router;
