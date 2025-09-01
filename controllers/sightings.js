const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Sighting = require('../models/sighting.js');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const sighting = await Sighting.create(req.body);
    sighting._doc.author = req.user;
    res.status(201).json(sighting);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const sightings = await Sighting.find({})
      .populate('author')
      .sort({ createdAt: 'desc' });
      res.status(200).json(sightings);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/mine', verifyToken, async (req, res) => {
  try {
    const sightings = await Sighting.find({ author: req.user._id })
      .populate('author')
      .sort({ createdAt: 'desc' });
    res.status(200).json(sightings);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:sightingId', verifyToken, async (req, res) => {
  try {
    // populate author of sighting and comments
    const sighting = await Sighting.findById(req.params.sightingId).populate([
      'author',
      'comments.author',
    ]);
    res.status(200).json(sighting);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put('/:sightingId', verifyToken, async (req, res) => {
  try {
    // Find the sighting:
    const sighting = await Sighting.findById(req.params.sightingId);

    // Check permissions:
    if (!sighting.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    // Update sighting:
    const updatedSighting = await Sighting.findByIdAndUpdate(
      req.params.sightingId,
      req.body,
      { new: true }
    );

    // Append req.user to the author property:
    updatedSighting._doc.author = req.user;

    // Issue JSON response:
    res.status(200).json(updatedSighting);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:sightingId', verifyToken, async (req, res) => {
  try {
    const sighting = await Sighting.findById(req.params.sightingId);

    if (!sighting.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedSighting = await Sighting.findByIdAndDelete(req.params.sightingId);
    res.status(200).json(deletedSighting);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/:sightingId/comments', verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const sighting = await Sighting.findById(req.params.sightingId);
    sighting.comments.push(req.body);
    await sighting.save();

    // Find the newly created comment:
    const newComment = sighting.comments[sighting.comments.length - 1];

    newComment._doc.author = req.user;

    // Respond with the newComment:
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:sightingId/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const sighting = await Sighting.findById(req.params.sightingId);
    const comment = sighting.comments.id(req.params.commentId);

    // ensures the current user is the author of the comment
    if (comment.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to edit this comment' });
    }

    comment.text = req.body.text;
    await sighting.save();
    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete('/:sightingId/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const sighting = await Sighting.findById(req.params.sightingId);
    const comment = sighting.comments.id(req.params.commentId);

    // ensures the current user is the author of the comment
    if (comment.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to edit this comment' });
    }

    sighting.comments.remove({ _id: req.params.commentId });
    await sighting.save();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
