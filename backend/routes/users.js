const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all users (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const searchQuery = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { socialMediaHandle: { $regex: search, $options: 'i' } }
      ]
    };

    const users = await User.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(searchQuery);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit new user with images
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
    const images = [];

    // Upload images to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        { folder: 'user-submissions' }
      );
      images.push({
        url: result.secure_url,
        publicId: result.public_id
      });
    }

    // Create new user
    const user = new User({
      name,
      socialMediaHandle,
      images
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
