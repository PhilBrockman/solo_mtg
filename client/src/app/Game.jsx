import React from 'react'
import api, {useAPI} from "../api"
import {CardsNotFound} from "./CardsNotFound.js"
import {startingDeck} from "./StartingDeck.js"
import "./game.css"

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

const cardName = card => {
  return card.split(" ").splice(1).join(" ");
}

const cardCount = card => {
  return parseInt(card.split(" ")[0]);
}

function shuffle(deck){
  let m = deck.length, i;

  while(m){
    i = Math.floor(Math.random() * m--);

    [deck[m], deck[i]] = [deck[i], deck[m]];
  }

  return deck
}

const locations = {
  LIBRARY: "library",
  GRAVEYARD: "graveyard",
  EXILE: "exile",
  BATTLEFIELD: "battlefield",
}

const PlayGame = props => {
  const [hordeDeck, setHordeDeck] = React.useState(null)
  const [currentDeal, setCurrentDeal] = React.useState([])

  React.useEffect(() => {
    let deck = []
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
    for (let cards in tmp) {
      let card = tmp[cards]
      let count = card.quantity
      for (let i=0; i<count; i++) {
        card.info.location = locations.LIBRARY
        deck.push({...card.info});
      }
    }
    setHordeDeck(shuffle(deck))
  }, [])

  const library = () => {
    return [...hordeDeck].filter(item => item.location === locations.LIBRARY)
  }

  const dealHordeDeck = event => {
    let currentDeck = library()
    let out = []
    let next

    do {
      next = currentDeck.pop()
      next.location=locations.BATTLEFIELD
      out.push(next)
      console.log('next', next, currentDeck.length)
    } while(next.name.toLowerCase().includes("token"))

    setCurrentDeal(out)
    setHordeDeck(currentDeck.concat(out))
    return out
  }

  if(hordeDeck){
    return <>
            <>{library().length} cards</>
            <button onClick={dealHordeDeck}>Horde Action</button>
            <CardViewer cards={currentDeal} />
          </>
  } else {
    return <>Loading Game</>
  }
}

const CardViewer = props => {
  let output = props.cards.map((item, index) => {
    let display;
    if(item.url?.length > 0){
      display=<img src={item.url} />
    } else {
      display = <>
                  <div className="name">{item.name}</div>
                  <div className="rules-text">{item.rulesText}</div>
                </>
    }
    return (
      <div className={"in-play"} key={index}>
        {display}
      </div>
    )
  })

  return <div className="battlefield">
          {output}
          </div>
}