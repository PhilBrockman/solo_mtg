const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayingCard = new Schema(
    {
        name: { type: String, required: true, unique: true },
        rulesText: { type: String },
        url: {type: String}
    },
    { timestamps: true },
)

module.exports = mongoose.model('playingCards', PlayingCard)
