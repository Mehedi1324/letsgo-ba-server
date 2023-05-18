import express from 'express';
import Users from '../models/Users.js';
import bcrypt from 'bcrypt';
import { createError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Register user_________________________

router.post('/register', async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new Users({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    await newUser.save();
    res.status(200).json('user has been created successfully');
  } catch (err) {
    next(err);
  }
});

// Login User _____________________________________

router.post('/login', async (req, res, next) => {
  try {
    const user = await Users.findOne({ username: req.body.username });
    if (!user) return next(createError(404, 'User not found'));
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, 'Wrong password entered'));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user;
    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({ ...otherDetails });
  } catch (err) {
    next(err);
  }
});

export default router;