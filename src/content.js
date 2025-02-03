const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  genre: { type: String, required: true },
  type: { type: String, enum: ['movie', 'series'], required: true },
  cast: [String],
  duration: String,
  releaseYear: Number,
  thumbnail: { type: String, required: true },
  trailerUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);