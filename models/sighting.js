const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const ratingSchema = new mongoose.Schema(
  {
    stars: {
      type: Number,
      min: 1,
      max: 5,
    },
    rater: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }

);

const sightingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      trim: true,
      match: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {
      type: String,
      required: false,
      enum: ['Waterfowl', 'Perching', 'Raptors', 'Other'],
    },
    comments: [commentSchema],
    ratings: [ratingSchema],
  },

  { timestamps: true }
);






const Sighting = mongoose.model('Sighting', sightingSchema);

module.exports = Sighting;