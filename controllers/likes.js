const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Like = require('../models/like.js');
const Sighting = require('../models/sighting.js');
const router = express.Router();

router.post('/:sightingId', verifyToken, async (req, res) => {
    try {
        const sightingId = req.params.sightingId;

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

