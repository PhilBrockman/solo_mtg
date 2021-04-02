import React from 'react'
import api, {useAPI} from "../api"
import {CardsNotFound} from "./CardsNotFound.js"
import {Deck} from "./Deck.js"
import {startingDeck} from "./StartingDeck.js"
import {DisplayCard} from "../components"

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
      let totalCards = deck.split("\n").map(card => parseInt(card.split(" ")[0])).reduce((a, b) => a + b)
      let validStoredCards = cards.filter(card => card.url?.length > 0 || card.rulesText?.length > 0)

      let requestedCards = deck.split("\n").map(card => cardName(card))
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

const cardName = card => {
  return card.split(" ").splice(1).join(" ");
}

const cardCount = card => {
  return parseInt(card.split(" ")[0]);
}

const PlayGame = props => {
  const [hordeDeck, setHordeDeck] = React.useState(null)

  React.useEffect(() => {
    const tmp = props.initialDeck.map(item => {
      return( 
        {
          quantity: cardCount(item),
          info: props.allCards.filter(
                  card => cardName(item) == card.name && 
                    (card.rulesText?.length > 0 || 
                      card.url?.length > 0))[0]
        }
          )
      }
    )
    setHordeDeck(new Deck(tmp))
  }, [])

  const dealHordeDeck = event => {
    let newCards = hordeDeck.deal()
    console.log(newCards)
    // <DisplayCard />
  }

  if(hordeDeck){
    return <>
            <>{hordeDeck.deck.length} cards</>
            <button onClick={dealHordeDeck}>Horde Action</button>
          </>
  } else {
    return <>Loading Game</>
  }
}

const CardViewer = props => {
  return (
    <div>
      <>{props.name}</>
      <>{props.rulesText}</>
    </div>
  )
}