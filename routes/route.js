const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// Search endpoint
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await Content.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
        { cast: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

module.exports = router;