const express = require('express')

const PlayingCardCtrl = require('../controllers/playingCard-ctrl')

const router = express.Router()

router.post('/playingCard', PlayingCardCtrl.createPlayingCard)
router.put('/playingCard/:id', PlayingCardCtrl.updatePlayingCard)
router.delete('/playingCard/:id', PlayingCardCtrl.deletePlayingCard)
router.get('/playingCard/:id', PlayingCardCtrl.getPlayingCardById)
router.get('/playingCards', PlayingCardCtrl.getPlayingCards)

module.exports = router
