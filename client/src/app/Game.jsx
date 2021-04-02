import React from 'react'
import api, {useAPI} from "../api"
import {CardsNotFound} from "./CardsNotFound.js"
import {Deck} from "./Deck.js"

export const Game = (props) => {
  let [cards, loading] = useAPI(api.getAllPlayingCards)
  let [deck, setDeck] = React.useState(starting_deck)
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
                />
    } else {
      let totalCards = deck.split("\n").map(card => parseInt(card.split(" ")[0])).reduce((a, b) => a + b)
      let validStoredCards = cards.filter(card => card.url?.length > 0 || card.rulesText?.length > 0)

      let requestedCards = deck.split("\n").map(card => card.split(" ").splice(1).join(" "))
      let found = deck.split("\n").filter(requested => validStoredCards.map(card => card.name).includes(requested.split(" ").splice(1).join(" ")))

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

const PlayGame = props => {
  return <>{JSON.stringify(props.initialDeck)}</>
}

const CardViewer = props => {
  return (
    <div>
      <>{props.name}</>
      <>{props.rulesText}</>
    </div>
  )
}

const starting_deck = `1 Yixlid Jailer
2 Vengeful Dead
4 Cackling Fiend
2 Infectious Horror
2 Severed Legion
1 Abattoir Ghoul
2 Nested Ghoul
1 Fleshbag Marauder
1 Gluttonous Zombie
1 Death Baron
1 Brain Gorgers
1 Soulless One
1 Unbreathing Horde
1 Waning Wurm
1 Hollow Dogs
1 Undead Warchief
1 Damnation
1 Festering March
1 Smallpox
1 Syphon Mind
1 Army of the Damned
1 Twilight's Call
2 Delirium Skeins
2 Bad Moon
3 Grave Peril
2 Endless Ranks of the Dead
1 Forsaken Wastes
1 Call to the Grave
55 Zombie Tokens
5 Zombie Giant Tokens`