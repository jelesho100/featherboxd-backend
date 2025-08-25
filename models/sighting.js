const { urlencoded } = require('express');
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

const ratingSchema = new mongoose.Schema( //ask what goes in ratingSchema

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
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {
      type: String,
      required: true,
      enum: ['Big Bird', 'Little Bird'], //ask what the catregory of brids are
    },
      comments: [commentSchema],
      ratings: [ratingSchema],
  },

    { timestamps: true }
);






const Sighting = mongoose.model('Sighting', sightingSchema);

module.exports = Sighting;