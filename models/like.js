
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sighting: { type: mongoose.Schema.Types.ObjectId, ref: 'Sighting' },
});

likeSchema.index(
    { sighting: 1, author: 1 },
    { unique: true }, 
);

module.exports = mongoose.model('Like', likeSchema);