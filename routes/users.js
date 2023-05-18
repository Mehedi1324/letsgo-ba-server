import express from 'express';
import Users from '../models/Users.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';
const router = express.Router();

// Update________________

router.put('/:id', verifyUser, async (req, res, next) => {
  try {
    const updateduser = await Users.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateduser);
  } catch (err) {
    next(err);
  }
});

// Delete________________

router.delete('/:id', verifyUser, async (req, res, next) => {
  try {
    const updateduser = await Users.findByIdAndDelete(req.params.id);
    res.status(200).json('user has been deleted');
  } catch (err) {
    next(err);
  }
});

// Get ________________

router.get('/:id', verifyUser, async (req, res, next) => {
  try {
    const user = await Users.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// Get all________________

router.get('/', verifyAdmin, async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

export default router;
