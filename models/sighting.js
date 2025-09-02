
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
      match: /^(?:https?:\/\/.*\.(?:png|jpg|jpeg|gif))?$/i,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {
      type: String,
      required: false,
      enum: ['Waterfowl', 'Perching', 'Raptors', 'Other'],
    },
    comments: [commentSchema],

    likeCount: { type: Number, default: 0 },
  },

  { timestamps: true }
);



const Sighting = mongoose.model('Sighting', sightingSchema);

module.exports = Sighting;