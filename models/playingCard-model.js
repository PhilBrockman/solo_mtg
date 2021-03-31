const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayingCard = new Schema(
    {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        rulesText: { type: String },
        url: { type: String },
        img: { type: String }
    },
    { timestamps: true },
)

module.exports = mongoose.model('playingCards', PlayingCard)
