import React from 'react'
import api, {useAPI} from "../api"
import {CardsNotFound} from "./CardsNotFound.js"
import {startingDeck} from "./StartingDeck.js"
import "./game.css"
import {PlayGame} from "./PlayGame.js"
import {cardName} from "./utils.js"

console.log("game ")

export const Game = (props) => {
  let [cards, loading] = useAPI(api.getAllPlayingCards)
  let [deck, setDeck] = React.useState(startingDeck)
  let [readiedUp, setReadiedUp] = React.useState(false)

  let [availableCards, setAvailableCards] = React.useState([])

  const moreCardsFound = () => {
    api.getAllPlayingCards().then(res => {
      console.log("new data", res.data.data)
      setAvailableCards(
        res.data.data
      );
    })
  }

  const handleChange = event => {
    setDeck(event.target.value)
  }

  const startGame = (completedDeck) => {
    setReadiedUp(completedDeck)
  }

  if(loading === false){
    if(readiedUp){
      return <PlayGame 
                initialDeck={readiedUp}
                allCards={availableCards}
                />
    } else {
      let validStoredCards = availableCards.filter(card => card?.url?.length > 0 || card?.rulesText?.length > 0)

      let requestedCards = deck.split("\n").map(card => cardName(card))
      let found = deck.split("\n").filter(requested => validStoredCards.map(card => card.name).includes(requested.split(" ").splice(1).join(" ")))
      
      console.log('found', found)
      let totalCards = found.length > 0 ? found.map(card => parseInt(card.split(" ")[0])).reduce((a, b) => a + b)
                                          : 0;

      let notFound = requestedCards.filter(card => !validStoredCards.map(card => card.name).includes(card))
      
      return  <>
                <textarea value={deck} onChange={handleChange}/>
                <div><button onClick={(event) => startGame(found)}>Load {totalCards} cards</button></div>
                <>{<CardsNotFound moreCardsFound={moreCardsFound} allCards={availableCards} notFound={notFound} />} </>
              </>
    }
  } else {
    return (
      <>
        Loading... (Game.jsx)
      </>
    )
  }
}
