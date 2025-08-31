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

const likeSchema = new mongoose.Schema(
  {
    like: {
      type: Number,
      
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
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
  },

  { timestamps: true }
);






const Sighting = mongoose.model('Sighting', sightingSchema);

module.exports = Sighting;