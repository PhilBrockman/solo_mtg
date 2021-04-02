const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayingCard = new Schema(
    {
        name: { type: String, required: true },
        rulesText: { type: String },
    },
    { timestamps: true },
)

module.exports = mongoose.model('playingCards', PlayingCard)
