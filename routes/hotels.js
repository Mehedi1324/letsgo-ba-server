import express from 'express';
import Hotels from '../models/Hotels.js';
import Rooms from '../models/Rooms.js';
const router = express.Router();

router.post('/', async (req, res, next) => {
  const newHotel = new Hotels(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
});

// Find all the data ___________________________

router.get('/all', async (req, res, next) => {
  try {
    const hotel = await Hotels.find();
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
});

// Update________________

router.put('/:id', async (req, res, next) => {
  try {
    const updatedHotel = await Hotels.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
});

// Delete________________

router.delete('/:id', async (req, res, next) => {
  try {
    const deleteHotel = await Hotels.findByIdAndDelete(req.params.id);
    res.status(200).json('Hotel has been deleted');
  } catch (err) {
    next(err);
  }
});

// Get ________________

router.get('/find/:id', async (req, res, next) => {
  try {
    const hotel = await Hotels.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
});

// Get all________________

router.get('/', async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotels.find({
      ...others,
      cheapestPrice: { $gte: min | 1, $lte: max || 999 },
    }).limit(8);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
});

// Get hotels according to city and type_________________

router.get('/countByCity', async (req, res, next) => {
  const cities = req.query.cities.split(',');
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotels.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
});

// Get data according to __________________

router.get('/room/:id', async (req, res, next) => {
  try {
    const hotel = Hotels.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Rooms.findById(room);
      })
    );
  } catch (err) {
    next(err);
  }
});

// Get data according to country__________________

router.get('/countByType', async (req, res, next) => {
  try {
    const hotelCount = await Hotels.countDocuments({ propertyType: 'hotel' });
    const apartmentCount = await Hotels.countDocuments({
      propertyType: 'apartment',
    });
    const resortCount = await Hotels.countDocuments({
      propertyType: 'resort',
    });
    const villaCount = await Hotels.countDocuments({ propertyType: 'villa' });
    const cabinCount = await Hotels.countDocuments({ propertyType: 'cabin' });

    res.status(200).json([
      { propertyType: 'hotel', count: hotelCount },
      { propertyType: 'apartment', count: apartmentCount },
      { propertyType: 'resort', count: resortCount },
      { propertyType: 'villa', count: villaCount },
      { propertyType: 'cabin', count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
});

export default router;
