import React from 'react'
import api, {useAPI} from "../api"
import {CardsNotFound} from "./CardsNotFound.js"
import {startingDeck} from "./StartingDeck.js"
import "./game.css"
import {PlayGame} from "./PlayGame.js"
import {cardName} from "./utils.js"

export const Game = (props) => {
  let [cards, loading] = useAPI(api.getAllPlayingCards)
  let [deck, setDeck] = React.useState(startingDeck)
  let [readiedUp, setReadiedUp] = React.useState(false)

  const [availableCards, setAvailableCards] = React.useState(null)

  React.useEffect(() => {
    moreCardsFound()
  }, [cards])

  const moreCardsFound = () => {
    let currentThread = true
    api.getAllPlayingCards().then((res, err) => {
      
      if(err){
        // there's a server error higher up is my guess
        console.error("err", err)
      } else {
        if(currentThread){
          setAvailableCards(res.data.data)
        }
      }
    })
    return () => currentThread = false
  }

  const handleDeckChange = event => {
    setDeck(event.target.value)
  }

  const startGame = (completedDeck) => {
    setReadiedUp(completedDeck)
  }

  let content 
  if(loading === false){
    if(readiedUp){
      content = <PlayGame
                initialDeck={readiedUp}
                allCards={cards}
                />
    } else {
      if(availableCards){
        console.log('availableCards', availableCards)
        content = <>
                    <CardLoader cards={availableCards}
                    deck={deck} handleChange={handleDeckChange} 
                    startGame={startGame}
                    moreCardsFound={moreCardsFound} />
                  </>
      } else {
          content = <>waiting for cards </>
      }
    }

  } else {
    content = (
      <>
        Loading... (Game.jsx)
      </>
    )
  }
  return <>
    <DeckArea deck={deck} handleChange={handleDeckChange} />
    {content}
    </>
}

const DeckArea = props => {
  return <textarea value={props.deck} onChange={props.handleChange}/>
}

const CardLoader = props => {
  const availableCards = props.cards
  const deck = props.deck 

  let validStoredCards = availableCards.filter(card => card?.url?.length > 0 || card?.rulesText?.length > 0)

  let requestedCards = deck.split("\n").map(card => cardName(card))
  let found = deck.split("\n").filter(requested => validStoredCards.map(card => card.name).includes(requested.split(" ").splice(1).join(" ")))

  let totalCards = found.length > 0 ? found.map(card => parseInt(card.split(" ")[0])).reduce((a, b) => a + b)
                                      : 0;

  let notFound = requestedCards.filter(card => !validStoredCards.map(card => card.name).includes(card))

  return  <>
            {totalCards} found
            <>{<CardsNotFound moreCardsFound={props.moreCardsFound} allCards={availableCards} notFound={notFound} />} </>
            <div><button onClick={(event) => props.startGame(found)}>Start</button></div>
          </>
}
