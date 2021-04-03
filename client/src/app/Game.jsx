import React from 'react'
import api, {useAPI} from "../api"
import {CardsNotFound} from "./CardsNotFound.js"
import {startingDeck} from "./StartingDeck.js"
import "./game.css"
import {PlayGame, cardName} from "./PlayGame.js"

export const Game = (props) => {
  let [cards, loading] = useAPI(api.getAllPlayingCards)
  let [deck, setDeck] = React.useState(startingDeck)
  let [readiedUp, setReadiedUp] = React.useState(false)

  const handleChange = event => {
    setDeck(event.target.value)
  }

  const startGame = (event, completedDeck) => {
    setReadiedUp(completedDeck)
  }

  if(loading === false){
    if(readiedUp){
      return <PlayGame 
                initialDeck={readiedUp}
                allCards={cards}
                />
    } else {
      let validStoredCards = cards.filter(card => card.url?.length > 0 || card.rulesText?.length > 0)

      let requestedCards = deck.split("\n").map(card => cardName(card))
      let found = deck.split("\n").filter(requested => validStoredCards.map(card => card.name).includes(requested.split(" ").splice(1).join(" ")))
      
      console.log('found', found)
      let totalCards = found.length > 0 ? found.map(card => parseInt(card.split(" ")[0])).reduce((a, b) => a + b)
                                          : 0;

      let notFound = requestedCards.filter(card => !validStoredCards.map(card => card.name).includes(card))
      
      return  <>
                <textarea value={deck} onChange={handleChange}/>
                <div><button onClick={(event) => startGame(event, found)}>Load {totalCards} cards</button></div>
                <>{<CardsNotFound allCards={cards} notFound={notFound} />} </>
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
