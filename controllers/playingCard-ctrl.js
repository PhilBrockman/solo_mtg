
const PlayingCard = require('../models/playingCard-model')

createPlayingCard = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playing Card',
        })
    }


    const playingCard = new PlayingCard(body)

    if (!playingCard) {
        return res.status(400).json({ success: false, error: err })
    }

    playingCard
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: playingCard._id,
                message: 'Playing Card created!',
            })
        })
        .catch(error => {
            console.log("error", error)
            return res.status(200).json({
                error,
                message: 'Playing Card not created due to server issue.',
            })
        })
}

updatePlayingCard = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    PlayingCard.findOne({ _id: req.params.id }, (err, playingCard) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playing Card not found!',
            })
        }
        playingCard.name = body.name
        playingCard.rulesText = body.rulesText
        playingCard.url = body.url
        playingCard.token = body.token

        playingCard
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: playingCard._id,
                    message: 'Playing Card updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Playing Card not updated!',
                })
            })
    })
}

deletePlayingCard = async (req, res) => {
    await PlayingCard.findOneAndDelete({ _id: req.params.id }, (err, playingCard) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!playingCard) {
            return res
                .status(404)
                .json({ success: false, error: `Playing Card not found` })
        }

        return res.status(200).json({ success: true, data: playingCard })
    }).catch(err => console.log(err))
}

getPlayingCardById = async (req, res) => {
    await PlayingCard.findOne({ _id: req.params.id }, (err, playingCard) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!playingCard) {
            return res
                .status(404)
                .json({ success: false, error: `Playing Card not found` })
        }
        return res.status(200).json({ success: true, data: playingCard })
    }).catch(err => console.log(err))
}

getPlayingCards = async (req, res) => {
    await PlayingCard.find({}, (err, playingCards) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: playingCards })
    }).catch(err => console.log(err))
}

module.exports = {
    createPlayingCard,
    updatePlayingCard,
    deletePlayingCard,
    getPlayingCards,
    getPlayingCardById,
}
