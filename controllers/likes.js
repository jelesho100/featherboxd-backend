const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../middleware/verify-token.js');
const Like = require('../models/like.js');
const Sighting = require('../models/sighting.js');
const router = express.Router();

router.post('/:sightingId', verifyToken, async (req, res) => {
    try {
        const { sightingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(sightingId)) {
            return res.status(400).json({ error: 'Invalid sighting Id' })
        }

        const sighting = await Sighting.findById(sightingId).select('_id');
        if (!sighting) {
            return res.status(404).json({ error: 'Sighting not found' });
        }

        const payload = { author: req.user._id, sighting: sightingId };

        try {
            await Like.create(payload)
        } catch (err) {
            if (err.code !== 11000) throw err;
        }

        const count = await Like.countDocuments({ sighting: sightingId });
        return res.status(200).json({ liked: true, count });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/:sightingId', verifyToken, async (req, res) => {
    try {
        const { sightingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(sightingId)) {
            return res.status(400).json({ error: 'Invalid sighting id' });
        }

        const sighting = await Sighting.findById(sightingId).select('_id');
        if (!sighting) return res.status(404).json({ error: 'Sighting not found' });

        const result = await Like.deleteOne({ sighting: sightingId, author: req.user._id });

        if (result.deletedCount === 1) {
            const updateRes = await Sighting.updateOne(
                { _id: sightingId },
                { $inc: { likeCount: -1 } }
            );
        }

        const count = await Like.countDocuments({ sighting: sightingId });

        return res.status(200).json({ liked: false, removed: result.deletedCount === 1, count });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/:sightingId/count', async (req, res) => {
    try {
        const { sightingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(sightingId)) {
            return res.status(400).json({ error: 'Invalid sighting id' });
        }

        const exists = await Sighting.exists({ _id: sightingId });
        if (!exists) {
            return res.status(404).json({ error: 'Sighting not found' });
        }

        const count = await Like.countDocuments({ sighting: sightingId });

        return res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/:sightingId/isLiked', verifyToken, async (req, res) => {
    try {
        const { sightingId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(sightingId)) {
            return res.status(400).json({ error: 'Invalid sighting id' });
        }

        const exists = await Sighting.exists({ _id: sightingId });
        if (!exists) {
            return res.status(404).json({ error: 'Sighting not found' });
        }

        const like = await Like.findOne({
            sighting: sightingId,
            author: req.user._id,
        });

        const liked = !!like;

        return res.status(200).json({ liked });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;

